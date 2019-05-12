import { useMemo, useEffect } from 'react';
import { useForceUpdate } from '@kemsu/force-update';
import { QueryUpdater } from '../classes/QueryUpdater';

function varsToEntries(variables) {
  const keys = Object.keys(variables);
  const entries = [];
  for (const name of keys) {
    entries.push(name);
    entries.push(variables[name]);
  }
  return entries;
}

export function useQuery(query, variables = {}, { onError, onComplete, skip } = {}) {

  const forceUpdate = useForceUpdate();
  const updater = useMemo(() => new QueryUpdater(forceUpdate, query, onError, onComplete, skip), []);

  useEffect(updater.handleSubscriptions, []);

  updater.variables = variables;
  const varEntries = varsToEntries(variables);
  useMemo(updater.addToSuspended, varEntries);
  useEffect(updater.removeFromSuspended, varEntries);

  updater.test();

  return [
    updater.data,
    updater.loading,
    updater.errors
  ];
}
