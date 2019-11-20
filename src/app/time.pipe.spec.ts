import { TimePipe } from "./time.pipe";
import { OptionsService } from "./options.service";

describe("TimePipe", () => {
  it("create an instance", () => {
    const pipe = new TimePipe(new OptionsService());
    expect(pipe).toBeTruthy();
  });
});
