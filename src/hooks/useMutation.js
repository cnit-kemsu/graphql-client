import { useMemo } from 'react';
import { Mutation } from '../classes/Mutation';

export function useMutation(graphql, { onError, onComplete, blockUI = true } = {}, variables) {

  const mutation = useMemo(() => new Mutation(graphql, onError, onComplete, blockUI), []);
  mutation.static = variables;

  return mutation.mutate;
}
