import * as Promise from 'bluebird';
import requestPromise from 'request-promise';
import cheerio from 'cheerio';

export function getSearchData (word = "", page = 1) {
    return new Promise(async (res, err) => {    
        let $ = await getPageWithData(word, page);
        res(await searchPageParser($));
    })
}

const searchPageParser = ($) => {
    return new Promise((res, rej) => {
        let data;
        try {
            data = getData($)
        }
        catch(e) {
            rej(e)
        }
        finally {
            res(data);
        }
    })
}

const getData = ($) => {
    return {
        page: getCurrentPage($),
        pageMax: getMaxPage($),
        data: getPageDataArray($)
    }
}

const getPageDataArray = ($) => {
    return $('div.w-blog-entry-h').map((i, el) => {
        el = $(el);
        return {
            title: el.find(".entry-title").text().trim(),
            cover: el.find("img").attr("src"),
            link: el.find(".w-blog-entry-link").attr("href"),
            rating: parseFloat(el.find(".userrate").text().replace(/[^0-9.,]+/, "")),
            genre: el.find(".s-genre").last().text().split(","),
            synopsis: sanitize(el.find(".w-blog-entry-short").text())
        }
    }).get();
}

const sanitize = (string) => {
    return string.replace(/[\n\t\r]/g,"").trim();
}

const getMaxPage = ($) => {
    return ($('.nav-links').children(".page-numbers").last().hasClass("next")) ? 
        $('.nav-links').children(".page-numbers").last().prev().text() : $('.nav-links').children(".page-numbers").last().text();
}

const getCurrentPage = ($) => {
    return $('.page-numbers.current').text();
}

const getPageWithData = (word = "", page = 1) => {
    let options = {
        uri: `http://novelupdates.com/page/${page}/?s=${word}&post_type=seriesplans`,
        transform: function (body) {
            return cheerio.load(body);
        }
    };
    console.log(`Request for ${word} and page ${page} with url: ${options.uri}`);
    return requestPromise(options);
}