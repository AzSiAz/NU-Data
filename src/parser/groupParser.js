import * as Promise from 'bluebird';
import requestPromise from 'request-promise';
import cheerio from 'cheerio';
import moment from 'moment';

export function getGroupData (group = undefined ,page = 1) {
    return new Promise(async (res, rej) => {
        try {
            if (group == undefined) rej(new Error("You must specify a group"));
            group = sanatizeGroupName(group);
            let $ = await getPageWithData(group, page);
            res(await groupPageParser($));
        }
        catch(e) {
            rej(e);
        }
    })
}

const groupPageParser = ($) => {
    return new Promise((res, rej) => {
        let data;
        try {
            data = getData($)
        }
        catch(e) {
            throw e
        }
        finally {
            res(data);
        }
    })
}

const getData = ($) => {
    let primaryData = getBaseData($);
    return {
        name: primaryData.title,
        link: primaryData.url,
        nbrRelease: primaryData.nbrRelease,
        release: {
            page: getReleasePage($) || 1,
            pageMax: getReleasePageMax($) || 1,
            data: getRelease($),
        }
    };
}

const getBaseData = ($) => {
    let title, url, nbrRelease;
    $('table').first().find('tr').map((i, el) => {
        el = $(el);
        if (el.find('td').text() !== "") {
            switch(i) {
                case 1: 
                    title = el.find('td').last().text().trim();
                    break;
                case 2:
                    url = el.find('a').last().attr('href');
                    break;
                case 4:
                    nbrRelease = el.find('td').last().text().trim();
                    break;
            }
        }
    })
    return {
        title,
        url,
        nbrRelease
    }
}

const getRelease = ($) => {
    return $('#myTable > tbody > tr').map((i, el) => {
        el = $(el) 
        if (el.find('a').first().text()) {
            return {
                date: moment.utc(el.children().first().html(), "MM/DD/YY").toDate(),
                title: el.find('a').last().text().trim(),
                group: el.find('a').first().text().trim(),
                link: el.find('a').last().attr('href')
            };
        }
    }).get();
}

const getReleasePage = ($) => {
    return $('.digg_pagination').find('em').text().trim();
}

const getReleasePageMax = ($) => {
    let last = $('.digg_pagination').children().last()
    // return .prev().text().trim();
    if (last.hasClass('current')) return last.text().trim()
    else return last.prev().text().trim();
}

const sanatizeGroupName = (title) => {
    title = title.trim();
    title = title.replace(/ /g, "-");
    return title.toLowerCase();
}

const getPageWithData = (group, page = 1) => {
    let options = {
        uri: `http://www.novelupdates.com/group/${group}/?pg=${page}`,
        transform: function (body) {
            return cheerio.load(body);
        }
    };
    return requestPromise(options)
}