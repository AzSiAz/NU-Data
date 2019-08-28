//@ts-check
const cheerio = require("cheerio");
const { get } = require("httpie");
const { getPagination } = require("../helpers");


/**
 * @param {number} _ - index
 * @param {CheerioElement} el - cheerio .bdrank element
 */
const parseRow = (_, el) => {
    const row = cheerio(el);

    const a = row.find("div.search_title > a");
    const id = row.find("div.search_title > span").attr("id").replace("sid", "");
    const url = a.attr("href");
    const slug = url.split("/")[4];
    const type = row.find(".search_img_nu > .search_ratings > span").text()
    const thumbnail = row.find("img").attr("src")
    const genres = row
        .find(".search_genre > .gennew")
        .map((_, g) => cheerio(g).text())
        .toArray();
    const rawDescription = row
        .find(".search_body_nu")
        .text()
        .replace(/\.\.\.\smore>>|<<less/gm, "")
        .trim();

    const description = rawDescription.split(genres.join(" "))[1].replace(/\n/gm, " ")
    const rating = row
        .find(".search_img_nu > .search_ratings")
        .text()
        .replace(/[()]/g, "")
        .replace(type, "")
        .trim()
    const updateDate = row.find(".search_body_nu > .search_stats > .ss_desk").last().text()

    return {
        id: parseInt(id, 10),
        slug,
        url,
        title: a.text(),
        description,
        thumbnail,
        averageRating: parseFloat(rating),
        type,
        genres,
        updateDate
    };
};


/**
 * @param {CheerioStatic} $
 */
const extractData = ($) => ({
    ...getPagination($),
    data: $(".search_main_box_nu")
        .map(parseRow)
        .toArray()
});


/**
 * @param {number} page
 * @returns {Promise<CheerioStatic>}
 */
const getPageWithData = async (page) => {
    const res = await get(`https://www.novelupdates.com/novelslisting/?st=1&pg=${page}`);
    if (res.statusCode >= 400) {
        throw new Error(res.statusMessage);
    }

    return cheerio.load(res.data);
};


/**
 * Parses novelslisting https://www.novelupdates.com/novelslisting
 *
 * TODO: filter/sort?
 * @param {number} page - novels listing page number
 */
const getSeriesList = (page = 1) => getPageWithData(page).then(extractData);

module.exports = getSeriesList;
