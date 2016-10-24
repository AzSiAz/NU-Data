import test from 'ava';
const {getSearchData, getSerieData, getIndexData, getGroupData, getRankingData} = require('../dist/build');

test('getSearchData', async t => {
    try {
        let res = await getSearchData("antimagic", 1);
        t.is(res.page, "1");
    }
    catch(e) {
        t.fail("Error : " + e);
    }
});

test('getSerieData', async t => {
    try {
        let res = await getSerieData("Absolute Duo", 1);
        t.is(res.Title, "Absolute Duo");
    }
    catch(e) {
        t.fail("Error : " + e);
    }
});

test('getIndexData', async t => {
    try {
        let res = await getIndexData();
        t.is(res.page, "1");
    }
    catch(e) {
        t.fail("Error : " + e);
    }
});

test('getGroupData', async t => {
    try {
        let res = await getGroupData("AbsurdTL");
        t.is(res.name, "AbsurdTL");
    }
    catch(e) {
        t.fail("Error : " + e);
    }
});

test('getRankingData', async t => {
    try {
        let res = await getRankingData("antimagic", 1);
        t.is(res.page, "1");
    }
    catch(e) {
        t.fail("Error : " + e);
    }
});
