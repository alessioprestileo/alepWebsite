import { iChartColl } from './iChartColl'

export interface iChart {
  collections: iChartColl[];
  hAxisLabel: string;
  id: number;
  name: string;
  subTitle: string;
  title: string;
  type: string;
  vAxisLabel: string;
}
