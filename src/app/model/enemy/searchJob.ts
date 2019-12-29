import { Job } from "../job/job";

export class SearchJob extends Job {
  getSave() {
    throw new Error("Method not implemented.");
  }
  load(data: any) {}
}
