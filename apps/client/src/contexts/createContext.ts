import React from 'react';

export const createContext = <T>(
  contextName: string,
  defaultValue?: T,
): [React.Context<T | undefined>, () => T] => {
  const ctx = React.createContext<T | undefined>(defaultValue);

  const useContext = () => {
    const _ctx = React.useContext(ctx);

    if (_ctx === undefined) {
      throw new Error(
        `${contextName} useContext hook must be used within a ${contextName} provider`,
      );
    }

    return _ctx as T;
  };

  return [ctx, useContext];
};
