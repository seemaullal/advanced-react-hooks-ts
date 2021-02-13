import {useLayoutEffect, useRef, useCallback} from 'react';

export function useSafeDispatch(dispatchFunction: any) {
  const isMounted = useRef(false);

  useLayoutEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  });
  const safeDispatch = useCallback(
    (...args: any) => {
      if (!isMounted.current) return;
      dispatchFunction(...args);
    },
    [dispatchFunction],
  );
  return safeDispatch;
}
