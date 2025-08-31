import { useMemo, useCallback, useState } from 'react';
import { Co2Dataset, CountryTableRow, YearlyData } from '../../types';

interface CountriesData {
  countries: CountryTableRow[];
  availableYears: number[];
  availableRegions: string[];
  selectedYear: number;
  highlighted: Record<string, string[]>;
  search: string;
  setSearch: (value: string) => void;
  selectedRegion: string;
  setSelectedRegion: (value: string) => void;
  handleSort: (key: string) => void;
  getSortIndicator: (key: string) => string;
  handleYearChange: (
    year: number,
    selectedColumns: (keyof YearlyData)[]
  ) => void;
}

export const useCountriesData = (dataset: Co2Dataset): CountriesData => {
  const [selectedYear, setSelectedYear] = useState<number>(2023);
  const [highlighted, setHighlighted] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  const years = useMemo(() => new Set<number>(), []);
  const regions = useMemo(() => new Set<string>(['All']), []);

  const countries = useMemo(() => {
    return Object.entries(dataset).map(([country, data]) => {
      data.forEach((d) => years.add(d.year));

      let region = null;
      if (country.includes('Europe') || country.includes('European'))
        region = 'Europe';
      else if (country.includes('Asia') || country.includes('Asian'))
        region = 'Asia';
      else if (country.includes('Africa') || country.includes('African'))
        region = 'Africa';
      else if (
        country.includes('America') ||
        country.includes('North America') ||
        country.includes('South America')
      )
        region = 'Americas';
      else if (country.includes('Oceania')) region = 'Oceania';

      if (region) regions.add(region);

      const yearData = data.find((d) => d.year === selectedYear);

      return {
        name: country,
        iso_code: yearData?.iso_code,
        population: yearData?.population,
        co2: yearData?.co2,
        co2_per_capita: yearData?.co2_per_capita,
        methane: yearData?.methane,
        oil_co2: yearData?.oil_co2,
        gas_co2: yearData?.gas_co2,
        coal_co2: yearData?.coal_co2,
        total_ghg: yearData?.total_ghg,
        temperature_change_from_co2: yearData?.temperature_change_from_co2,
        region: region,
        allYears: data,
      };
    });
  }, [dataset, selectedYear]);

  const filteredCountries = useMemo(() => {
    let result = countries;

    if (search) {
      result = result.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedRegion !== 'All') {
      result = result.filter((c) => c.region === selectedRegion);
    }

    if (sortConfig) {
      result = [...result].sort((a, b) => {
        const key = sortConfig.key as keyof CountryTableRow;
        const valA = a[key];
        const valB = b[key];

        if (valA == null) return 1;
        if (valB == null) return -1;

        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortConfig.direction === 'asc'
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
        }

        return 0;
      });
    }

    return result;
  }, [countries, search, selectedRegion, sortConfig]);

  const availableYears = useMemo(
    () => Array.from(years).sort((a, b) => b - a),
    [years]
  );
  const availableRegions = useMemo(() => Array.from(regions).sort(), [regions]);

  const handleSort = useCallback((key: string) => {
    setSortConfig((prev) => {
      if (!prev || prev.key !== key) {
        return { key, direction: 'asc' };
      }
      if (prev.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return null;
    });
  }, []);

  const getSortIndicator = useCallback(
    (key: string) => {
      if (!sortConfig || sortConfig.key !== key) return ' ↕';
      return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
    },
    [sortConfig]
  );

  const highlightableColumns: (keyof YearlyData)[] = [
    'population',
    'co2',
    'co2_per_capita',
    'methane',
    'oil_co2',
    'gas_co2',
    'coal_co2',
    'total_ghg',
    'temperature_change_from_co2',
  ];

  const handleYearChange = useCallback(
    (year: number, selectedColumns: (keyof YearlyData)[]) => {
      const newHighlighted: Record<string, string[]> = {};

      Object.entries(dataset).forEach(([country, data]) => {
        const prevData = data.find((d) => d.year === selectedYear);
        const nextData = data.find((d) => d.year === year);
        if (!prevData || !nextData) return;

        const changed = highlightableColumns.filter((col) =>
          selectedColumns.includes(col) ||
          ['population', 'co2', 'co2_per_capita'].includes(col)
            ? prevData[col] !== nextData[col]
            : false
        );

        if (changed.length) newHighlighted[country] = changed;
      });

      setSelectedYear(year);
      setHighlighted(newHighlighted);
      setTimeout(() => setHighlighted({}), 1000);
    },
    [dataset, selectedYear]
  );

  return {
    countries: filteredCountries,
    availableYears,
    availableRegions,
    selectedYear,
    highlighted,
    search,
    setSearch,
    selectedRegion,
    setSelectedRegion,
    handleSort,
    getSortIndicator,
    handleYearChange,
  };
};
