import { useSyncExternalStore, useRef } from 'react';

type Listener = () => void;

export interface Store<T> {
  getState: () => T;
  setState: (partial: Partial<T> | ((s: T) => Partial<T>)) => void;
  subscribe: (l: Listener) => () => void;
}

export function createStore<T>(init: T): Store<T> {
  let state = init;
  const listeners = new Set<Listener>();
  return {
    getState: () => state,
    setState: (partial) => {
      const patch = typeof partial === 'function' ? partial(state) : partial;
      state = { ...state, ...patch };
      listeners.forEach((l) => l());
    },
    subscribe: (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
  };
}

type Set<T> = (partial: Partial<T> | ((s: T) => Partial<T>)) => void;
type Get<T> = () => T;

/**
 * create returns a hook supporting both `useStore()` (whole state)
 * and `useStore(selector)` (sliced state with shallow compare).
 */
export function create<T>(init: (set: Set<T>, get: Get<T>) => T): {
  (): T;
  <U>(selector: (s: T) => U): U;
} {
  let store: Store<T> | null = null;
  let initialized = false;
  function getStore() {
    if (!store) {
      store = createStore<T>({} as T);
    }
    if (!initialized) {
      initialized = true;
      const state = init(store.setState, store.getState);
      store.setState(state);
    }
    return store;
  }

  function useStoreValue(): T;
  function useStoreValue<U>(selector: (s: T) => U): U;
  function useStoreValue<U>(selector?: (s: T) => U): T | U {
    const s = getStore();
    const selectorRef = useRef(selector);
    selectorRef.current = selector;
    return useSyncExternalStore(
      s.subscribe,
      () => (selectorRef.current ? selectorRef.current(s.getState()) : s.getState()),
      () => (selectorRef.current ? selectorRef.current(s.getState()) : s.getState()),
    );
  }

  return useStoreValue as {
    (): T;
    <U>(selector: (s: T) => U): U;
  };
}
