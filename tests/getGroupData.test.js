import { 
    getGroupData
} from '../src/index'


describe('getGroupData', async () => {

    it('Should get data from translation group page', async () => {
        let res = await getGroupData('AbsurdTL')
        expect(res.name).toBe('AbsurdTL')
    })

})
