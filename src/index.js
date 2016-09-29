import "babel-polyfill";
import {getSearchData} from './parser/searchPage';
import {getSerieData} from './parser/seriesPage' 

// (async function test() { 
//     let res = await getSearchData("antimagic", 3);
//     console.log(res);
// })()

(async function test2() {
    let res = await getSerieData("Absolute Duo", 2);
    // let res = await getSerieData("mahouka-koukou-no-rettousei-x-sword-art-online");
    console.log(res);
})()