// @ts-check
const { get } = require('httpie');
const cheerio = require('cheerio');

/**
 * 
 * @typedef {Object} RankingData
 * @property {number} page
 * @property {number} pageMax
 * @property {Novel[]} data
 * 
 * @typedef {Object} Novel
 * @property {string} title
 * @property {string} url
 * @property {string} rank
 * @property {number} rating
 * @property {string} lang
 * @property {string} genres
 * @property {string} synopsis
 * @property {string} nbrRelease
 */


/**
 * @param {string} type
 * @param {number} page
 * @returns {Promise<RankingData>}
 */
const getRankingData = async (type = 'popular', page = 1) => {
    type = switchType(type);
    const $ = await getPageWithData(type, page).catch(err => { return Promise.reject(err) })

    return extractData($);
};


/**
 * @param {string} type 
 * @returns {string}
 */
const switchType = (type) => {
    switch (type) {
        case 'popular':
        case 'popmonth':
            return type;
        default:
            return 'popular';
    }
};


/**
 * @param {CheerioStatic} $
 * @returns {RankingData}
 */
const extractData = ($) => ({
    page: getCurrentPage($),
    pageMax: getMaxPage($),
    data: parseTableData($)
});


/**
 * @param {CheerioStatic} $ 
 * @returns {Novel[]}
 */
const parseTableData = ($) => {
    return $('.search_main_box_nu').map((i, element) => {
        const el = $(element);
        return {
            title: el.find('.search_body_nu .search_title a').text().trim(),
            url: el.find('.search_body_nu .search_title a').attr('href').trim(),
            cover: el.find('.search_img_nu > img').attr('src'),
            rank: el.find('.search_body_nu .search_title .genre_rank').text().split("#")[1].trim(),
            lang: el.find('.search_img_nu .search_ratings span').text(),
            rating: parseFloat(el.find(".search_img_nu .search_ratings").text().replace(/[^0-9.,]+/, "")),
            genres: getGenre(el, $),
            nbrRelease: el.find('.search_body_nu .search_stats .ss_desk').first().text().trim(),
            synopsis: getSynopsis(el),
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
const getGenre = (el, $) => {
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
    const el = $('div.digg_pagination').children().last()

    return (el.hasClass('next_page')) ? parseInt(el.prev().text(), 10) : parseInt(el.text(), 10);
};


/**
 * @param {CheerioStatic} $
 * @returns {number}
 */
const getCurrentPage = ($) => parseInt($('em.current').text(), 10)


/**
 * @param {string} type
 * @param {number} page
 * @returns {Promise<CheerioStatic>}
 */
const getPageWithData = async (type = 'popular', page = 1) => {
    const response = await get(`https://www.novelupdates.com/series-ranking/?rank=${type}&pg=${page}`)
    if (response.statusCode >= 400) {
        throw new Error('Bad response from server')
    }

    return cheerio.load(response.data)
};

module.exports = getRankingData;
