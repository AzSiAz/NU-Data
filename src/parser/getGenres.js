const cheerio = require("cheerio");
const fetch = require("isomorphic-fetch");

/**
 * @param {CheerioStatic} $ - cheerio .bdrank element
 */
const parseGenres = ($) =>
    $(".w-blog-content > table:nth-child(1) > tbody:nth-child(1) > tr")
        .map((_, row) => {
            const [genre, description] = $(row)
                .children()
                .toArray();
            if (description.name === "th" || genre.name === "th") return;
            return {
                genre: $(genre).text(),
                description: $(description).text()
            };
        })
        .toArray();

/**
 * @returns {CheerioStatic}
 */
const getPageWithData = async () => {
    const res = await fetch("https://www.novelupdates.com/genre-explanation/");

    if (res.status >= 400) {
        throw new Error(res.statusText);
    }

    return cheerio.load(await res.text());
};

const getGenres = () => getPageWithData().then(parseGenres);

module.exports = getGenres;
