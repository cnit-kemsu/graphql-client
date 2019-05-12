import { useContext, useMemo, useEffect } from 'react';
import { useForceUpdate } from '@kemsu/force-update';
import { GraphqlContext } from '../comps/GraphqlProvider';
import { Query } from '../classes/Query';

function varsToValues(variables) {
  return Object.keys(variables).map(
    key => key + ' = ' + JSON.stringify(variables[key])
  );
}

export function useQuery(graphql, variables = {}, { onError, onComplete, skip } = {}) {

  const client = useContext(GraphqlContext);
  const forceUpdate = useForceUpdate();
  const query = useMemo(() => new Query(client, forceUpdate, graphql, onError, onComplete, skip), []);

  useEffect(query.handleSubscriptions, []);

  const varsValues = varsToValues(variables);
  useMemo(() => { client.queriesToFetch.push([graphql, variables]); client.waitForQueries++; }, varsValues);
  useEffect(() => { client.waitForQueries--; }, varsValues);

  //useMemo(() => query.handleUpdate(variables), varsToValues(variables));

  //useEffect(query.handleSubscriptions, []);

  return [
    query.data,
    query.loading,
    query.refetch,
    query.error
  ];
}
