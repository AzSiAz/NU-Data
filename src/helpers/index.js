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

const mapSidebar = (_, el) => {
    el = cheerio(el);

    const s = el.text().trim();

    if (s && s !== "N/A") {
        return {
            name: el.text().trim(),
            link: el.attr("href")
        };
    }
};

const decodeEntities = (s) =>
    cheerio("<div/>")
        .html(s)
        .text();

module.exports = { getPagination, mapSeries, mapSidebar, decodeEntities };
