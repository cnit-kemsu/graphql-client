import { fetchElements } from './fetchElements';

async function fetchClientQueries() {
  await fetchElements(GraphqlClient.elements);
  GraphqlClient.elements = [];
}

let suspendedQueue = 0;
export class GraphqlClient {

  static url;
  static headers = {
    'X-Requested-With': 'XMLHttpRequest'
  };
  static elements = [];
  static updaters = [];

  static get suspendedQueue() {
    return suspendedQueue;
  }
  static set suspendedQueue(value) {
    suspendedQueue = value;
    if (value === 0) fetchClientQueries();
  }

  static async fetch({ query, variables }) {

    const body  = new FormData();
    body.append('query', query);
    body.append('variables', JSON.stringify(variables));

    try {

      const responce = await fetch(GraphqlClient.url, {
        method: 'POST',
        headers: GraphqlClient.headers,
        body
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
