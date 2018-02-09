import { 
    getSearchData,
} from '../src/index'


describe('getSearchData', () => {

    it('Should return data for magic search', async () => {
        let res = await getSearchData('magic', 1)
        expect(res.page).toBe('1')
    })

})
