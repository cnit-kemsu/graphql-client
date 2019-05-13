import { GraphqlClient } from './GraphqlClient';
import { fetchElements } from './fetchElements';

export async function refetch(...elements) {
  const _elements = [];
  const updaters = [];
  for (const element of elements) {
    const [query, variables] = Array.isArray(element) ? element : [element];
    for (const updater of GraphqlClient.updaters) {
      if (updater.query === query) {
        _elements.push([query, variables || updater.variables]);
        if (!updaters.includes(updater)) updaters.push(updater);
      }
    }
  }
  for (const updater of updaters) updater.makeLoading();
  for (const updater of updaters) updater.update();
  
  await fetchElements(_elements);
}