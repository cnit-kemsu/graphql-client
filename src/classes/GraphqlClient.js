import { collateQuery } from './collateQuery';

class GraphqlError extends Error {
  constructor(errors) {
    super(errors?.[0]?.message);
    this.name = 'GraphqlError';
    this.errors = errors;
  }
}

export class GraphqlClient {

  headers = {};
  _waitForQueries = 0;
  queriesToFetch = [];
  queries = [];

  constructor(url) {
    this.url = url;
  }

  get waitForQueries() {
    return this._waitForQueries;
  }
  set waitForQueries(value) {
    this._waitForQueries = value;
    if (this._waitForQueries === 0) this.fetchQueries();
  }

  async fetchQueries() {
    const [resultQuery, values] = collateQuery(this.queriesToFetch);

    await this.fetch({
      query: resultQuery,
      variables: values
    });
    for (const [graphql] of this.queriesToFetch) {
      for (const query of this.queries) {
        if (query.graphql === graphql) query.forceUpdate();
      }
    }
    this.queriesToFetch = [];
  }

  async fetch(body) {

    const formData  = new FormData();
    formData.append('query', body.query);
    formData.append('variables', JSON.stringify(body.variables));

    try {

      const responce = await fetch(this.url, {
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          ...this.headers
        },
        body: formData
      });
  
      const result = await responce.json();
      if (responce.status !== 200 || result.errors !== undefined) throw new GraphqlError(result.errors);
      return result.data;

    } catch (error) {
      if (error.name === 'GraphqlError') throw error;
      else throw new GraphqlError([error]);
    }
    
  }
}
