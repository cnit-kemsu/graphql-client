import { GraphqlClient } from './GraphqlClient';
import { fetchEntries } from './fetchEntries';

export async function refetch(...entries) {
  const _entries = [];
  const updaters = [];
  for (const entry of entries) {
    const [query, variables] = entry instanceof Array ? entry : [entry];
    for (const updater of GraphqlClient.updaters) {
      if (updater.query === query) {
        _entries.push([query, variables || updater.variables]);
        if (!updaters.includes(updater)) updaters.push(updater);
      }
    }
  }
  for (const updater of updaters) updater.makeLoading();
  for (const updater of updaters) updater.update();
  
  await fetchEntries(_entries, updaters);
}