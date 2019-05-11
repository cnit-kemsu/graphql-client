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
    let graphql = '';
    const vars = {};
    const values = {};
    for (const [index, [query, variables]] of Object.entries(this.queriesToFetch)) {
      const _variables = Object.entries(variables).reduce(
        (_vars, [key, value]) => {
          const _key = key + '_' + index;
          vars[_key] = query.args[key];
          values[_key] = value;
          return {
            ..._vars,
            [key]: '$' + _key
          };
        },
        {}
      );
      graphql = graphql + query.query(_variables) + '\n';
    }
    const varsStr = Object.entries(vars).map(
      ([key, val]) => '$' + key + ': ' + val
    ) |> # && '(' + # + ')' || '';
    graphql = `query operation1${varsStr} {${graphql}}`.replace(/\n\s*\n/g, '\n');
    console.log(vars);
    console.log(graphql);
    console.log(values);
    this.queriesToFetch = [];
    await this.fetch({
      query: graphql,
      variables: values
    });
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
