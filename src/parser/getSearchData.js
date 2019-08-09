// @ts-check
const fetch = require('isomorphic-fetch');
const cheerio = require('cheerio');

/**
 * 
 * @typedef {Object} SearchData
 * @property {number} page
 * @property {number} pageMax
 * @property {Novel[]} data
 * 
 * @typedef {Object} Novel
 * @property {string} title
 * @property {string} url
 * @property {string} cover
 * @property {number} rating
 * @property {string[]} genres
 * @property {string} synopsis
 */


/**
 * @param {string} word
 * @param {number} page
 * @returns {Promise<SearchData>}
 */
const getSearchData = (word = "", page = 1) => getPageWithData(word, page).then($ => extractData($))


/**
 * @param {CheerioStatic} $
 * @returns {SearchData}
 */
const extractData = ($) => ({
    page: getCurrentPage($),
    pageMax: getMaxPage($),
    data: getPageDataArray($)
});


/**
 * @param {CheerioStatic} $
 * @returns {Novel[]}
 */
const getPageDataArray = ($) => {
    return $('.search_main_box_nu').map((i, element) => {
        const el = $(element);
        return {
            title: el.find('.search_body_nu .search_title a').text().trim(),
            url: el.find('.search_body_nu .search_title a').attr('href').trim(),
            cover: el.find(".search_img_nu img").attr("src"),
            rating: parseFloat(el.find(".search_img_nu .search_ratings").text().replace(/[^0-9.,]+/, "")),
            genres: getGenres(el, $),
            synopsis: getSynopsis(el)
        };
    }).get();
};


/**
 * @param {Cheerio} el 
 * @returns {string}
 */
const getSynopsis = (el) => {
    el.find(".search_body_nu .search_title").remove()
    el.find(".search_body_nu .search_stats").remove()
    el.find(".search_body_nu .search_genre").remove()

    el.find(".search_body_nu .dots").remove()
    el.find(".search_body_nu .morelink.list").remove()
    el.find(".search_body_nu .testhide p").remove()
    el.find(".search_body_nu .testhide .morelink.list").remove()

    return el.find('.search_body_nu').text().trim().replace(/[\n\t\r]/g, " ")
};


/**
 * @param {Cheerio} el
 * @param {CheerioStatic} $
 * @returns {string[]}
 */
const getGenres = (el, $) => {
    return el.find('.search_body_nu .search_genre .gennew.search').map((i, element) => {
        const el2 = $(element);
        return el2.text();
    }).get();
};


/**
 * @param {CheerioStatic} $
 * @returns {number}
 */
const getMaxPage = ($) => {
    const el = $('.nav-links').children(".page-numbers").last()
    return (el.hasClass("next")) ? parseInt(el.prev().text()) : parseInt(el.text());
};


/**
 * @param {CheerioStatic} $
 * @returns {number}
 */
const getCurrentPage = ($) => parseInt($('.page-numbers.current').text());


/**
 * @param {string} word
 * @param {number} page
 * @returns {Promise<CheerioStatic>}
 */
const getPageWithData = async (word = "", page = 1) => {
    const response = await fetch(`https://novelupdates.com/page/${page}/?s=${word}&post_type=seriesplans`)
    if (response.status >= 400) {
        throw new Error("Bad response from server")
    }

    const body = await response.text();
    
    return cheerio.load(body)
};

module.exports = getSearchData;
