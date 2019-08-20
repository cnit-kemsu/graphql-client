import { fetchEntries } from './fetchEntries';

async function _fetchEntries() {
  const entries = GraphqlClient.entries;
  GraphqlClient.entries = [];
  await fetchEntries(entries);
}

function splitBlobs(value, blobs = []) {
  if (value instanceof Blob) {
    const blobIndex = blobs.findIndex(blob => blob === value);
    if (blobIndex === -1) {
      blobs.push(value);
      value = 'blob_index=' + blobs.length - 1;
    } else {
      value = 'blob_index=' + blobIndex;
    }
  }
  if (value instanceof Object) for (const key in value) splitBlobs(value[key], blobs);
  return [value, blobs];
}

let suspendedQueue = 0;
export class GraphqlClient {

  static url;
  static headers = {
    'X-Requested-With': 'XMLHttpRequest'
  };
  static entries = [];
  static updaters = [];

  static get suspendedQueue() {
    return suspendedQueue;
  }
  static set suspendedQueue(value) {
    suspendedQueue = value;
    if (value === 0) _fetchEntries();
  }

  static async fetch(query, variables) {

    const body  = new FormData();
    body.append('query', query);
    const [_variables, blobs] = splitBlobs(variables);
    body.append('variables', JSON.stringify(_variables));
    for (const key in blobs) body.append(key, blobs[key]);

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
