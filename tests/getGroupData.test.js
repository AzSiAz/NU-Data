// @ts-check
const { getGroupData } = require('../src/index')

describe('getGroupData', () => {
    let pageMax

    test('Should get data from translation group page', async () => {
        let data = await getGroupData('AbsurdTL')
        expect(data.title).toBe('AbsurdTL')
        expect(data.release.pageMax).toBeTruthy()
        pageMax = data.release.pageMax
    }, 1000000)

    test("Should have max page data", async () => {
        let res = await getGroupData('AbsurdTL', pageMax)
        expect(res.release.pageMax).toBe(pageMax)
    })

    test('Should fail if group doesn\'t exist', async () => {
        await expect(getGroupData("blblblbblb")).rejects.toThrow(/404/)
    }, 1000000)

    test('Should fail if group undefined, null, empty ', async () => {
        await expect(getGroupData("")).rejects.toThrow(/group/)
        await expect(getGroupData()).rejects.toThrow(/You must specify a group/)
        await expect(getGroupData(null)).rejects.toThrow(/You must specify a group/)
    }, 1000000)
})
