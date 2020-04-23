export interface iDepartmentData {
  id: string;
  name: string;
  description: string;
}
export const RD: iDepartmentData = {
  id: "r",
  name: "R&D",
  description: "+1 scientists"
};
export const PROD_DEP: iDepartmentData = {
  id: "p",
  name: "Production Department",
  description: "+10% output"
};
export const STORAGE_DEP: iDepartmentData = {
  id: "s",
  name: "Depot",
  description: "increase storage"
};
