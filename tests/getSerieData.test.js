const { getSerieData } = require('../src/index')

describe('getSerieData', () => {
    test('Title should be Absolute Duo', async () => {
        let res = await getSerieData('absolute-duo')
        expect(res.title).toBe('Absolute Duo')
    }, 1000000)
})
