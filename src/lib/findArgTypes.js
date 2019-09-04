const cache = [];
function findInCache(query) {
  const current = ([_query]) => _query === query;
  return cache.find(current) |> # && #[1];
}

// function extractArgTypes(query) {
//   const _temp = query.toString()
//   |> #.slice(1, #.indexOf(')'));

//   console.log(_temp);
//   if (_temp === '') return {};

//   const __temp = _temp.replace(/=/g, ':')
//     .replace(/'/g, '"')
//     .replace(/"?(\w+!?)"?/g, '"$1"')
//   console.log(__temp);
//   return JSON.parse(__temp);
// }

function extractArgTypes(query) {
  const _temp = query.toString()
  |> #.slice(#.indexOf('(') + 1, #.indexOf(')'));

  if (_temp === '') return {};

  const args = _temp.slice(_temp.indexOf('{') + 1, _temp.indexOf('}')).split(',');
  const _args = {};
  for (const arg of args) {
    let [name, type] = arg.split('=');
    name = name.replace(/\s/g, '').split(':')[0];
    type = type.replace(/\s/g, '').slice(1, -1);
    _args[name] = type;
  }
  return _args;
}

export function findArgTypes(query) {
  return findInCache(query)
  || extractArgTypes(query) |> cache.push([query, #]) && #;
}