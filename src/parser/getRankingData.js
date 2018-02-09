const Promise = require('bluebird');
const fetch = require('isomorphic-fetch');
const cheerio = require('cheerio');


const getRankingData = async (type = 'popular', page = 1) => {
    type = switchType(type);
    let $ = await getPageWithData(type, page).catch(err => { return Promise.reject(err) })
    return RankingPageParser($);
};

const switchType = (type) => {
    switch (type) {
        case 'popular':
        case 'popmonth':
            return type;
        default:
            return 'popular';
    }
};

const RankingPageParser = async ($) => {
    try {
        let data = await getData($);
        return data
    }
    catch (e) {
        return Promise.reject(e);
    }
};

const getData = async ($) => {
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
            nbrRelease: el.children().last().find('.sfstext').last().html().split('</b>')[1]
        };
    }).get();
};

const getSynopsis = ($, el) => {
    let text = el.children().last().find('.noveldesc').last().text();
    let text2 = text.split('... more>>');
    let text3 = text2[1].split('<<less');
    text = text2[0] + text3[0];
    return text.replace(/[\n\t\r]/g,' ').trim();
};

const getGenre = ($, el) => {
    return el.children().last().find('.rankgenre').children().map((i, el2) => {
        el2 = $(el2);
        return el2.text();
    }).get();
};

const getMaxPage = ($) => {
    return ($('div.digg_pagination').children().last().hasClass('next_page')) ?
        $('div.digg_pagination').children().last().prev().text() : $('div.digg_pagination').children().last().text();
};

const getCurrentPage = ($) => {
    return $('em.current').text();
};

const getPageWithData = async (type = 'popular', page = 1) => {
    try {
        let response = await fetch(`http://www.novelupdates.com/series-ranking/?rank=${type}&pg=${page}`)
        if (response.status >= 400) {
            return Promise.reject(new Error('Bad response from server'))
        }
        let body = await response.text()
        return cheerio.load(body)
    }
    catch(err) {
        return Promise.reject(new Error(`Can't download html for http://www.novelupdates.com/series-ranking/?rank=${type}&pg=${page}`))
    }

};

module.exports = getRankingData;
