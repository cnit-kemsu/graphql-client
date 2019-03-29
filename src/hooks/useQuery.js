import { useContext, useMemo } from 'react';
import { useForceUpdate } from '@implicit/force-update';
import { GraphqlContext } from '../classes/GraphqlProvider';
import { Query } from '../classes/Query';

export function useQuery(query, variables, { onError, onComplete, skip } = {}) {

  const client = useContext(GraphqlContext);
  const forceUpdate = useForceUpdate();
  const _query = useMemo(() => new Query(client, forceUpdate, query, onError, onComplete, skip), []);

  useMemo(
    () => _query.refetch(variables),
    Object.keys(variables).map(
      key => variables[key]
    )
  );

  return [
    _query.data,
    _query.refetch,
    _query.loading,
    _query.error
  ];
}
