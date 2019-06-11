const cheerio = require("cheerio");

const getPagination = ($) => {
    const last = $("div.digg_pagination")
        .children()
        .last();

    return {
        page: Number($("em.current").text()),
        pageMax: Number(
            last.hasClass("next_page") ? last.prev().text() : last.text()
        )
    };
};

const mapSeries = (_, el) => {
    const s = cheerio(el)
        .text()
        .trim();

    if (!s) return;

    return {
        title: s,
        url: cheerio(el).attr("href")
    };
};

module.exports = { getPagination, mapSeries };
