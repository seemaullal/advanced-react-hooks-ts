// useContext: Caching response data in context
// 💯 caching in a context provider (exercise)
// http://localhost:3000/isolated/exercise/03.extra-2.js

// you can edit this here and look at the isolated page or you can copy/paste
// this in the regular exercise file.

import React, {useContext} from 'react';
import {
  fetchPokemon,
  PokemonForm,
  PokemonDataView,
  PokemonInfoFallback,
  PokemonErrorBoundary,
} from '../pokemon';
import {useAsync} from '../utils';

interface PokemonCacheInterface {
  cache: any;
  dispatch: React.Dispatch<any>;
}

const PokemonCacheContext = React.createContext<PokemonCacheInterface | null>(
  null,
);

function usePokemonCache() {
  const cacheValue = useContext(PokemonCacheContext);
  if (!cacheValue) {
    throw new Error(
      'the PokemonCache hook can only be used in a component wrapped by PokemonCacheProvider',
    );
  }
  return cacheValue;
}
function pokemonCacheReducer(state: any, action: any) {
  switch (action.type) {
    case 'ADD_POKEMON': {
      return {...state, [action.pokemonName]: action.pokemonData};
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

const PokemonCacheProvider: React.FC = props => {
  const [cache, dispatch] = React.useReducer(pokemonCacheReducer, {});

  return <PokemonCacheContext.Provider value={{cache, dispatch}} {...props} />;
};

function PokemonInfo({pokemonName}: {pokemonName: string}) {
  const {cache, dispatch} = usePokemonCache();
  const {data: pokemon, status, error, run, setData} = useAsync();

  React.useEffect(() => {
    if (!pokemonName) {
      return;
    } else if (cache[pokemonName]) {
      setData(cache[pokemonName]);
    } else {
      run(
        fetchPokemon(pokemonName).then(pokemonData => {
          dispatch({type: 'ADD_POKEMON', pokemonName, pokemonData});
          return pokemonData;
        }),
      );
    }
  }, [cache, pokemonName, run, setData, dispatch]);

  if (status === 'idle') {
    return <>'Submit a pokemon'</>;
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />;
  } else if (status === 'rejected') {
    throw error;
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />;
  } else {
    throw new Error('this should not be possible');
  }
}

function PreviousPokemon({
  onSelect,
}: {
  onSelect: (pokemonName: string) => void;
}) {
  const {cache} = usePokemonCache();

  return (
    <div>
      Previous Pokemon
      <ul style={{listStyle: 'none', paddingLeft: 0}}>
        {Object.keys(cache).map(pokemonName => (
          <li key={pokemonName} style={{margin: '4px auto'}}>
            <button
              style={{width: '100%'}}
              onClick={() => onSelect(pokemonName)}
            >
              {pokemonName}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PokemonSection({
  onSelect,
  pokemonName,
}: {
  onSelect: (pokemonName: string) => void;
  pokemonName: string;
}) {
  return (
    <PokemonCacheProvider>
      <div style={{display: 'flex'}}>
        <PreviousPokemon onSelect={onSelect} />
        <div className="pokemon-info" style={{marginLeft: 10}}>
          <PokemonErrorBoundary
            onReset={() => onSelect('')}
            resetKeys={[pokemonName]}
          >
            <PokemonInfo pokemonName={pokemonName} />
          </PokemonErrorBoundary>
        </div>
      </div>
    </PokemonCacheProvider>
  );
}

function App() {
  const [pokemonName, setPokemonName] = React.useState<string>('');

  function handleSubmit(newPokemonName: string) {
    setPokemonName(newPokemonName);
  }

  function handleSelect(newPokemonName: string) {
    setPokemonName(newPokemonName);
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <PokemonSection onSelect={handleSelect} pokemonName={pokemonName} />
    </div>
  );
}

export default App;
