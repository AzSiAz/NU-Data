import "babel-polyfill";
import {getSearchData, getSerieData, getIndexData, getGroupData, getRankingData} from './src/parser';


// (async function test() { 
//     try {
//         let res = await getSearchData("antimagic", 1);
//         console.log(res);
//     }
//     catch(e) {
//         console.log("Error :", e);
//     }
// })()
// getSearchData("antimagic", 1).then(res => {
//     console.log(res);
// }, err => {
//     console.log("Error :", err);
// })


// (async function test2() {
//     try {
//         let res = await getSerieData("Absolute Duo", 2);
//         // let res = await getSerieData("mahouka-koukou-no-rettousei-x-sword-art-online");
//         // let res = await getSerieData("Magi’s Grandson");
//         console.log(res);
//     }
//     catch(e) {
//         console.log("Error :", e);
//     }
// })()
// getSerieData("Absolute Duo", 2).then(res => {
//     console.log(res);
// }, err => {
//     console.log("Error :", err);
// })


// (async function test3() { 
//     try {
//         let res = await getIndexData();
//         console.log(res);
//     }
//     catch(e) {
//         console.log("Error :", e);
//     }
// })()
// getIndexData().then(res => {
//     console.log(res);
// }, err => {
//     console.log("Error :", err);
// })


// (async function test4() { 
//     try {
//         let res = await getGroupData("baka-tsuki");
//         console.log(res);
//     }
//     catch(e) {
//         console.log("Error :", e);
//     }
// })()
// getGroupData("AbsurdTL").then(res => {
//     console.log(res);
// }, err => {
//     console.log("Error :", err);
// })


(async function test5() {
    try {
        let res = await getRankingData();
        console.log(res);
    }
    catch(e) {
        console.log("Error :", e);
    }
})()
// getRankingData().then(res => {
//     console.log(res);
// }, err => {
//     console.log("Error :", err);
// })
