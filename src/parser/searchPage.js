import * as Promise from 'bluebird';
import requestPromise from 'request-promise';
import cheerio from 'cheerio';

export async function getSearchData (word = "", page = 1) {
    let $ = await getPageWithData(word, page);
    // return $;
    return await searchPageParser($);
}

const searchPageParser = ($) => {
    return new Promise((res, rej) => {
        let data;
        try {
            data = getData($)
        }
        catch(e) {
            throw e
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
            genre: el.find(".s-genre").last().text().split(",").trim(),
            synopsis: sanitize(el.find(".w-blog-entry-short").text())
        }
    }).get();
}

const sanitize = (string) => {
    return string.replace(/[\n\t\r]/g,"").trim();
}

const getMaxPage = ($) => {
    // return 78;
    return ($('.nav-links').children(".page-numbers").last().hasClass("next")) ? 
        $('.nav-links').children(".page-numbers").last().prev().text() : $('.nav-links').children(".page-numbers").last().text();
}

const getCurrentPage = ($) => {
    return $('.page-numbers.current').text();
}

const getPageWithData = (word = "", page = 1) => {
    let options = {
        uri: `http://www.novelupdates.com/page/${page}/?s=${word}&post_type=seriesplans`,
        transform: function (body) {
            return cheerio.load(body);
        }
    };
    return requestPromise(options)
}