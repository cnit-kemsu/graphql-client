import { aggregate } from './aggregate';
import { GraphqlClient } from './GraphqlClient';

function affectedUpdaters() {
  const updaters = [];
  for (const [query] of GraphqlClient.queries) {
    for (const updater of GraphqlClient.updaters) {
      if (updater.query === query 
        && !updaters.includes(updater)
      ) updaters.push(updater);
    }
  }
  return updaters;
}

export async function fetchQueries() {
  const [resultQuery, values] = aggregate(GraphqlClient.queries);
  // console.log(resultQuery); //DEBUG
  // console.log(values); //DEBUG

  const updaters = affectedUpdaters();
  for (const updater of updaters) updater.setState({ loading: true });
  for (const updater of updaters) updater.update();

  const { data = {}, errors = null } = await GraphqlClient.fetch({
    query: resultQuery,
    variables: values
  });

  for (const updater of updaters) {
    updater.setState({ loading: false, data, errors });
    if (errors === null) updater.onComplete?.(data);
    else updater.onError?.(errors);
  }
  for (const updater of updaters) updater.update();

  GraphqlClient.queries = [];
}