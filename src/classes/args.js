const cache = [];
function findInCache(graphql) {
  const current = ([c_graphql]) => c_graphql === graphql;
  return cache.find(current) |> # && #[1];
}

const findArgs = /^\((?<args>(\s|.)*?)\)/;
const name_type = /\s*(?<name>\w+)\s*=\s*('|")(?<type>\S+)('|")/;
const collectArgs = function(args, arg) {
  const { name, type } = name_type.exec(arg).groups;
    return { ...args, [name]: type };
};
function extractArgs(graphql) {
  return findArgs.exec(graphql).groups.args
  |> # !== ''
    && #.match(/\s*\w+\s*=\s*('|")\S+('|")/g).reduce(collectArgs, {})
    || {};
}

export function getArgs(graphql) {
  return findInCache(graphql) ||
  extractArgs(graphql)
  |> cache.push([graphql, #]) && #;
}