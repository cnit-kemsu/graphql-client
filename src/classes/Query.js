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

    this.refetch = this.refetch.bind(this);
    this.handleSubscriptions = this.handleSubscriptions.bind(this);
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

    this.loading = false;
    this.forceUpdate();
  }

  handleUpdate(variables) {

    if (this.skip) {
      this.skip = false;
      return;
    }
    this.loading = true;

    this.variables = variables;
    this.fetch();
  }

  refetch(variables) {

    this.loading = true;
    this.forceUpdate();

    if (variables !== undefined) this.variables = variables;
    this.fetch();
  }

  handleSubscriptions() {
    return () => {
      this.forceUpdate = () => undefined;
    };
  }

}