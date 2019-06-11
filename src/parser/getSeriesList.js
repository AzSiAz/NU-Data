const cheerio = require("cheerio");
const fetch = require("isomorphic-fetch");
const { getPagination } = require("../helpers");

/**
 * Parses novelslisting https://www.novelupdates.com/novelslisting
 *
 * @param {number} page - novels listing page number
 */
const getSeriesList = (page = 1) => getPageWithData(page).then(parsePage);

/**
 * @param {number} page
 * @returns {CheerioStatic}
 */
const getPageWithData = async page => {
    const res = await fetch(
        `https://www.novelupdates.com/novelslisting/?st=1&pg=${page}`
    ).then(res => res.text());

    return cheerio.load(res);
};

/**
 * @param {CheerioStatic} $
 */
const parsePage = $ => ({
    ...getPagination($),
    data: $(".bdrank")
        .map(parseRow)
        .toArray()
});

/**
 * @param {number} i - index
 * @param {CheerioElement} el - cheerio .bdrank element
 */
const parseRow = (_, el) => {
    const row = cheerio(el);
    const a = row.find("a").eq(1);
    const url = a.attr("href");
    const slug = url.split("/")[4];
    const genres = row
        .find(".gennew")
        .map((_, g) => cheerio(g).text())
        .toArray();
    const description = row
        .find(".noveldesc")
        .text()
        .replace(/\.\.\.\smore>>|<<less/gm, "")
        .trim();

    const obj = {
        id: Number(a.attr("id").replace("sid", "")),
        slug,
        url,
        title: a.text(),
        description,
        thumbnail: row.find("img").attr("src"),
        averageRating: Number(
            row
                .find(".lstrate")
                .text()
                .replace(/[()]/g, "")
        ),
        type: row.find(".orgalign > span").text(),
        genres
    };
    return obj;
};

module.exports = getSeriesList;
