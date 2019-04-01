import { useContext, useMemo, useEffect } from 'react';
import { useForceUpdate } from '@implicit/force-update';
import { GraphqlContext } from '../comps/GraphqlProvider';
import { Query } from '../classes/Query';

function varsToValues(variables) {
  return Object.keys(variables).map(
    key => variables[key]
  );
}

export function useQuery(graphql, variables = {}, { onError, onComplete, skip } = {}) {

  const client = useContext(GraphqlContext);
  const forceUpdate = useForceUpdate();
  const query = useMemo(() => new Query(client, forceUpdate, graphql, onError, onComplete, skip), []);

  useMemo(() => query.handleUpdate(variables), varsToValues(variables));

  useEffect(query.handleSubscriptions, []);

  return [
    query.data,
    query.refetch,
    query.loading,
    query.error
  ];
}
