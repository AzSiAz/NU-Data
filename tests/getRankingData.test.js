const { getRankingData } = require('./../src/index')

describe('getRankingData', () => {

    test('Should get ranking for antimagic novel', async () => {
        let res = await getRankingData('antimagic', 1)
        expect(res.page).toBe(1)
        res = await getRankingData('popular', 1)
        expect(res.page).toBe(1)
    }, 1000000)

    test('Should have a list', async () => {
        const res = await getRankingData('popular', 1)
        expect(res.data.length).toBeGreaterThanOrEqual(1)
    }, 1000000)
})
