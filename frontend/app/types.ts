export type RiskLevel = "Low" | "Medium" | "High";

export type Status =
  | "Active"
  | "Restricted"
  | "Seasonal";

export type Crossing = {
  id: number;
  name: string;

  country: string;
  country_from: string;
  country_to: string;

  wait_time: number;
  throughput: number;

  commodity: string;

  lat: number;
  lng: number;

  status: Status;
  risk_level: RiskLevel;

  type: string;

  // Intelligence layer
  regional_avg_wait?: number;
  delay_percent?: number;

  why_this_matters?: string;
  who_controls?: string;

  importance_score?: number;
};