// @ts-check
const axios = require('axios').default;
const cheerio = require('cheerio');
const moment = require('moment');


/**
 * @param {string} serie
 * @param {number} page
 */
const getSerieData = async (serie = undefined, page = 1) => {
    if (serie === undefined) { throw new Error("You must specify a serie") }

    const $ = await getPageWithData(serie, page)

    return getData($);
};


/**
 * @param {CheerioStatic} $
 */
const getData = ($) => ({
    title: getTitle($),
    cover: getCover($),
    synopsis: getSynopsis($),
    associatedNames: getDifferName($),
    related: getRelatedSerie($),
    recommendations: getRecommendations($),
    type: getType($),
    genres: getGenres($),
    tags: getTags($),
    ratings: getRatings($),
    languages: getLang($),
    authors: getAuthors($),
    artists: getArtists($),
    year: getYear($),
    statusCountryOrigin: getStatusCountryOrigin($),
    licensed: getLicensed($),
    originPublisher: getOriginPublisher($),
    englishPublisher: getEnglishPublisher($),
    release: {
        page: getReleasePage($) || 1,
        pageMax: getReleasePageMax($) || 1,
        data: getRelease($),
    }
});


/**
 * @param {CheerioStatic} $
 * @returns {string}
 */
const getTitle = ($) => $('.seriestitlenu').text().trim();


/**
 * @param {CheerioStatic} $
 * @returns {string}
 */
const getCover = ($) => $('.seriesimg').children().first().attr('src');

/**
 * @param {CheerioStatic} $
 * @returns {string}
 */
const getSynopsis = ($) => $('#editdescription').children().text().trim();


/**
 * @param {CheerioStatic} $
 * @returns {string[]}
 */
const getDifferName = ($) => {
    // let text = $('#editassociated').text();
    // if (text.match(/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/g)) {
    //     return [text];
    // }
    return $('#editassociated').html().split("<br>").map(i => i.replace(/[\n\t\r]/g, "").trim());
};


/**
 * @param {CheerioStatic} $
 * @returns {{title: string, slug: string, url: string}[]}
 */
const getRelatedSerie = ($) => {
    return $('#editassociated').next('.seriesother').nextUntil('.seriesother').map((i, element) => {
        const el = $(element)
        if (el.text().trim() !== '' && el.text().trim() != 'N/A') {
            return {
                title: $(el).text().trim(),
                slug: $(el).attr("href").split("/")[4].trim(),
                url: $(el).attr("href"),
            };
        }
    }).get();
};


/**
 * @param {CheerioStatic} $
 * @returns {{title: string, slug: string, url: string}[]}
 */
const getRecommendations = ($) => {
    // Recommendations
    return $(".seriesother").filter((i, element) => $(element).text() === "Recommendations").nextUntil(".seriesother").map((i, element) => {
        const el = $(element)
        if (el.text().trim() !== '' && el.text().trim() != 'N/A') {
            return {
                title: el.text().trim(),
                slug: el.attr('href').split("/")[4].trim(),
                url: el.attr('href')
            }
        }
    }).get()
};


/**
 * @param {CheerioStatic} $
 * @returns {{type: string, slug: string, url: string}}
 */
const getType = ($) => {
    let el = $('#showtype').children().first();
    if (el.text().trim() !== '' && el.text().trim() != 'N/A') {
        return {
            type: el.text().trim(),
            slug: el.attr('href').split("/")[4].trim(),
            url: el.attr('href')
        };
    }
};


/**
 * @param {CheerioStatic} $
 * @returns {{genre: string, slug: string, url: string}[]}
 */
const getGenres = ($) => {
    return $('#seriesgenre').children().map((i, element) => {
        const el = $(element);
        if (el.text().trim() !== '' && el.text().trim() != 'N/A') {
            return {
                genre: el.text().trim(),
                slug: el.attr('href').split("/")[4].trim(),
                url: el.attr('href')
            };
        }
    }).get();
};


/**
 * @param {CheerioStatic} $
 * @returns {{tag: string, slug: string, url: string}[]}
 */
const getTags = ($) => {
    return $('#showtags').children().map((i, element) => {
        const el = $(element);
        if (el.text().trim() !== '' && el.text().trim() != 'N/A') {
            return {
                tag: el.text().trim(),
                slug: el.attr('href').split("/")[4].trim(),
                link: el.attr('href')
            };
        }
    }).get();
};


/**
 * @param {CheerioStatic} $
 * @returns {string}
 */
const getRatings = ($) => $('.uvotes').text().trim().replace(/[()]/g, "")


/**
 * @param {CheerioStatic} $
 * @returns {{language: string, slug: string, url: string}[]}
 */
const getLang = ($) => {
    return $('#showlang').children().map((i, element) => {
        const el = $(element);
        if (el.text().trim() !== '' && el.text().trim() != 'N/A') {
            return {
                language: el.text().trim(),
                slug: el.attr('href').split("/")[4].trim(),
                url: el.attr('href')
            };
        }
    }).get();
};


/**
 * @param {CheerioStatic} $
 * @returns {{name: string, slug: string, url: string}[]}
 */
const getAuthors = ($) => {
    return $('#showauthors').children().map((i, element) => {
        const el = $(element);
        if (el.text().trim() !== '' && el.text().trim() != 'N/A') {
            return {
                name: el.text().trim(),
                slug: el.attr('href').split("/")[4].trim(),
                url: el.attr('href')
            };
        }
    }).get();
};


/**
 * @param {CheerioStatic} $
 * @returns {{name: string, slug: string, url: string}[]}
 */
const getArtists = ($) => {
    return $('#showartists').children().map((i, element) => {
        const el = $(element);
        if (el.text().trim() !== '' && el.text().trim() != 'N/A') {
            return {
                name: el.text().trim(),
                slug: el.attr('href').split("/")[4].trim(),
                url: el.attr('href')
            };
        }
    }).get();
};


/**
 * @param {CheerioStatic} $
 * @returns {number}
 */
const getYear = ($) => parseInt($('#edityear').text(), 10);


/**
 * @param {CheerioStatic} $
 * @returns {string}
 */
const getStatusCountryOrigin = ($) => $('#editstatus').text().replace(/[\n\t\r]/g, "").trim();


/**
 * @param {CheerioStatic} $
 * @returns {string}
 */
const getLicensed = ($) => $('#showtranslated').text().trim();


/**
 * @param {CheerioStatic} $
 * @returns {{name: string, slug: string, url: string}[]}
 */
const getOriginPublisher = ($) => {
    return $('#showopublisher').children().map((i, element) => {
        const el = $(element);
        if (el.text().trim() !== '' && el.text().trim() != 'N/A') {
            return {
                name: el.text().trim(),
                slug: el.attr('href').split("/")[4].trim(),
                url: el.attr('href')
            };
        }
    }).get();
};


/**
 * @param {CheerioStatic} $
 * @returns {{name: string, slug: string, url: string}[]}
 */
const getEnglishPublisher = ($) => {
    return $('#showepublisher').children().map((i, element) => {
        const el = $(element);

        if (el.text().trim() !== '' && el.text().trim() != 'N/A') {
            return {
                name: el.text().trim(),
                slug: el.attr('href').split("/")[4].trim(),
                url: el.attr('href')
            };
        }
    }).get();
};


/**
 * @param {CheerioStatic} $
 * @returns {{date: Date, group: string, groupSlug: string, chapter: string, chapterLink: string}[]}
 */
const getRelease = ($) => {
    return $('#myTable > tbody > tr').map((i, element) => {
        const el = $(element);
        if (el.text().trim() !== '' && el.text().trim() != 'N/A') {
            return {
                date: moment.utc(el.children().first().html(), "MM/DD/YY").toDate(),
                group: el.find('a').first().text().trim(),
                groupSlug: el.find('a').first().attr("href").trim().split("/")[4],
                chapter: el.find('a').last().text().trim(),
                chapterLink: el.find('a').last().attr('href')
            };
        }
    }).get();
};


/**
 * @param {CheerioStatic} $
 * @returns {number}
 */
const getReleasePage = ($) => parseInt($('.digg_pagination').find('em').text().trim(), 10)


/**
 * @param {CheerioStatic} $
 * @returns {number}
 */
const getReleasePageMax = ($) => {
    let last = $('.digg_pagination').children().last();

    return last.hasClass('current') ? parseInt(last.text().trim(), 10) : parseInt(last.prev().text().trim(), 10)
};


/**
 * @param {string} title
 * @param {number} page
 * @returns {Promise<CheerioStatic>}
 */
const getPageWithData = async (title, page = 1) => {
    const response = await axios(`https://www.novelupdates.com/series/${title}/?pg=${page}`)
    if (response.status >= 400) {
        throw new Error("Bad response from server")
    }

    return cheerio.load(response.data)
};

module.exports = getSerieData;
