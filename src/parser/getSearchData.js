const fetch = require('isomorphic-fetch');
const cheerio = require('cheerio');


const getSearchData = (word = "", page = 1) => {
    return new Promise((res, rej) => {
        getPageWithData(word, page).then($ => {
            return searchPageParser($);
        }).then(resolved => {
            res(resolved);
        }).catch(err => {
            rej(err);
        });
    });
};

const searchPageParser = ($) => {
    return new Promise((res, rej) => {
        let data;
        try {
            data = getData($);
        }
        catch (e) {
            rej(e);
        }
        finally {
            res(data);
        }
    });
};

const getData = ($) => {
    return {
        page: getCurrentPage($),
        pageMax: getMaxPage($),
        data: getPageDataArray($)
    };
};

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
        };
    }).get();
};

const sanitize = (string) => {
    return string.replace(/[\n\t\r]/g, "").trim();
};

const getMaxPage = ($) => {
    return ($('.nav-links').children(".page-numbers").last().hasClass("next")) ?
        $('.nav-links').children(".page-numbers").last().prev().text() : $('.nav-links').children(".page-numbers").last().text();
};

const getCurrentPage = ($) => {
    return $('.page-numbers.current').text();
};

const getPageWithData = (word = "", page = 1) => {
    return new Promise((res, rej) => {
        fetch(`https://novelupdates.com/page/${page}/?s=${word}&post_type=seriesplans`).then(function (response) {
            if (response.status >= 400) {
                rej(Error("Bad response from server"));
            }
            return response.text();
        })
            .then(function (body) {
                res(cheerio.load(body));
            });
    });
};

module.exports = getSearchData;
