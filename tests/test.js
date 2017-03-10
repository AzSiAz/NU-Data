import { 
    getSearchData,
    getSerieData,
    getIndexData,
    getGroupData,
    getRankingData
} from '../src/index'


describe('getSearchData', () => {

    it('Should return data for antimagic search', async () => {
        let res = await getSearchData('antimagic', 1)
        expect(res.page).toBe('1')
    })

})

describe('getSerieData', () => {
    
    it('Title should be Absolute Duo', async () => {
        let res = await getSerieData('Absolute Duo')
        expect(res.Title).toBe('Absolute Duo')
    })

})

describe('getIndexData', () => {

    it('Should return index page data', async () => {
        let res = await getIndexData()
        expect(res.page).toBe('1')
    })

})

describe('getGroupData', async () => {

    it('Should get data from translation group page', async () => {
        let res = await getGroupData('AbsurdTL')
        expect(res.name).toBe('AbsurdTL')
    })

});

describe('getRankingData', async () => {

    it('Should get ranking for antimagic novel', async () => {
        let res = await getRankingData('antimagic', 1)
        expect(res.page).toBe('1')
    })

});
