import { aggregate } from './aggregate';
import { GraphqlClient } from './GraphqlClient';

export async function fetchElements(elements) {
  const [resultQuery, variables] = aggregate(elements);
  // console.log(resultQuery); //DEBUG
  // console.log(values); //DEBUG

  const { data = {}, errors = null } = await GraphqlClient.fetch({
    query: 'query ' + resultQuery,
    variables
  });

  const updaters = [];
  for (const [query] of elements) {
    for (const updater of GraphqlClient.updaters) {
      if (updater.query === query 
        && !updaters.includes(updater)
      ) updaters.push(updater);
    }
  }
  for (const updater of updaters) updater.makeComplete({ data, errors });
  for (const updater of updaters) updater.update();
}