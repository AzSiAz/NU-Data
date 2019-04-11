const { getIndexData } = require('../src/index')


describe('getIndexData', () => {

    test('Should return index page data', async () => {
        let res = await getIndexData()
        expect(res.page).toBe('1')
    }, 1000000)

})
