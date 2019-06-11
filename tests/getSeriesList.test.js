const { getSeriesList } = require("../src/index");

describe("getSeriesList", () => {
    test("Should get seriestl listing data", async () => {
        const res = await getSeriesList(2);
        expect(res.page).toBe(2);
        expect(res.data).toHaveLength(25);
    }, 1e5);

    test("should throw", async () => {
        const res = await getSeriesList(3000);
        expect(res.data).toHaveLength(0);
    }, 1e5);
});
