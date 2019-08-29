const { getSearchData } = require('../src/index')

describe('getSearchData', () => {

    test('Should return data for magic search', async () => {
        let res = await getSearchData('magic', 1)
        expect(res.page).toBe(1)
    }, 1000000)

    test('Should fail', async () => {
        await expect(getSearchData('magic', 35)).rejects.toThrow(/404/)
    }, 1000000)
})
