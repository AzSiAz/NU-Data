const getPagination = ($) => {
    const last = $("div.digg_pagination")
        .children()
        .last();

    return {
        page: parseInt($("em.current").text(), 10),
        pageMax: parseInt(
            last.hasClass("next_page") ? last.prev().text() : last.text(),
            10
        )
    };
};

module.exports = { getPagination };
