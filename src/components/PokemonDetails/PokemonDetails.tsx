import React, { JSX } from 'react';
import styles from './PokemonDetails.module.css';
import { usePokemonDetails } from '../../queries/pokemonQueries';
import type { PokemonDetails } from '../../queries/pokemonQueries';

interface PokemonDetailsProps {
  pokemonId: string | null;
  onClose: () => void;
}

function PokemonDetails({
  pokemonId,
  onClose,
}: PokemonDetailsProps): JSX.Element {
  const {
    data: selectedPokemon,
    isLoading,
    error,
  } = usePokemonDetails(pokemonId ?? undefined);

  if (!pokemonId) {
    return <></>;
  }

  if (isLoading) {
    return <div className={styles.spinner}>Loading...</div>;
  }

  if (error) {
    return (
      <div className={styles.detailsPanel}>
        <button onClick={onClose} className={styles.closeButton}>
          ×
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
      <img
        src={selectedPokemon.sprites.front_default}
        alt={selectedPokemon.name}
        className={styles.detailsImage}
      />
      <div className={styles.detailsInfo}>
        <p>
          <strong>Types:</strong>{' '}
          {selectedPokemon.types.map((t) => t.type.name).join(', ')}
        </p>
        <p>
          <strong>Abilities:</strong>{' '}
          {selectedPokemon.abilities.map((a) => a.ability.name).join(', ')}
        </p>
        <h3>Base Stats:</h3>
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
