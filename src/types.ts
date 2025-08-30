export interface YearlyData {
  year: number;
  population?: number;
  co2?: number;
  co2_per_capita?: number;
  iso_code?: string;
}

export interface Co2Dataset {
  [countryName: string]: YearlyData[];
}
