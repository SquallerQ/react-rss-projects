import React from 'react';

interface TableHeaderProps {
  selectedColumns: string[];
  handleSort: (key: string) => void;
  getSortIndicator: (key: string) => string;
}

const TableHeader: React.FC<TableHeaderProps> = React.memo(
  ({ selectedColumns, handleSort, getSortIndicator }) => (
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
        <th onClick={() => handleSort('co2')}>CO₂{getSortIndicator('co2')}</th>
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
  )
);

TableHeader.displayName = 'TableHeader';

export default TableHeader;
