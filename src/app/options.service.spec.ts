import { TestBed } from "@angular/core/testing";

import { OptionsService } from "./options.service";

describe("OptionsService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: OptionsService = TestBed.inject(OptionsService);
    expect(service).toBeTruthy();
  });
});
