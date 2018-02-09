import { 
    getIndexData
} from '../src/index'


describe('getIndexData', () => {

    it('Should return index page data', async () => {
        let res = await getIndexData()
        expect(res.page).toBe('1')
    })

})
