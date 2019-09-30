import { UNITS } from "./units";

describe("Units", () => {
  it("units should have unique ids", () => {
    const ids = UNITS.map(u => u.id);
    const ok = new Set(ids).size === ids.length;
    expect(ok).toBeTruthy();
  });
});
