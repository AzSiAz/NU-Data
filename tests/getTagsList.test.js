const { getTagsList } = require("../src/index");

describe("getTagsList", () => {
    test("Should get a list of tags", async () => {
        const res = await getTagsList();
        expect(res.page).toBe(1);
        expect(res.data).toHaveLength(50);
    }, 1e5);
});
