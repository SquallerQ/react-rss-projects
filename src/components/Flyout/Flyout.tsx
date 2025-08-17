'use client';

import React, { JSX, useEffect, useRef, useState } from 'react';
import { usePokemonStore } from '../../store/pokemonStore';
import { downloadCSV } from '../../utils/downloadCSV';
import { useTranslations } from 'next-intl';
import styles from './Flyout.module.css';

function Flyout(): JSX.Element {
  const t = useTranslations('Flyout');
  const { selectedPokemons, clearItems } = usePokemonStore();
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [filename, setFilename] = useState<string>('');
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);

  const handleDownload = () => {
    const { blob, filename: csvFilename } = downloadCSV(selectedPokemons);
    const url = URL.createObjectURL(blob);
    setDownloadUrl(url);
    setFilename(csvFilename);
  };

  useEffect(() => {
    if (downloadUrl && downloadLinkRef.current) {
      downloadLinkRef.current.click();
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
      setFilename('');
    }
  }, [downloadUrl]);

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
        <button onClick={handleDownload} className={styles.downloadButton}>
          {t('downloadButton')}
        </button>
        {downloadUrl && (
          <a
            ref={downloadLinkRef}
            href={downloadUrl}
            download={filename}
            className={styles.downloadLink}
          >
            {t('downloadLink')}
          </a>
        )}
        <button onClick={clearItems} className={styles.clearButton}>
          {t('clearButton')}
        </button>
      </div>
    </div>
  );
}

export default Flyout;
