import { fetchElements } from './fetchElements';

async function fetchClientQueries() {
  const elements = GraphqlClient.elements;
  GraphqlClient.elements = [];
  await fetchElements(elements);
}

function appendBlobs(body, target, namePath = []) {
  if (target instanceof Array || (target instanceof Object && target.constructor === Object)) {
    for (const key of Object.keys(target)) {
      appendBlobs(body, target[key], [ ...namePath , key ]);
    }
  } else {
    body.append(namePath.join('.'), target);
  }
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

  static async fetch({ query, variables, blobs }) {

    const body  = new FormData();
    body.append('query', query);
    body.append('variables', JSON.stringify(variables));
    appendBlobs(body, blobs);

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
