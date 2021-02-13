// useContext: simple Counter
// http://localhost:3000/isolated/exercise/03.js

import React, {useContext, useState} from 'react';

interface CountContextInterface {
  setCount: React.Dispatch<React.SetStateAction<number>>;
  count: number;
}
const CountContext = React.createContext<CountContextInterface | null>(null);

function useCount(): CountContextInterface {
  const value = useContext(CountContext);
  if (!value)
    throw new Error(
      'count context value must be set before using. you may need to wrap your component in CountProvider',
    );
  return value;
}

const CountProvider: React.FC = props => {
  const [count, setCount] = useState(0);
  return <CountContext.Provider value={{count, setCount}} {...props} />;
};

function CountDisplay() {
  const {count} = useCount();
  return <div>{`The current count is ${count}`}</div>;
}

function Counter() {
  const {setCount} = useCount();
  const increment = () => setCount(c => c + 1);
  return <button onClick={increment}>Increment count</button>;
}

function App() {
  return (
    <div>
      <CountProvider>
        <CountDisplay />
        <Counter />
      </CountProvider>
    </div>
  );
}

export default App;
