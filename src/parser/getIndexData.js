// @ts-check
const { get } = require('httpie');
const cheerio = require('cheerio');

/**
 * @typedef {Object} IndexData
 * @property {number} page
 * @property {number} pagePrev
 * @property {number} pageMax
 * @property {Release} latestTranslation
 * 
 * @typedef {Object} Release
 * @property {string} title
 * @property {ReleaseRow[]} data
 * 
 * @typedef {Object} ReleaseRow
 * @property {TitleRow} title
 * @property {GroupRow} group
 * @property {ChapterRow} chapter
 * 
 * @typedef {Object} TitleRow
 * @property {string} title
 * @property {string} url
 * 
 * @typedef {Object} GroupRow
 * @property {string} group
 * @property {string} url
 * 
 * @typedef {Object} ChapterRow
 * @property {string} chapter
 * @property {string} url
 */


/**
 * @param {number} page
 * @returns {Promise<IndexData>}
 */
const getIndexData = (page = 1) => getPageWithData(page).then($ => extractData($))

/**
 * 
 * @param {CheerioStatic} $
 * @returns {IndexData} 
 */
const extractData = ($) => ({
    page: getReleasePage($) || 1,
    pagePrev: getReleasePage($) - 1 || 1,
    pageMax: getReleasePageMax($) || 1,
    latestTranslation: getRelease($)
});


/**
 * @param {CheerioStatic} $
 * @returns {number}
 */
const getReleasePage = $ => parseInt($('.digg_pagination').find('em').text().trim());


/**
 * @param {CheerioStatic} $
 * @returns {number}
 */
const getReleasePageMax = ($) => {
    let last = $('.digg_pagination').children().last();

    if (last.hasClass('current')) {
        return parseInt(last.text().trim());
    } else {
        return parseInt(last.prev().text().trim());
    }
};

/**
 * @param {CheerioStatic} $
 * @returns {Release}
 */
const getRelease = ($) => {
    return $('#myTable').map((i, el) => {
        el = $(el);
        return {
            title: el.prev().text(),
            data: el.find('tr').map((i2, el2) => {
                el2 = $(el2);
                if (el2.find('a').first().text()) {
                    return {
                        title: {
                            title: el2.find('a').first().attr('title'),
                            url: el2.find('a').first().attr('href')
                        },
                        group: {
                            group: el2.find('a').last().text().trim(),
                            url: el2.find('a').last().attr('href')
                        },
                        chapter: {
                            chapter: el2.find('.chp-release').first().text(),
                            url: el2.find('.chp-release').first().attr('href')
                        }
                    };
                }
            }).get()
        };
    }).get();
};

/**
 * @param {number} page
 * @returns {Promise<CheerioStatic>}
 */
const getPageWithData = async (page = 1) => {
    const response = await get(`https://www.novelupdates.com/?pg=${page}`)
    if (response.statusCode >= 400) {
        throw new Error("Bad response from server");
    }

    return cheerio.load(response.data)
};

module.exports = getIndexData;
