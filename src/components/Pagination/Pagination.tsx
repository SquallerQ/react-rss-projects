import React, { JSX } from 'react';
import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isVisible: boolean;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isVisible,
}: PaginationProps): JSX.Element {
  const getPageNumbers = () => {
    if (totalPages <= 11) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 6) {
      return [
        ...Array.from({ length: 10 }, (_, i) => i + 1),
        '...',
        totalPages,
      ];
    }

    if (currentPage >= totalPages - 5) {
      return [
        1,
        '...',
        ...Array.from({ length: 10 }, (_, i) => totalPages - 9 + i),
      ];
    }

    return [
      1,
      '...',
      ...Array.from({ length: 11 }, (_, i) => currentPage - 5 + i),
      '...',
      totalPages,
    ];
  };

  if (!isVisible) {
    return <></>;
  }

  return (
    <div className={styles.pagination}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={styles.pageButton}
      >
        Previous
      </button>
      {getPageNumbers().map((pageNum, index) =>
        pageNum === '...' ? (
          <span key={`ellipsis-${index}`} className={styles.ellipsis}>
            ...
          </span>
        ) : (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum as number)}
            className={`${styles.pageButton} ${pageNum === currentPage ? styles.active : ''}`}
          >
            {pageNum}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={styles.pageButton}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
