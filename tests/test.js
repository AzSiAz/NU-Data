import test from 'ava';
const {getSearchData} = require('../dist/build');

test('getSearchData', async t => {
    try {
        let res = await getSearchData("antimagic", 1);
        t.pass();
    }
    catch(e) {
        console.log("Error :", e);
    }
});

test('bar', async t => {
    const bar = Promise.resolve('bar');

    t.is(await bar, 'bar');
});

