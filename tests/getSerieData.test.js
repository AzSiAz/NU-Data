const { getSerieData } = require('../src/index')


describe('getSerieData', () => {
    test('Title should be Absolute Duo', async () => {
        let res = await getSerieData('Absolute Duo')
        expect(res.title).toBe('Absolute Duo')
    }, 1000000)
})
