import React, {useEffect} from 'react';
import {
  fetchPokemon,
  PokemonForm,
  PokemonDataView,
  PokemonInfoFallback,
  PokemonErrorBoundary,
} from '../pokemon';
import type {Pokemon} from '../pokemon';
import {useAsync, Status} from './hooks/useAsync';

function PokemonInfo({pokemonName}: {pokemonName: string}) {
  const {run, ...state} = useAsync<Pokemon>({
    status: pokemonName ? Status.PENDING : Status.IDLE,
  });

  useEffect(() => {
    if (!pokemonName) {
      return;
    }
    run(fetchPokemon(pokemonName));
  }, [pokemonName, run]);

  if (state.status === Status.IDLE) {
    return <>'Submit a pokemon'</>;
  } else if (state.status === Status.PENDING) {
    return <PokemonInfoFallback name={pokemonName} />;
  } else if (state.status === Status.REJECTED) {
    throw state.error;
  } else if (state.status === Status.RESOLVED) {
    return <PokemonDataView pokemon={state.data} />;
  }

  throw new Error('This should be impossible');
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('');

  function handleSubmit(newPokemonName: string) {
    setPokemonName(newPokemonName);
  }

  function handleReset() {
    setPokemonName('');
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonErrorBoundary onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </PokemonErrorBoundary>
      </div>
    </div>
  );
}

function AppWithUnmountCheckbox() {
  const [mountApp, setMountApp] = React.useState(true);
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={mountApp}
          onChange={e => setMountApp(e.target.checked)}
        />{' '}
        Mount Component
      </label>
      <hr />
      {mountApp ? <App /> : null}
    </div>
  );
}

export default AppWithUnmountCheckbox;
