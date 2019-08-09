const { getSerieData } = require('../src/index')
const {dump} = require("dumper.js")

describe('getSerieData', () => {
    test('Title should be Absolute Duo', async () => {
        let res = await getSerieData('absolute-duo')
        dump(res)
        expect(res.title).toBe('Absolute Duo')
    }, 1000000)
})
