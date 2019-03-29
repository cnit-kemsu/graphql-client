export class Query {

  data = {};
  loading = true;
  error = undefined;

  constructor(client, forceUpdate, query, variables, onError, onComplete, skip = false) {
    this.client = client;
    this.forceUpdate = forceUpdate;
    this.query = query;
    this.onError = onError;
    this.onComplete = onComplete;
    this.skip = skip;
  }

  async fetch() {
    try {

      this.data = await this.client.fetch({
        query: this.query,
        variables: this.variables
      });
      this.error = undefined;
      if (this.onComplete) this.onComplete(this.data);

    } catch (error) {
      this.error = error;
      if (this.onError) this.onError(error);
    }
  }

  async refetch(variables) {
    
    if (this.loading) {
      if (this.skip) {
        this.loading = false;
        return;
      }
    } else {
      this.loading = true;
      this.forceUpdate();
    }

    if (variables !== undefined) this.variables = variables;

    await this._fetch();

    this.loading = false;
    this.forceUpdate();
  }

}