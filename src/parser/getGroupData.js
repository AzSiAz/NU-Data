// @ts-check
const fetch = require('isomorphic-fetch');
const cheerio = require('cheerio');
const moment = require('moment');

/**
 * @typedef {Object} GroupData
 * @property {string} title
 * @property {string} url
 * @property {string} nbrRelease
 * @property {Release} release
 * 
 * @typedef {Object} ReleaseRow
 * @property {Date} date
 * @property {string} title
 * @property {string} novelSlug
 * @property {string} chapter
 * @property {string} chapterLink
 * 
 * @typedef {Object} Release
 * @property {number} page
 * @property {number} pageMax
 * @property {ReleaseRow[]} data
 */

/**
 * @param {string} groupSlug slug for group
 * @param {number} page page number
 * @returns {Promise<GroupData>}
 */
const getGroupData = async (groupSlug = undefined, page = 1) => {
    if (groupSlug === undefined || groupSlug === "" || groupSlug === null) { 
        throw new Error("You must specify a group slug");
    }

    const $ = await getPageWithData(groupSlug, page)

    return extractData($)
};


/**
 * @param {CheerioStatic} $ 
 * @returns {GroupData}
 */
const extractData = ($) => ({
    ...getBaseData($),
    release: {
        page: getReleasePage($) || 1,
        pageMax: getReleasePageMax($) || 1,
        data: getRelease($),
    }
});


/**
 * @param {CheerioStatic} $
 * @returns {{title: string, url: string, nbrRelease: string}}
 */
const getBaseData = ($) => {
    let title, url, nbrRelease;
    $('table').first().find('tr').map((i, element) => {
        const el = $(element);
        if (el.find('td').text() !== "") {
            switch (i) {
                case 1:
                    title = el.find('td').last().text().trim();
                    break;
                case 2:
                    url = el.find('a').last().attr('href');
                    break;
                case 4:
                    nbrRelease = el.find('td').last().text().trim();
                    break;
            }
        }
    });
    return {
        title,
        url,
        nbrRelease
    };
};


// https://www.novelupdates.com/series/kyoukai-senjou-no-horizon/
/**
 * @param {CheerioStatic} $
 * @returns {ReleaseRow[]}
 */
const getRelease = ($) => {
    return $('#myTable').last().find("tbody > tr").map((i, element) => {
        const el = $(element);
        if (el.find('a').first().text()) {
            return {
                date: moment.utc(el.children().first().html(), "MM/DD/YY").toDate(),
                title: el.find('a').first().text().trim(),
                novelSlug: el.find('a').first().attr("href").trim().split("/")[4],
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
const getReleasePage = ($) => parseInt($('.digg_pagination').find('em').text().trim(), 10);


/**
 * @param {CheerioStatic} $
 * @returns {number}
 */
const getReleasePageMax = ($) => {
    let last = $('.digg_pagination').children().last();
    if (last.hasClass('current')) { 
        return parseInt(last.text().trim(), 10); 
    } else { 
        return parseInt(last.prev().text().trim(), 10);
    }
};


/**
 * @param {string} group
 * @param {number} page
 * @returns {Promise<CheerioStatic>}
 */
const getPageWithData = async (group, page) => {
    const response = await fetch(`https://www.novelupdates.com/group/${group}/?pg=${page}`)
    if (response.status >= 400) {
        throw new Error("Bad response from server");
    }

    const body = await response.text();
    
    return cheerio.load(body)
};

module.exports = getGroupData;
