import { useMemo } from 'react';
import { Mutation } from '../classes/Mutation';

export function useMutation(query, options, variables) {

  const mutation = useMemo(() => new Mutation(query, options), []);
  mutation.refreshOptions(options);
  mutation.static = variables;

  return mutation.commit;
}
