import { TestBed } from "@angular/core/testing";

import { MainService } from "./main.service";
import { OptionsService } from "./options.service";
import { FormatPipe } from "./format.pipe";

describe("MainService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({ providers: [OptionsService, FormatPipe] })
  );

  it("should be created", () => {
    const service: MainService = TestBed.get(MainService);
    expect(service).toBeTruthy();
  });
});
