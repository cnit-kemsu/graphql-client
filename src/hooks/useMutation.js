import { useMemo } from 'react';
import { Mutation } from '../lib/Mutation';

export function useMutation(query, options, variables) {

  const mutation = useMemo(() => new Mutation(query, options), []);
  mutation.refreshOptions(options);
  mutation.variables = variables;

  return mutation.commit;
}
