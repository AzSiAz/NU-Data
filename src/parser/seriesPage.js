import * as Promise from 'bluebird';
import requestPromise from 'request-promise';
import cheerio from 'cheerio';
import moment from 'moment';

export async function getSerieData(serie = undefined, page = 1) {
    if (serie == undefined) throw Error("You must specify a serie");
    serie = sanatizeSerieName(serie);
    let $ = await getPageWithData(serie, page);
    return await parseSeriePage($);
}

const parseSeriePage = ($) => {
    return new Promise((res, rej) => {
        let data;
        try {
            data = getData($);
        }
        catch(e) {
            rej(e);
        }
        finally {
            res(data);
        }
    })
}

const getData = ($) => {
    return {
        Title: getTitle($),
        cover: getCover($),
        Synopsis: getSynopsis($),
        Associated_Names: getDifferName($),
        Related: getRelatedSerie($),
        Recommendations: getRecommendations($),
        Type: getType($),
        Genres : getGenres($),
        Tags: getTags($),
        Ratings: getRatings($),
        Languages: getLang($),
        Authors: getAuthors($),
        Artists: getArtists($),
        Year: getYear($),
        StatusCountryOrigin: getStatusCountryOrigin($),
        Licensed: getLicensed($),
        Origin_Publisher: getOriginPublisher($),
        EnglishPublisher: getEnglishPublisher($),
        Release: {
            page: getReleasePage($) || 1,
            pageMax: getReleasePageMax($) || 1,
            data: getRelease($),
        }
    }
}

const getTitle = ($) => {
    return $('.seriestitle').text().trim();
}

const getCover = ($) => {
    return $('.seriesimg').children().first('img').attr('src');
}

const getSynopsis = ($) => {
    return $('#editdescription').children().first().text().trim();
}

const getDifferName = ($) => {
    let text = $('#editassociated').text();
    if (text.match(/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/g)) {
        return [text]
    }
    return $('#editassociated').html().split("<br>").map(i => i.replace(/[\n\t\r]/g,"").trim());
}

const getRelatedSerie = ($) => {
    return $('#editassociated').next('.seriesother').nextUntil('.seriesother').map((i, el) => {
        // return el = $(el).text().trim()
        if (($(el).text().trim() != '')) {
            return {
                title: $(el).text().trim(),
                link: $(el).attr("href")
            }
        }
    }).get()
}

const getRecommendations = ($) => {
    return $('#editassociated').siblings('.seriesother').next('.seriesother').nextUntil('.seriesother').map((i, el) => {
        if (($(el).text().trim() != '')) return $(el).text().trim()
    }).get()
}

const getType = ($) => {
    let el = $('#showtype').children().first();
    return {
        type: el.text().trim(),
        link: el.attr('href')
    }
}

const getGenres = ($) => {
    return $('#seriesgenre').children().map((i, el) => {
        el = $(el);
        return {
            genre: el.text().trim(),
            link: el.attr('href')
        }
    }).get()
}

const getTags = ($) => {
    return $('#showtags').children().map((i, el) => {
        el = $(el);
        return {
            genre: el.text().trim(),
            link: el.attr('href')
        }
    }).get()
}

const getRatings = ($) => {
    return $('.uvotes').text().trim();
}

const getLang = ($) => {
    return $('#showlang').children().map((i, el) => {
        el = $(el);
        if (el.text().trim() != '') {
            return {
                language: el.text().trim(),
                link: el.attr('href')
            }
        }
    }).get()
}

const getAuthors = ($) => {
    return $('#showauthors').children().map((i, el) => {
        el = $(el);
        if (el.text().trim() != '') {
            return {
                name: el.text().trim(),
                link: el.attr('href')
            }
        }
    }).get()
}

const getArtists = ($) => {
    return $('#showartists').children().map((i, el) => {
        el = $(el);
        if (el.text().trim() != '') {
            return {
                name: el.text().trim(),
                link: el.attr('href')
            }
        }
    }).get()
}

const getYear = ($) => {
    return parseInt($('#edityear').text());
}

const getStatusCountryOrigin = ($) => {
    return $('#editstatus').text().replace(/[\n\t\r]/g,"").trim();
}

const getLicensed = ($) => {
    return $('#showtranslated').text().trim();
}

const getOriginPublisher = ($) => {
    return $('#showopublisher').children().map((i, el) => {
        el = $(el);
        if (el.text().trim() != '') {
            return {
                name: el.text().trim(),
                link: el.attr('href')
            }
        }
    }).get()
}

const getEnglishPublisher = ($) => {
    return $('#showepublisher').children().map((i, el) => {
        el = $(el);
        if (el.text().trim() != '') {
            return {
                name: el.text().trim(),
                link: el.attr('href')
            }
        }
    }).get()
}

const getRelease = ($) => {
    return $('#myTable > tbody > tr').map((i, el) => {
        el = $(el) 
        if (el.find('a').first().text()) {
            return {
                date: moment.utc(el.children().first().html(), "MM/DD/YY").toDate(),
                title: el.find('a').last().text().trim(),
                group: el.find('a').first().text().trim(),
                link: el.find('a').last().attr('href')
            };
        }
    }).get();
}

const getReleasePage = ($) => {
    return $('.digg_pagination').find('em').text().trim();
}

const getReleasePageMax = ($) => {
    let last = $('.digg_pagination').children().last()
    // return .prev().text().trim();
    if (last.hasClass('current')) return last.text().trim()
    else return last.prev().text().trim();
}


const sanatizeSerieName = (title) => {
    title = title.trim();
    title = title.replace(/ /g, "-");
    return title.toLowerCase();
}

const getPageWithData = (title, page = 1) => {
    console.log(`Request for ${title} and page ${page}`)
    let options = {
        uri: `http://www.novelupdates.com/series/${title}/?pg=${page}`,
        transform: function (body) {
            return cheerio.load(body);
        }
    };
    return requestPromise(options)
}