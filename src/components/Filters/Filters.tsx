import React from 'react';
import { YearlyData } from '../../types';

interface FiltersProps {
  search: string;
  setSearch: (value: string) => void;
  selectedRegion: string;
  setSelectedRegion: (value: string) => void;
  selectedYear: number;
  handleYearChange: (
    year: number,
    selectedColumns: (keyof YearlyData)[]
  ) => void;
  availableRegions: string[];
  availableYears: number[];
  setIsModalOpen: (value: boolean) => void;
  selectedColumns: (keyof YearlyData)[];
}

const Filters: React.FC<FiltersProps> = React.memo(
  ({
    search,
    setSearch,
    selectedRegion,
    setSelectedRegion,
    selectedYear,
    handleYearChange,
    availableRegions,
    availableYears,
    setIsModalOpen,
    selectedColumns,
  }) => (
    <div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search country..."
        className="search-input"
      />
      <label>
        Region:
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
        >
          {availableRegions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </label>
      <label>
        Year:
        <select
          value={selectedYear}
          onChange={(e) =>
            handleYearChange(Number(e.target.value), selectedColumns)
          }
        >
          {availableYears.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </label>
      <button onClick={() => setIsModalOpen(true)} className="btn-primary">
        Customize Columns
      </button>
    </div>
  )
);

Filters.displayName = 'Filters';

export default Filters;
