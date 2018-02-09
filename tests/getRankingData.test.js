import { 
    getRankingData
} from '../src/index'


describe('getRankingData', async () => {

    it('Should get ranking for antimagic novel', async () => {
        let res = await getRankingData('antimagic', 1)
        expect(res.page).toBe('1')
        res = await getRankingData('popular', 1)
        expect(res.page).toBe('1')
    })

})
