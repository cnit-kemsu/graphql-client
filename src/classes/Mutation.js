import { GraphqlClient } from './GraphqlClient';
import { UIBlocker } from '../classes/UIBlocker';

export class Mutation {

  constructor(query, { onError, onComplete, blockUI = true }) {
    this.query = query;
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
  }

}