export interface ISearchOption {
  id: string;
  name: string;
  min?: number;
  max?: number;
  bonusMinStart?: number;
  bonusMinEnd?: number;
  bonusMaxStart?: number;
  bonusMaxEnd?: number;
  tooltip?: string;
}
