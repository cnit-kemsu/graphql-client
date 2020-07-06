import { buildQuery } from './buildQuery';
import { GraphqlClient } from './GraphqlClient';

export async function fetchEntries(entries, updaters) {
  const [resultQuery, variables] = buildQuery(entries);
  // console.log(resultQuery); //DEBUG
  // console.log(values); //DEBUG

  const { data = {}, errors = undefined } = await GraphqlClient.fetch('query ' + resultQuery, variables);

  if (updaters == null) {
    updaters = [];
    for (const [query] of entries)
      for (const updater of GraphqlClient.updaters)
        if (updater.query === query && !updaters.includes(updater)) updaters.push(updater);
  }

  for (const updater of updaters) updater.makeComplete({ data, errors });
  for (const updater of updaters) updater.update();
}