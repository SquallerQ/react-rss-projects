'use client';

import React, { JSX, useState } from 'react';
import { usePokemonStore } from '../../store/pokemonStore';
import { useTranslations } from 'next-intl';
import styles from './Flyout.module.css';

function Flyout(): JSX.Element {
  const t = useTranslations('Flyout');
  const { selectedPokemons, clearItems } = usePokemonStore();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      const response = await fetch('/api/download-csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedPokemons),
      });

      if (!response.ok) {
        throw new Error('Failed to generate CSV');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const contentDisposition = response.headers.get('Content-Disposition');
      const filename =
        contentDisposition?.match(/filename="([^"]*)"/)?.[1] ||
        `${selectedPokemons.length}_items.csv`;

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className={styles.flyout}>
      <h3>{t('selectedTitle', { count: selectedPokemons.length })}</h3>
      <ul className={styles.list}>
        {selectedPokemons.map((pokemon) => (
          <li key={pokemon.id} className={styles.listItem}>
            {pokemon.name}
          </li>
        ))}
      </ul>
      <div className={styles.buttonContainer}>
        <button
          onClick={handleDownload}
          className={styles.downloadButton}
          disabled={isDownloading}
        >
          {isDownloading
            ? t('downloading', { default: 'Downloading...' })
            : t('downloadButton')}
        </button>
        <button onClick={clearItems} className={styles.clearButton}>
          {t('clearButton')}
        </button>
      </div>
    </div>
  );
}

export default Flyout;
