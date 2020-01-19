import { modules } from "./modulesData";

describe("ModulesData", () => {
  it("modules should have unique ids", () => {
    const ids = modules.map(u => u.id);
    const ok = new Set(ids).size === ids.length;
    expect(ok).toBeTruthy();
  });
});
