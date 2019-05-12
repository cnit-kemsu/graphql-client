const cache = [];
function findInCache(query) {
  const current = ([_query]) => _query === query;
  return cache.find(current) |> # && #[1];
}

const pickArgs = /^\((?<args>(\s|.)*?)\)/;
const pickNameAndType = /\s*(?<name>\w+)\s*=\s*('|")(?<type>\S+)('|")/;
const collectArgs = function(_args, arg) {
  const { name, type } = pickNameAndType.exec(arg).groups;
    return { ..._args, [name]: type };
};
function extractArgs(query) {
  return pickArgs.exec(query).groups.args
  |> # !== ''
    && #.match(/\s*\w+\s*=\s*('|")\S+('|")/g).reduce(collectArgs, {})
    || {};
}

export function findArgs(query) {
  return findInCache(query) ||
    extractArgs(query)
    |> cache.push([query, #]) && #;
}