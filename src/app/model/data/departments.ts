export interface IDepartmentData {
  id: string;
  name: string;
  description: string;
}
export const RD: IDepartmentData = {
  id: "r",
  name: "R&D",
  description: "+1 scientists"
};
export const PROD_DEP: IDepartmentData = {
  id: "p",
  name: "Production Department",
  description: "+2 drones; +1% output"
};
export const STORAGE_DEP: IDepartmentData = {
  id: "s",
  name: "Depot",
  description: "increase storage"
};
