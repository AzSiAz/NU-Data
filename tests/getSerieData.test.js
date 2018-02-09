import { 
    getSerieData
} from '../src/index'


describe('getSerieData', () => {
    
    it('Title should be Absolute Duo', async () => {
        let res = await getSerieData('Absolute Duo')
        expect(res.Title).toBe('Absolute Duo')
    })

})
