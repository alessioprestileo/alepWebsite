import { iChartColl } from './iChartColl'

export interface iChart {
  collections: iChartColl[];
  hAxisLabel: string;
  id: number;
  name: string;
  title: string;
  subtitle: string;
  type: string;
  vAxisLabel: string;
}
