import React from 'react';
import { CountryTableRow } from '../../types';

interface CountryRowProps {
  country: CountryTableRow;
  highlighted: string[] | undefined;
  selectedColumns: string[];
  getColumnValue: (country: CountryTableRow, column: string) => string;
}

const CountryRow: React.FC<CountryRowProps> = React.memo(
  ({ country, highlighted = [], selectedColumns, getColumnValue }) => (
    <tr>
      <td>{country.name}</td>
      <td>{country.iso_code ?? 'N/A'}</td>
      <td className={highlighted.includes('population') ? 'highlight' : ''}>
        {country.population?.toLocaleString() ?? 'N/A'}
      </td>
      <td className={highlighted.includes('co2') ? 'highlight' : ''}>
        {country.co2?.toFixed(1) ?? 'N/A'}
      </td>
      <td className={highlighted.includes('co2_per_capita') ? 'highlight' : ''}>
        {country.co2_per_capita?.toFixed(2) ?? 'N/A'}
      </td>
      {selectedColumns.map((column) => (
        <td
          key={column}
          className={highlighted.includes(column) ? 'highlight' : ''}
        >
          {getColumnValue(country, column)}
        </td>
      ))}
    </tr>
  )
);

CountryRow.displayName = 'CountryRow';

export default CountryRow;
