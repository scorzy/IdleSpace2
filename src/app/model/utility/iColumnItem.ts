import {
  NzTableSortOrder,
  NzTableSortFn,
  NzTableFilterList,
  NzTableFilterFn
} from "ng-zorro-antd";

export interface IColumnItem {
  name: string;
  sortOrder?: NzTableSortOrder;
  sortFn?: NzTableSortFn;
  listOfFilter?: NzTableFilterList;
  filterFn?: NzTableFilterFn;
  filterMultiple?: boolean;
  sortDirections?: NzTableSortOrder[];
}
