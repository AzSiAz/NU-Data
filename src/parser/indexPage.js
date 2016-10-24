import 'babel-polyfill';
const Promise = require('bluebird');
const requestPromise = require('request-promise');
const cheerio = require('cheerio');


const getIndexData = (page = 1) => {
    return new Promise(async (res, rej) => {
        try {
            let $ = await getPageWithData(page);
            res(await indexPageParser($));
        }
        catch (e) {
            rej(e);
        }
    });
};

const indexPageParser = ($) => {
    return new Promise((res, rej) => {
        let data;
        try {
            data = getData($);
        }
        catch (e) {
            throw e;
        }
        finally {
            res(data);
        }
    });
};

const getData = ($) => {
    return {
        page: getReleasePage($) || 1,
        pagePrev: getReleasePage($) - 1 || 1,
        pageMax: getReleasePageMax($) || 1,
        data: {
            latest_translation: getRelease($)
        }
    };
};

const getReleasePage = ($) => {
    return $('.digg_pagination').find('em').text().trim();
};

const getReleasePageMax = ($) => {
    let last = $('.digg_pagination').children().last();
    // return .prev().text().trim();
    if (last.hasClass('current')) {return last.text().trim();}
    else {return last.prev().text().trim();}
};


const getRelease = ($) => {
    return $('#myTable').map((i, el) => {
        el = $(el);
        return {
            title: el.prev().text(),
            data: el.find('tr').map((i2, el2) => {
                el2 = $(el2);
                if (el2.find('a').first().text()) {
                    return {
                        title: {
                            title: el2.find('a').first().attr('title'),
                            title_link: el2.find('a').first().attr('href')
                        },
                        group: {
                            name: el2.find('a').last().text().trim(),
                            link: el2.find('a').last().attr('href')
                        },
                        chapter: {
                            chapter: el2.find('.chp-release').first().text(),
                            link: el2.find('.chp-release').first().attr('href')
                        }
                    };
                }
            }).get()
        };
    }).get();
};

const getPageWithData = (page = 1) => {
    let options = {
        uri: `http://www.novelupdates.com/?pg=${page}`,
        transform: function (body) {
            return cheerio.load(body);
        }
    };
    return requestPromise(options);
};

module.exports = getIndexData;
