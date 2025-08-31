export interface YearlyData {
  year: number;
  population?: number;
  co2?: number;
  co2_per_capita?: number;
  iso_code?: string;
  methane?: number;
  oil_co2?: number;
  gas_co2?: number;
  coal_co2?: number;
  total_ghg?: number;
  temperature_change_from_co2?: number;
}

export interface Co2Dataset {
  [countryName: string]: YearlyData[];
}

export interface ApiYearlyData {
  year?: number;
  population?: number;
  co2?: number;
  co2_per_capita?: number;
  methane?: number;
  oil_co2?: number;
  gas_co2?: number;
  coal_co2?: number;
  total_ghg?: number;
  temperature_change_from_co2?: number;
  cement_co2?: number;
  flaring_co2?: number;
  nitrous_oxide?: number;
  co2_growth_abs?: number;
  co2_growth_prct?: number;
  energy_per_capita?: number;
  primary_energy_consumption?: number;
}

export interface ApiCountryData {
  iso_code?: string;
  data: ApiYearlyData[];
}

export interface ApiResponse {
  [countryName: string]: ApiCountryData;
}
export interface CountryTableRow {
  name: string;
  iso_code?: string;
  population?: number;
  co2?: number;
  co2_per_capita?: number;
  methane?: number;
  oil_co2?: number;
  gas_co2?: number;
  coal_co2?: number;
  total_ghg?: number;
  temperature_change_from_co2?: number;
  region: string | null;
  allYears: YearlyData[];
}
