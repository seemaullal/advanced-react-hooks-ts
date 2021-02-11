import React, {useReducer} from 'react';

interface CounterState {
  count: number;
}

interface UpdateAction {
  type: 'increment' | 'decrement';
  step: number;
}

const countReducer: React.Reducer<CounterState, UpdateAction> = (
  previousState,
  action,
) => {
  switch (action.type) {
    case 'increment':
      return {count: previousState.count + action.step};
    case 'decrement':
      return {count: previousState.count - action.step};
  }
};

function Counter({
  initialCount = 0,
  step = 1,
}: {
  initialCount?: number;
  step?: number;
}) {
  const [state, dispatch] = useReducer(countReducer, {
    count: initialCount,
  });

  const {count} = state;

  const increment = () => dispatch({type: 'increment', step});
  const decrement = () => dispatch({type: 'decrement', step});
  return (
    <>
      <button onClick={increment}>+</button>
      <span>{count}</span>
      <button onClick={decrement}>-</button>
    </>
  );
}

function App() {
  return <Counter />;
}

export default App;
