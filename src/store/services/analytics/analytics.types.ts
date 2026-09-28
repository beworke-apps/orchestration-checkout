export type AnalyticsMetric = {
  id: string;
  label: string;
  value: number;
  changePercent: number;
};

export type AnalyticsOverview = {
  metrics: AnalyticsMetric[];
  period: string;
};

export type AnalyticsOverviewParams = {
  period?: 'daily' | 'weekly' | 'monthly';
};
