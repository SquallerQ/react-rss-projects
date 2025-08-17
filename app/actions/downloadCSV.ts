'use server';

import { Pokemon } from '../../src/store/pokemonStore';

export async function generateCSV(selectedPokemons: Pokemon[]) {
  const headers = ['ID,Name,Description,Details URL'];
  const rows = selectedPokemons.map((pokemon) =>
    [
      pokemon.id,
      pokemon.name,
      `Type: ${pokemon.types.map((t) => t.type.name).join(',')}`,
      `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`,
    ].join(',')
  );

  const csvContent = [...headers, ...rows].join('\n');
  const filename = `${selectedPokemons.length}_items.csv`;

  return {
    content: csvContent,
    filename: filename,
    mimeType: 'text/csv;charset=utf-8;',
  };
}
