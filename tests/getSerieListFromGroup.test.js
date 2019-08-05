const { getSerieListFromGroup } = require('../src/index')

describe('getGroupData', () => {

    test('Should get data from translation group page', async () => {
        let res = await getSerieListFromGroup('baka-tsuki')
        expect(res.length).toBeGreaterThanOrEqual(1)
    }, 1000000)

})
