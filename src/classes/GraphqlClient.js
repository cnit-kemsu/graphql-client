import { fetchQueries } from './fetchQueries';

let suspended = 0;
export class GraphqlClient {

  static url;
  static headers = {
    'X-Requested-With': 'XMLHttpRequest'
  };
  static queries = [];
  static updaters = [];

  static get suspended() {
    return suspended;
  }
  static set suspended(value) {
    suspended = value;
    if (value === 0) fetchQueries();
  }

  static async fetch(body) {

    const formData  = new FormData();
    formData.append('query', body.query);
    formData.append('variables', JSON.stringify(body.variables));

    try {

      const responce = await fetch(GraphqlClient.url, {
        method: 'POST',
        headers: GraphqlClient.headers,
        body: formData
      });
  
      const result = await responce.json();
      if (responce.status !== 200) GraphqlClient.onGraphqlErrors?.(result.errors);
      else if (result.errors !== undefined) GraphqlClient.onServerErrors?.(result.errors);
      else GraphqlClient.onComplete?.(result.data);
      return result;

    } catch (error) {
      GraphqlClient.onError?.(error);
      return { errors: [error.message] };
    }
    
  }
}
