const { getGroupData } = require('../src/index')


describe('getGroupData', () => {

    test('Should get data from translation group page', async () => {
        let res = await getGroupData('AbsurdTL')
        expect(res.name).toBe('AbsurdTL')
    }, 1000000)

})
