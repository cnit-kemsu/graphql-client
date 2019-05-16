import { GraphqlClient } from './GraphqlClient';
import { UIBlocker } from '../classes/UIBlocker';
import { aggregate } from './aggregate';

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

    this.commit = this.commit.bind(this);
  }

  async commit(variables) {
    if (this.blockUI) UIBlocker.disable();

    const { data, errors = null } = await GraphqlClient.fetch({
      query: this.query,
      variables: {
        ...this.static,
        ...variables
      }
    });
    
    if (this.blockUI) UIBlocker.enable();

    if (errors === null) this.onComplete?.(data, {
      ...this.static,
      ...variables
    }); else this.onError?.(errors);

    if (errors !== null) return errors;
  }

}