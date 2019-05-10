const USERS_QUERY = () => `
  users(limit:) {
    id
    username
    email
  }
`;

function splitArg(arg) { return arg.split('='); }
function collectArgs(args, [name, type]) {
  return {
    ...args,
    [name.trim()]: type.trim() |> #.substring(1, #.length - 1)
  };
}
function extractArgs(query) {
  const str = query.toString();
  if (str.indexOf(')') === 1) return {};
  return str.substring(str.indexOf('(') + 1, str.indexOf(')'))
  |> #.substring(#.indexOf('{') + 1, #.indexOf('}'))
  |> #.split(',').map(splitArg).reduce(collectArgs, {});
}

console.log(extractArgs(USERS_QUERY));