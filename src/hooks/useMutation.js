import { useContext, useMemo } from 'react';
import { GraphqlContext } from '../comps/GraphqlProvider';
import { Mutation } from '../classes/Mutation';

export function useMutation(graphql, variables = {}, { onError, onComplete } = {}) {

  const client = useContext(GraphqlContext);
  const mutation = useMemo(() => new Mutation(client, graphql, onError, onComplete), []);
  mutation.variables = variables;

  return mutation.mutate;
}
