const getPagination = $ => {
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

module.exports = { getPagination };
