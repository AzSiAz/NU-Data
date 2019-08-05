const cheerio = require("cheerio")
const fetch = require("isomorphic-fetch")

/**
 * @param {string} slug
 * @returns {Promise<CheerioStatic>}
 */
const getPageWithData = async (slug) => {
    const res = await fetch(`https://www.novelupdates.com/group/${slug}`);

    if (res.status >= 400) {
        throw new Error(res.statusText);
    }

    return cheerio.load(await res.text());
};

/**
 * @param {CheerioStatic} $ 
 */
const parsePage = ($) => {
    return $("#grouplst > option").map((i, rawEl) => {
        const el = $(rawEl);
        return {
            title: el.text().trim(),
            link: el.attr("value")
        }
    }).get()
}

/**
 * @param {string} slug Slug representing group on novel-update
 * @returns {{title: string, link: string}[]}
 */
const getSerieListFromGroup = async (slug) => {
    const $ = await getPageWithData(slug)

    return parsePage($)
}

module.exports = getSerieListFromGroup