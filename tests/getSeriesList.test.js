const { getSeriesList } = require("../src/index");

describe("getSeriesList", () => {
    test("Should get seriestl listing data", async () => {
        const res = await getSeriesList(2);
        console.log(res);
        // expect(res).toBe("AbsurdTL");
    }, 1000000);
});
