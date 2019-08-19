const cache = [];
function findInCache(query) {
  const current = ([_query]) => _query === query;
  return cache.find(current) |> # && #[1];
}

function extractArgTypes(query) {
  return query.toString()
  |> #.slice(1, #.indexOf(')'))
  |> # === '' && {} || (
    #.replace(/=/g, ':')
    .replace(/'/g, '"')
    .replace(/"?(\w+!?)"?/g, '"$1"')
    |> JSON.parse
  );
}

export function findArgTypes(query) {
  return findInCache(query)
  || extractArgTypes(query) |> cache.push([query, #]) && #;
}