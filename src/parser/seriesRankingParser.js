const Promise = require('bluebird');
const fetch = require('isomorphic-fetch');
const cheerio = require('cheerio');


const getRankingData = (type = "popular", page = 1) => {
    return new Promise((res, rej) => {
        type = switchType(type);
        getPageWithData(type, page).then($ => {
            return RankingPageParser($);
        }).then(resolved => {
        res(resolved);
        }).catch(err => {
            rej(err);
        });
    });
};

const switchType = (type) => {
    switch (type) {
        case "popular":
            return type;
        case "popmonth":
            return type;
        default:
            return "popular";
    }
};

const RankingPageParser = ($) => {
    return new Promise((res, rej) => {
        let data;
        try {
            data = getData($);
        }
        catch (e) {
            rej(e);
        }
        finally {
            res(data);
        }
    });
};

const getData = ($) => {
    return {
        page: getCurrentPage($),
        pageMax: getMaxPage($),
        data: ParseTableData($)
    };
};

const ParseTableData = ($) => {
    return $('#myTable > tbody > tr').map((i, el) => {
        el = $(el);
        return {
            title: el.children().last().find('a').last().text().trim(),
            link: el.children().last().find('a').last().attr('href'),
            number: el.find('span.ranknum').text().trim(),
            lang: el.find('td.orgalign').text(),
            genre: getGenre($, el),
            synpsis: getSynopsis($, el),
            nbrRelease: el.children().last().find('.sfstext').last().html().split('</b>')[1].trim()
        };
    }).get();
};

const getSynopsis = ($, el) => {
    let text = el.children().last().find('.noveldesc').last().text();
    let text2 = text.split('... more>>');
    let text3 = text2[1].split('<<less');
    text = text2[0] + text3[0];
    return text.replace(/[\n\t\r]/g," ").trim();
};

const getGenre = ($, el) => {
    return el.children().last().find('.rankgenre').children().map((i, el2) => {
        el2 = $(el2);
        return el2.text();
    }).get();
};

const getMaxPage = ($) => {
    return ($('div.digg_pagination').children().last().hasClass("next_page")) ?
        $('div.digg_pagination').children().last().prev().text() : $('div.digg_pagination').children().last().text();
};

const getCurrentPage = ($) => {
    return $('em.current').text();
};

const getPageWithData = (type = "popular", page = 1) => {
    return new Promise((res, rej) => {
        fetch(`http://www.novelupdates.com/series-ranking/?rank=${type}&pg=${page}`).then(function(response) {
            if (response.status >= 400) {
                rej(Error("Bad response from server"));
            }
            return response.text();
        })
        .then(function(body) {
            res(cheerio.load(body));
        });
    });
};

module.exports = getRankingData;
