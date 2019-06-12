const { getGenres } = require("../src/index");

describe("getGenres", () => {
    test("Should get a list of genres", async () => {
        const res = await getGenres();
        expect(res).toHaveLength(35);
        expect(res[0].genre).toBe("Action")
    }, 1e5);
});
