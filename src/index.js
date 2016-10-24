const getSearchData = require('./parser/searchPage');
const getSerieData = require('./parser/seriesPage');
const getIndexData = require('./parser/indexPage');
const getGroupData = require('./parser/groupParser');
const getRankingData = require('./parser/seriesRankingParser');


module.exports = {
    getSearchData: getSearchData, 
    getSerieData: getSerieData, 
    getIndexData: getIndexData, 
    getGroupData: getGroupData, 
    getRankingData: getRankingData
};
