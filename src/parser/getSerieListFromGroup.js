//@ts-check
const cheerio = require("cheerio")
const { get } = require("httpie")


/**
 * @param {string} slug
 * @returns {Promise<CheerioStatic>}
 */
const getPageWithData = async (slug) => {
    const res = await get(`https://www.novelupdates.com/group/${slug}`);

    if (res.statusCode >= 400) {
        throw new Error(res.statusMessage);
    }

    return cheerio.load(res.data);
};


/**
 * @param {CheerioStatic} $ 
 * @returns {{title: string, url: string, slug: string}[]}
 */
const extractData = ($) => {
    return $("#grouplst > option").map((i, element) => {
        const el = $(element);
        if (el.text() !== "" && el.text() !== "---")
            return {
                title: el.text().trim(),
                slug: el.attr("value").split("/")[4].trim(),
                url: el.attr("value")
            }
    }).get()
}


/**
 * @param {string} slug Slug representing group on novel-update
 * @returns {Promise<{title: string, url: string, slug: string}[]>}
 */
const getSerieListFromGroup = async (slug) => {
    const $ = await getPageWithData(slug)

    return extractData($)
}

module.exports = getSerieListFromGroup