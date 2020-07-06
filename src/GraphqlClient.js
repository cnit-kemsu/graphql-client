import { fetchEntries } from './fetchEntries';

async function _fetchEntries() {
  const entries = GraphqlClient.entries;
  GraphqlClient.entries = [];
  await fetchEntries(entries);
}

function splitBlobs(value, path = [], blobsMap = [], blobs = []) {

  if (value instanceof Object) for (const key in value) if (value[key] instanceof Object) {

    const _path = [ ...path, key ];
    if (value[key] instanceof Blob) {

      const blobIndex = blobs.findIndex(blob => blob === value[key]);
      if (blobIndex === -1) {
        blobs.push(value[key]);
        blobsMap.push([_path]);
        //value[key] = 'blob_index=' + (blobs.length - 1);
        delete value[key];
      } else {
        //value[key] = 'blob_index=' + blobIndex;
        delete value[key];
        blobsMap[blobIndex].push(_path);
      }
      
    } else splitBlobs(value[key], [ ...path, key ], blobsMap, blobs);

  }
  return [value, blobsMap, blobs];
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
    const [_variables, blobsMap, blobs] = splitBlobs(variables);
    body.append('variables', JSON.stringify(_variables));
    body.append('blobsMap', JSON.stringify(blobsMap));
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
