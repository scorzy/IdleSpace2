export interface ISearchOption {
  id: string;
  name: string;
  min?: number;
  max?: number;
  extendedMax?: number;
  bonusMinStart?: number;
  bonusMinEnd?: number;
  bonusMaxStart?: number;
  bonusMaxEnd?: number;
  tooltip?: string;
}
