import React from 'react';
import {
  Co2Dataset,
  ApiResponse,
  YearlyData,
  CountryTableRow,
} from '../../types';
import './DataComponents.css';
import TableHeader from '../TableHeader/TableHeader';
import CountryRow from '../CountryRow/CountryRow';
import Filters from '../Filters/Filters';
import { useCountriesData } from '../useCountriesData/useCountriesData';

const dataCache = new Map<
  string,
  {
    promise: Promise<Co2Dataset>;
    status: 'pending' | 'fulfilled' | 'rejected';
    result?: Co2Dataset;
    error?: Error;
  }
>();

const fetchDataWithSuspense = (url: string): Co2Dataset => {
  if (!dataCache.has(url)) {
    const promise = fetch(url).then(async (response) => {
      if (!response.ok) {
        throw new Error('Failed to load data from local JSON file');
      }
      const apiData: ApiResponse = await response.json();

      const processedDataset: Co2Dataset = {};
      Object.entries(apiData).forEach(([countryName, countryData]) => {
        const yearlyData: YearlyData[] = countryData.data
          .filter((item) => item.year)
          .map((item) => ({
            year: item.year || 0,
            population: item.population,
            co2: item.co2,
            co2_per_capita: item.co2_per_capita,
            iso_code: countryData.iso_code,
            methane: item.methane,
            oil_co2: item.oil_co2,
            gas_co2: item.gas_co2,
            coal_co2: item.coal_co2,
            total_ghg: item.total_ghg,
            temperature_change_from_co2: item.temperature_change_from_co2,
          }));

        if (yearlyData.length > 0) {
          processedDataset[countryName] = yearlyData;
        }
      });

      return processedDataset;
    });

    const cacheEntry: {
      promise: Promise<Co2Dataset>;
      status: 'pending' | 'fulfilled' | 'rejected';
      result?: Co2Dataset;
      error?: Error;
    } = {
      promise,
      status: 'pending',
    };

    promise
      .then((data) => {
        cacheEntry.status = 'fulfilled';
        cacheEntry.result = data;
      })
      .catch((error) => {
        cacheEntry.status = 'rejected';
        cacheEntry.error = error;
      });

    dataCache.set(url, cacheEntry);
  }

  const cacheEntry = dataCache.get(url);
  if (!cacheEntry) {
    throw new Error('Cache entry not found');
  }

  if (cacheEntry.status === 'pending') {
    throw cacheEntry.promise;
  } else if (cacheEntry.status === 'rejected') {
    throw cacheEntry.error;
  }

  return cacheEntry.result as Co2Dataset;
};

const ColumnSelectionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  availableColumns: (keyof YearlyData)[];
  selectedColumns: (keyof YearlyData)[];
  onToggleColumn: (column: keyof YearlyData) => void;
}> = ({
  isOpen,
  onClose,
  availableColumns,
  selectedColumns,
  onToggleColumn,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Select Additional Columns</h3>
        <div className="column-list">
          {availableColumns.map((column) => (
            <label key={column} className="column-item">
              <input
                type="checkbox"
                checked={selectedColumns.includes(column)}
                onChange={() => onToggleColumn(column)}
              />
              <span>{column.replace(/_/g, ' ').toUpperCase()}</span>
            </label>
          ))}
        </div>
        <div className="modal-buttons">
          <button onClick={onClose} className="btn-primary">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

const DataLoader: React.FC = () => {
  const dataset = fetchDataWithSuspense('/co2-frontend.json');

  return <CountriesTable dataset={dataset} />;
};

const CountriesTable: React.FC<{ dataset: Co2Dataset }> = ({ dataset }) => {
  const {
    countries,
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
  } = useCountriesData(dataset);

  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [selectedColumns, setSelectedColumns] = React.useState<
    (keyof YearlyData)[]
  >([]);

  const availableColumns: (keyof YearlyData)[] = [
    'methane',
    'oil_co2',
    'gas_co2',
    'coal_co2',
    'total_ghg',
    'temperature_change_from_co2',
  ];

  const handleToggleColumn = React.useCallback((column: keyof YearlyData) => {
    setSelectedColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column]
    );
  }, []);

  const getColumnValue = React.useCallback(
    (country: CountryTableRow, column: string): string => {
      const value = country[column as keyof CountryTableRow];
      if (Array.isArray(value) || typeof value === 'object') {
        return 'N/A';
      }
      if (value === undefined || value === null) {
        return 'N/A';
      }
      if (typeof value === 'number') {
        return value.toFixed(2);
      }
      return String(value);
    },
    []
  );

  return (
    <div>
      <h1>CO₂ Emissions by Countries</h1>
      <Filters
        search={search}
        setSearch={setSearch}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        selectedYear={selectedYear}
        handleYearChange={handleYearChange}
        availableRegions={availableRegions}
        availableYears={availableYears}
        setIsModalOpen={setIsModalOpen}
        selectedColumns={selectedColumns}
      />
      <table className="data-table">
        <TableHeader
          selectedColumns={selectedColumns}
          handleSort={handleSort}
          getSortIndicator={getSortIndicator}
        />
        <tbody>
          {countries.map((c) => (
            <CountryRow
              key={c.name}
              country={c}
              highlighted={highlighted[c.name]}
              selectedColumns={selectedColumns}
              getColumnValue={getColumnValue}
            />
          ))}
        </tbody>
      </table>
      <div>
        Showing {countries.length} countries for year {selectedYear}
      </div>
      <ColumnSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        availableColumns={availableColumns}
        selectedColumns={selectedColumns}
        onToggleColumn={handleToggleColumn}
      />
    </div>
  );
};

export { DataLoader, CountriesTable };
