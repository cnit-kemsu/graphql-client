import { GraphqlClient } from './GraphqlClient';
import { UIBlocker } from '../classes/UIBlocker';
import { aggregate } from './aggregate';
import { findArgs } from './findArgs';

function toElementArray(query) {
  return [query, {}];
}

export class Mutation {

  constructor(query, { onError, onComplete, blockUI = true }) {
    this.query = Array.isArray(query) ? query.map(toElementArray) : [[query, {}]]
    |> 'mutation ' + aggregate(#)[0];
    this.onError = onError;
    this.onComplete = onComplete;
    this.blockUI = blockUI;

    this.argTypes = Array.isArray(query) ? query.map(query) : findArgs(query);

    this.commit = this.commit.bind(this);
  }

  refreshOptions({ onError, onComplete, blockUI }) {
    this.onError = onError;
    this.onComplete = onComplete;
    this.blockUI = blockUI;
  }

  async commit(variables, blobs) {
    if (this.blockUI) UIBlocker.disable();

    const _variables = { ...variables };
    if (variables != null) for (const key of Object.keys(variables)) {
      if (variables[key] != null && variables[key] !== '') 
        if (this.argTypes[key].includes('Int') || this.argTypes[key].includes('Float')) {
          _variables[key] = Number(variables[key]);
        }
    }

    const { data, errors = null } = await GraphqlClient.fetch({
      query: this.query,
      variables: {
        ...this.static,
        ..._variables
      },
      blobs
    });
    
    if (this.blockUI) UIBlocker.enable();

    if (errors === null) this.onComplete?.(data, {
      ...this.static,
      ...variables
    }); else this.onError?.(errors);

    if (errors !== null) return errors;
  }

}