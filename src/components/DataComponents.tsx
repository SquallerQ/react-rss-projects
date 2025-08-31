import React from 'react';
import { Co2Dataset, ApiResponse, YearlyData, CountryTableRow } from '../types';
import './DataComponents.css';

const LoadingSpinner: React.FC = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <div className="loading-text">
      <h3>Loading CO₂ Data...</h3>
      <p>Fetching global emissions data from local JSON</p>
      <div className="loading-details">
        <span>• Processing countries and regions</span>
        <span>• Loading historical data (1750-2024)</span>
        <span>• Preparing interactive tables</span>
      </div>
    </div>
  </div>
);

const ColumnSelectionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  availableColumns: string[];
  selectedColumns: string[];
  onToggleColumn: (column: string) => void;
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
  const [dataset, setDataset] = React.useState<Co2Dataset | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/co2-frontend.json');
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

        setDataset(processedDataset);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading data');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error">Error: {error}</div>;
  if (!dataset) return <div>No data</div>;

  return <CountriesTable dataset={dataset} />;
};

const CountriesTable: React.FC<{ dataset: Co2Dataset }> = ({ dataset }) => {
  const [selectedYear, setSelectedYear] = React.useState<number>(2023);
  const [highlighted, setHighlighted] = React.useState<
    Record<string, string[]>
  >({});
  const [search, setSearch] = React.useState<string>('');
  const [selectedRegion, setSelectedRegion] = React.useState<string>('All');
  const [sortConfig, setSortConfig] = React.useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [selectedColumns, setSelectedColumns] = React.useState<string[]>([]);

  const availableColumns = [
    'methane',
    'oil_co2',
    'gas_co2',
    'coal_co2',
    'total_ghg',
    'temperature_change_from_co2',
  ];

  const years = new Set<number>();
  const regions = new Set<string>(['All']);

  let countries: CountryTableRow[] = Object.entries(dataset).map(
    ([country, data]) => {
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
    }
  );

  if (search) {
    countries = countries.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (selectedRegion !== 'All') {
    countries = countries.filter((c) => c.region === selectedRegion);
  }

  if (sortConfig) {
    countries = [...countries].sort((a, b) => {
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

  const availableYears = Array.from(years).sort((a, b) => b - a);
  const availableRegions = Array.from(regions).sort();

  const handleYearChange = (year: number) => {
    const newHighlighted: Record<string, string[]> = {};

    Object.entries(dataset).forEach(([country, data]) => {
      const prevData = data.find((d) => d.year === selectedYear);
      const nextData = data.find((d) => d.year === year);

      if (!prevData || !nextData) return;

      const changed: string[] = [];
      if (prevData.population !== nextData.population)
        changed.push('population');
      if (prevData.co2 !== nextData.co2) changed.push('co2');
      if (prevData.co2_per_capita !== nextData.co2_per_capita)
        changed.push('co2_per_capita');

      selectedColumns.forEach((col) => {
        if (
          prevData[col as keyof YearlyData] !==
          nextData[col as keyof YearlyData]
        ) {
          changed.push(col);
        }
      });

      if (changed.length) {
        newHighlighted[country] = changed;
      }
    });

    setSelectedYear(year);
    setHighlighted(newHighlighted);
    setTimeout(() => setHighlighted({}), 1000);
  };

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (!prev || prev.key !== key) {
        return { key, direction: 'asc' };
      }
      if (prev.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return null;
    });
  };

  const getSortIndicator = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) return ' ↕';
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  const handleToggleColumn = (column: string) => {
    setSelectedColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column]
    );
  };

  const getColumnValue = (country: CountryTableRow, column: string): string => {
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
  };

  return (
    <div>
      <h1>CO₂ Emissions by Countries</h1>
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
            onChange={(e) => handleYearChange(Number(e.target.value))}
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

      <table className="data-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>
              Country{getSortIndicator('name')}
            </th>
            <th onClick={() => handleSort('iso_code')}>
              ISO{getSortIndicator('iso_code')}
            </th>
            <th onClick={() => handleSort('population')}>
              Population{getSortIndicator('population')}
            </th>
            <th onClick={() => handleSort('co2')}>
              CO₂{getSortIndicator('co2')}
            </th>
            <th onClick={() => handleSort('co2_per_capita')}>
              CO₂ per Capita{getSortIndicator('co2_per_capita')}
            </th>
            {selectedColumns.map((column) => (
              <th key={column} onClick={() => handleSort(column)}>
                {column.replace(/_/g, ' ').toUpperCase()}
                {getSortIndicator(column)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {countries.map((c) => (
            <tr key={c.name}>
              <td>{c.name}</td>
              <td>{c.iso_code ?? 'N/A'}</td>
              <td
                className={
                  highlighted[c.name]?.includes('population') ? 'highlight' : ''
                }
              >
                {c.population?.toLocaleString() ?? 'N/A'}
              </td>
              <td
                className={
                  highlighted[c.name]?.includes('co2') ? 'highlight' : ''
                }
              >
                {c.co2?.toFixed(1) ?? 'N/A'}
              </td>
              <td
                className={
                  highlighted[c.name]?.includes('co2_per_capita')
                    ? 'highlight'
                    : ''
                }
              >
                {c.co2_per_capita?.toFixed(2) ?? 'N/A'}
              </td>
              {selectedColumns.map((column) => (
                <td
                  key={column}
                  className={
                    highlighted[c.name]?.includes(column) ? 'highlight' : ''
                  }
                >
                  {getColumnValue(c, column)}
                </td>
              ))}
            </tr>
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
