import React from 'react';
import { Co2Dataset } from '../types';
import './DataComponents.css';

const DataLoader: React.FC = () => {
  const [dataset, setDataset] = React.useState<Co2Dataset | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/co2-data.json');
        if (!response.ok) {
          throw new Error('Failed to load JSON');
        }
        const json: Co2Dataset = await response.json();
        setDataset(json);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading data');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div>Loading data...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!dataset) return <div>No data</div>;

  return <CountriesTable dataset={dataset} />;
};

const CountriesTable: React.FC<{ dataset: Co2Dataset }> = ({ dataset }) => {
  const [selectedYear, setSelectedYear] = React.useState<number>(2021);
  const [highlighted, setHighlighted] = React.useState<
    Record<string, string[]>
  >({});

  const { countries, availableYears } = React.useMemo(() => {
    const years = new Set<number>();
    const list = Object.entries(dataset).map(([country, data]) => {
      data.forEach((d) => years.add(d.year));
      const yearData = data.find((d) => d.year === selectedYear);
      return {
        name: country,
        iso_code: yearData?.iso_code,
        population: yearData?.population,
        co2: yearData?.co2,
        co2_per_capita: yearData?.co2_per_capita,
        allYears: data,
      };
    });
    return {
      countries: list,
      availableYears: Array.from(years).sort((a, b) => b - a),
    };
  }, [dataset, selectedYear]);

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

      if (changed.length) {
        newHighlighted[country] = changed;
      }
    });

    setSelectedYear(year);
    setHighlighted(newHighlighted);

    setTimeout(() => setHighlighted({}), 1000);
  };

  return (
    <div>
      <h1>CO₂ Emissions by Countries</h1>

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

      <table className="data-table">
        <thead>
          <tr>
            <th>Country</th>
            <th>ISO</th>
            <th>Population</th>
            <th>CO₂</th>
            <th>CO₂ per Capita</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { DataLoader, CountriesTable };
