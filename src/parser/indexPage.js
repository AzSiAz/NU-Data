import * as Promise from 'bluebird';
import requestPromise from 'request-promise';
import cheerio from 'cheerio';

export function getIndexData (page = 1) {
    return new Promise(async (res, err) => {    
        let $ = await getPageWithData(page);
        res(await searchPageParser($));
    })
}

const searchPageParser = ($) => {
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
    return {
        page: 1,
        pageMax: 3,
        data: {
            latest_topics: [],
            latest_translation: []
        }
    };
}

const getPageWithData = (page = 1) => {
    let options = {
        uri: `http://www.novelupdates.com/?pg=${page}`,
        transform: function (body) {
            return cheerio.load(body);
        }
    };
    return requestPromise(options)
}