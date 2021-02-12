import {useRef, useReducer, useEffect, useCallback} from 'react';

export enum Status {
  IDLE = 'idle',
  PENDING = 'pending',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
}
type AsyncState =
  | {status: Status.IDLE; data: null; error: null}
  | {status: Status.PENDING; data: null; error: null}
  | {status: Status.RESOLVED; data: unknown; error: null}
  | {status: Status.REJECTED; error: Error; data: null};

type ActionType =
  | {type: Status.IDLE}
  | {type: Status.PENDING}
  | {type: Status.RESOLVED; data: unknown}
  | {type: Status.REJECTED; error: Error};

function asyncReducer(_state: AsyncState, action: ActionType): AsyncState {
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

export function useAsync(status: {status: Status}) {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  });

  const [state, dispatch] = useReducer(asyncReducer, {
    status: status.status === Status.IDLE ? Status.IDLE : Status.PENDING,
    error: null,
    data: null,
  });

  const run = useCallback((promise: Promise<unknown>) => {
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
