import { useMemo, useEffect } from 'react';
import { useForceUpdate } from '@kemsu/force-update';
import { QueryUpdater } from '../classes/QueryUpdater';

function variablesToWatchArray(variables) {
  const watchArray = [];
  for (const name in variables) {
    watchArray.push(name);
    watchArray.push(variables[name]);
  }
  return watchArray;
}

export function useQuery(query, variables = {}, { onError, onComplete, skip = false } = {}) {

  const forceUpdate = useForceUpdate();
  const updater = useMemo(() => new QueryUpdater(forceUpdate, query, onError, onComplete, skip), []);

  useEffect(updater.handleSubscriptions, []);

  updater.variables = variables;
  const watchArray = variablesToWatchArray(variables);
  useMemo(updater.addToSuspended, watchArray);
  useEffect(updater.removeFromSuspended, watchArray);

  updater.test();

  return [
    updater.data,
    updater.loading,
    updater.errors
  ];
}
