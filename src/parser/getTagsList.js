const cheerio = require("cheerio");
const fetch = require("isomorphic-fetch");
const { getPagination } = require("../helpers");

/**
 * @param {CheerioElement} el - cheerio .bdrank element
 */
const parseTags = (_, el) => ({
    tag: cheerio(el).text(),
    description:
        cheerio(el).attr("title") === "No definition found."
            ? null
            : cheerio(el).attr("title")
});
/**
 * @param {CheerioStatic} $
 */
const parsePage = ($) => ({
    ...getPagination($),
    data: $(".staglistall")
        .find("a")
        .map(parseTags)
        .toArray()
});

/**
 * @returns {CheerioStatic}
 */
const getPageWithData = async (page = 1) => {
    const res = await fetch(
        `https://www.novelupdates.com/list-tags/?st=1&pg=${page}`
    );

    if (res.status >= 400) {
        throw new Error(res.statusText);
    }

    return cheerio.load(await res.text());
};

const getTagsList = (page) => getPageWithData(page).then(parsePage);

module.exports = getTagsList;
