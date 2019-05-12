import { GraphqlClient } from './GraphqlClient';
import { fetchQueries } from './fetchQueries';

export function refetch(...queries) {
  for (const query of queries) {
    for (const updater of GraphqlClient.updaters) {
      if (updater.query === query) GraphqlClient.queries.push([query, updater.variables]);
    }
  }
  fetchQueries();
}