const { getSerieListFromGroup } = require('../src/index')
const {dump} = require("dumper.js")

describe('getGroupData', () => {

    test('Should get data from translation group page', async () => {
        let res = await getSerieListFromGroup('baka-tsuki')
        dump(res[0])
        expect(res.length).toBeGreaterThanOrEqual(1)
    }, 1000000)

})
