export class Mutation {

  constructor(client, mutation, onError, onComplete) {
    this.client = client;
    this.mutation = mutation;
    this.onError = onError;
    this.onComplete = onComplete;

    this.mutate = this.mutate.bind(this);
  }

  async mutate(variables) {
    try {

      const data = await this.client.fetch({
        query: this.mutation,
        variables: {
          ...this.variables,
          ...variables
        }
      });
      this.onComplete?.(data);

    } catch (error) {
      this.onError?.(error);
      return error;
    }
  }

}