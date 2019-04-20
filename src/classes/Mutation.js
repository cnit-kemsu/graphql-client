import { UIBlocker } from '../classes/UIBlocker';

export class Mutation {

  constructor(client, mutation, onError, onComplete, blockUI) {
    this.client = client;
    this.mutation = mutation;
    this.onError = onError;
    this.onComplete = onComplete;
    this.blockUI = blockUI;

    this.mutate = this.mutate.bind(this);
  }

  async mutate(variables) {
    try {

      if (this.blockUI) UIBlocker.disable();
      const data = await this.client.fetch({
        query: this.mutation,
        variables: {
          ...this.variables,
          ...variables
        }
      });
      if (this.blockUI) UIBlocker.enable();
      this.onComplete?.(data, variables);

    } catch (error) {
      if (this.blockUI) UIBlocker.enable();
      this.onError?.(error);
      return error;
    }
  }

}