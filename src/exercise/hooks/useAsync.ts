import React, {useRef, useReducer, useEffect, useCallback} from 'react';

export enum Status {
  IDLE = 'idle',
  PENDING = 'pending',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
}
type AsyncState<Data> =
  | {status: Status.IDLE; data: null; error: null}
  | {status: Status.PENDING; data: null; error: null}
  | {status: Status.RESOLVED; data: Data; error: null}
  | {status: Status.REJECTED; error: Error; data: null};

type ActionType<Data> =
  | {type: Status.IDLE}
  | {type: Status.PENDING}
  | {type: Status.RESOLVED; data: Data}
  | {type: Status.REJECTED; error: Error};

// type AsyncReducerAsyncReducer = React.Reducer<AsyncState<Data>,ActionType<Data>>
function asyncReducer<Data>(
  _state: AsyncState<Data>,
  action: ActionType<Data>,
): AsyncState<Data> {
  switch (action.type) {
    case Status.IDLE: {
      return {status: Status.IDLE, data: null, error: null};
    }
    case Status.PENDING: {
      return {status: Status.PENDING, data: null, error: null};
    }
    case Status.RESOLVED: {
      return {status: Status.RESOLVED, data: action.data, error: null};
    }
    case Status.REJECTED: {
      return {status: Status.REJECTED, data: null, error: action.error};
    }
  }
}
type UseAsyncReturn<Data> = AsyncState<Data> & {
  run: (promise: Promise<Data>) => void;
};
export function useAsync<Data>(status: {status: Status}): UseAsyncReturn<Data> {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  });

  const [state, dispatch] = useReducer<
    React.Reducer<AsyncState<Data>, ActionType<Data>>
  >(asyncReducer, {
    status: status.status === Status.IDLE ? Status.IDLE : Status.PENDING,
    error: null,
    data: null,
  });

  const run = useCallback((promise: Promise<Data>) => {
    dispatch({type: Status.PENDING});
    promise
      .then(data => {
        if (isMounted.current) {
          dispatch({type: Status.RESOLVED, data});
        }
      })
      .catch((error: Error) => {
        if (isMounted.current) {
          dispatch({type: Status.REJECTED, error});
        }
      });
  }, []);

  return {...state, run};
}
