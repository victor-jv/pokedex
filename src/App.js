import './App.css';
import pokeApi from './hooks/pokeApi';
import { useState, useEffect } from 'react';

function App() {
  const [pokemonList, setPokemonList] = useState(null);
  const [loadMoreButton, setLoadMoreButton] = useState(null);

  const maxRecords = 151;
  const limit = 10;
  let offset = 0;

  function convertPokemonToLi(pokemon) {
    return `
      <li class="pokemon ${pokemon.type}">
        <span class="number">#${pokemon.number}</span>
        <span class="name">${pokemon.name}</span>
        <div class="detail">
          <ol class="types">
            ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
          </ol>
          <img src="${pokemon.photo}" alt="${pokemon.name}">
        </div>
      </li>
    `;
  }

  function loadPokemonItems(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
      const newHtml = pokemons.map(convertPokemonToLi).join('');
      if (pokemonList) {
        pokemonList.innerHTML += newHtml;
      }
    });
  }

  useEffect(() => {
    const pokemonListElement = document.getElementById('pokemonList');
    const loadMoreButtonElement = document.getElementById('loadMoreButton');

    setPokemonList(pokemonListElement);
    setLoadMoreButton(loadMoreButtonElement);

    loadPokemonItems(offset, limit);

    if (loadMoreButtonElement) {
      loadMoreButtonElement.addEventListener('click', () => {
        offset += limit;
        const qtdRecordsWithNextPage = offset + limit;

        if (qtdRecordsWithNextPage >= maxRecords) {
          const newLimit = maxRecords - offset;
          loadPokemonItems(offset, newLimit);

          if (loadMoreButtonElement.parentElement) {
            loadMoreButtonElement.parentElement.removeChild(loadMoreButtonElement);
          }
        } else {
          loadPokemonItems(offset, limit);
        }
      });
    }
  }, []);

  return (
    <>
      <section className='content'>
        <h1>Pokedex</h1>
        <ol id='pokemonList' className='pokemons'></ol>
        <div className='pagination'>
          <input id='loadMoreButton' type='button' value='Carregar Mais' />
        </div>
      </section>
    </>
  );
}

export default App;