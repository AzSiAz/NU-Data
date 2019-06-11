const fetch = require("isomorphic-fetch");
const cheerio = require("cheerio");
const moment = require("moment");
const { getPagination, mapSeries } = require("../helpers");

const getTitle = ($) => {
    return $(".seriestitlenu")
        .text()
        .trim();
};

const getCover = ($) => {
    return $(".seriesimg")
        .children()
        .first("img")
        .attr("src");
};

const getSynopsis = ($) => {
    return $("#editdescription")
        .children()
        .text()
        .trim();
};

const getRawSynopsis = ($) => $("#editdescription").html();

const getDifferName = ($) =>
    $("#editassociated")
        .html()
        .split("<br>");

/**
 * @param {CheerioStatic}
 */
const getTextNodes = ($) =>
    $(".wpb_wrapper")
        .contents()
        .filter(
            (_, el) => el.type === "text" && /^\(.*\)$/.test(el.data.trim())
        )
        .map((_, el) =>
            $(el)
                .text()
                .trim()
                .replace(/[()]/g, "")
        )
        .toArray();

/**
 *
 * @param {CheerioStatic} $
 */
const getRelatedSerie = ($, types) => {
    const rs = $("h5.seriesother:nth-child(8)")
        .nextUntil(".seriesother")
        .map(mapSeries)
        .get();

    return rs.map((s, i) => ({ ...s, type: types[i] }));
};

/**
 *
 * @param {CheerioStatic} $
 */
const getRecommendations = ($, types, rsLen) => {
    const rm = $("h5.seriesother:nth-child(19)")
        .nextUntil("div")
        .map(mapSeries)
        .get();

    return rm.map((s, i) => ({ ...s, type: Number(types[i + rsLen]) }));
};

const getType = ($) => {
    let el = $("#showtype")
        .children()
        .first();
    return {
        type: el.text().trim(),
        link: el.attr("href")
    };
};

const getGenres = ($) => {
    return $("#seriesgenre")
        .children()
        .map((i, el) => {
            el = $(el);
            return {
                genre: el.text().trim(),
                link: el.attr("href")
            };
        })
        .get();
};

const getTags = ($) => {
    return $("#showtags")
        .children()
        .map((_, el) => {
            el = $(el);
            return {
                tag: el.text().trim(),
                link: el.attr("href")
            };
        })
        .get();
};

/**
 *
 * @param {CheerioStatic} $
 */
const getRatings = ($) => {
    const getVote = (s) => {
        const {
            groups: { votes }
        } = /(?<votes>\d+)\svotes/g.exec(s);

        return Number(votes);
    };

    const vote = $(".votetext");

    return {
        1: getVote(vote.eq(0).text()),
        2: getVote(vote.eq(1).text()),
        3: getVote(vote.eq(2).text()),
        4: getVote(vote.eq(3).text()),
        5: getVote(vote.eq(4).text())
    };
};

const getLang = ($) => {
    return $("#showlang")
        .children()
        .map((_, el) => {
            el = $(el);
            if (el.text().trim() !== "") {
                return {
                    language: el.text().trim(),
                    link: el.attr("href")
                };
            }
        })
        .get();
};

const getAuthors = ($) => {
    return $("#showauthors")
        .children()
        .map((_, el) => {
            el = $(el);
            if (el.text().trim() !== "") {
                return {
                    name: el.text().trim(),
                    link: el.attr("href")
                };
            }
        })
        .get();
};

const getArtists = ($) => {
    return $("#showartists")
        .children()
        .map((_, el) => {
            el = $(el);

            const s = el.text().trim();

            if (s && s !== "N/A") {
                return {
                    name: el.text().trim(),
                    link: el.attr("href")
                };
            }
        })
        .get();
};

const getYear = ($) => Number($("#edityear").text());

const getStatusCountryOrigin = ($) =>
    $("#editstatus")
        .text()
        .replace(/[\n\t\r]/g, "")
        .trim();

const getLicensed = ($) => /yes/i.test($("#showtranslated").text());

const getOriginPublisher = ($) => {
    return $("#showopublisher")
        .children()
        .map((_, el) => {
            el = $(el);
            if (el.text().trim() !== "") {
                return {
                    name: el.text().trim(),
                    link: el.attr("href")
                };
            }
        })
        .get();
};

const getEnglishPublisher = ($) => {
    return $("#showepublisher")
        .children()
        .map((i, el) => {
            el = $(el);
            if (el.text().trim() !== "") {
                return {
                    name: el.text().trim(),
                    link: el.attr("href")
                };
            }
        })
        .get();
};

const getRelease = ($) => {
    return $("#myTable > tbody > tr")
        .map((i, el) => {
            el = $(el);
            if (
                el
                    .find("a")
                    .first()
                    .text()
            ) {
                return {
                    date: moment
                        .utc(
                            el
                                .children()
                                .first()
                                .html(),
                            "MM/DD/YY"
                        )
                        .toDate(),
                    title: el
                        .find("a")
                        .last()
                        .text()
                        .trim(),
                    group: el
                        .find("a")
                        .first()
                        .text()
                        .trim(),
                    link: el
                        .find("a")
                        .last()
                        .attr("href")
                };
            }
        })
        .get();
};

const sanitizeSerieName = (title) => {
    title = title.trim();
    title = title.replace(/\s/g, "-");
    return title.toLowerCase();
};

const getPageWithData = (title, page = 1) => {
    return new Promise((res, rej) => {
        fetch(`https://www.novelupdates.com/series/${title}/?pg=${page}`)
            .then(function(response) {
                if (response.status >= 400) {
                    rej(Error("Bad response from server"));
                }
                return response.text();
            })
            .then(function(body) {
                res(cheerio.load(body, { decodeEntities: false }));
            });
    });
};

const getData = ($) => {
    const types = getTextNodes($);
    const related = getRelatedSerie($, types);
    const recommendations = getRecommendations($, types, related.length);
    const title = getTitle($);

    return {
        slug: sanitizeSerieName(title),
        title,
        cover: getCover($),
        synopsis: getSynopsis($),
        rawSynopsis: getRawSynopsis($),
        associatedNames: getDifferName($),
        related,
        recommendations,
        type: getType($),
        genres: getGenres($),
        tags: getTags($),
        ratings: getRatings($),
        languages: getLang($),
        authors: getAuthors($),
        artists: getArtists($),
        year: getYear($),
        statusCOO: getStatusCountryOrigin($),
        licensed: getLicensed($),
        originPublisher: getOriginPublisher($),
        englishPublisher: getEnglishPublisher($),
        releases: {
            ...getPagination($),
            data: getRelease($)
        }
    };
};

const parseSeriePage = ($) => {
    return new Promise((res, rej) => {
        let data;
        try {
            data = getData($);
        } catch (e) {
            rej(e);
        } finally {
            res(data);
        }
    });
};

const getSerieData = (serie = undefined, page = 1) => {
    return new Promise((res, rej) => {
        if (serie === undefined) {
            rej(new Error("You must specify a serie"));
        }
        serie = sanitizeSerieName(serie);

        getPageWithData(serie, page)
            .then(($) => {
                return parseSeriePage($);
            })
            .then((resolved) => {
                res(resolved);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

module.exports = getSerieData;
