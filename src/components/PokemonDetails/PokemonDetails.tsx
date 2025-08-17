'use client';

import React, { JSX } from 'react';
import Image from 'next/image';
import { usePokemonDetails } from '../../queries/pokemonQueries';
import type { PokemonDetails } from '../../queries/pokemonQueries';
import { useTranslations } from 'next-intl';
import styles from './PokemonDetails.module.css';

interface PokemonDetailsProps {
  pokemonId: string | null;
  onClose: () => void;
}

function PokemonDetails({
  pokemonId,
  onClose,
}: PokemonDetailsProps): JSX.Element {
  const t = useTranslations('PokemonDetails');
  const {
    data: selectedPokemon,
    isLoading,
    error,
  } = usePokemonDetails(pokemonId ?? undefined);

  if (!pokemonId) {
    return <></>;
  }

  if (isLoading) {
    return <div className={styles.spinner}>{t('loading')}</div>;
  }

  if (error) {
    return (
      <div className={styles.detailsPanel}>
        <button onClick={onClose} className={styles.closeButton}>
          {t('close')}
        </button>
        <div className={styles.error}>{error.message}</div>
      </div>
    );
  }

  if (!selectedPokemon) {
    return <></>;
  }

  return (
    <div className={styles.detailsPanel}>
      <button onClick={onClose} className={styles.closeButton}>
        ×
      </button>
      <h2>{selectedPokemon.name.toUpperCase()}</h2>
      <Image
        src={selectedPokemon.sprites.front_default}
        alt={selectedPokemon.name}
        width={96}
        height={96}
        className={styles.detailsImage}
      />
      <div className={styles.detailsInfo}>
        <p>
          <strong>{t('types')}</strong>{' '}
          {selectedPokemon.types.map((t) => t.type.name).join(', ')}
        </p>
        <p>
          <strong>{t('abilities')}</strong>{' '}
          {selectedPokemon.abilities.map((a) => a.ability.name).join(', ')}
        </p>
        <h3>{t('baseStats')}</h3>
        <ul>
          {selectedPokemon.stats.map((stat) => (
            <li key={stat.stat.name}>
              {stat.stat.name}: {stat.base_stat}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PokemonDetails;
