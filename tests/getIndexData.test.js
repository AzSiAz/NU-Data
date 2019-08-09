const { getIndexData } = require('../src/index')

describe('getIndexData', () => {
    let pageMax
    test('Should return index page data', async () => {
        let res = await getIndexData()
        expect(res.page).toBe(1)
        expect(res.pageMax).toBeTruthy()
        pageMax = res.pageMax
    }, 1000000)

    test("Should have max page data", async () => {
        let res = await getIndexData(pageMax)
        expect(res.pageMax).toBe(pageMax)
    })
})
