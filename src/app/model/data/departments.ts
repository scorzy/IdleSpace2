export interface IDepartmentData {
  id: string;
  name: string;
  description: string;
}
export const RD: IDepartmentData = {
  id: "r",
  name: "Research & Develop",
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
export const MAINTENANCE_DEP: IDepartmentData = {
  id: "m",
  name: "Maintenance Depot",
  description: "+1 replicators"
};
