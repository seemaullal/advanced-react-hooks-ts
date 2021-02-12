import React from 'react';

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

export function useAsync(
  asyncCallback: () => void | Promise<any>,
  status: {status: Status},
  dependencyList: unknown[],
) {
  const [state, dispatch] = React.useReducer(asyncReducer, {
    status: Status.IDLE,
    error: null,
    data: null,
  });

  React.useEffect(() => {
    const promise = asyncCallback();
    if (!promise) {
      return;
    }
    dispatch({type: Status.PENDING});
    promise.then(
      data => {
        dispatch({type: Status.RESOLVED, data});
      },
      error => {
        dispatch({type: Status.REJECTED, error});
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencyList);
  return state;
}
