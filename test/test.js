// const query = `
//   users(limit: $limit1) {
//     id
//     username(full: $full1) {
//       name
//       surname
//     }
//     mail: email
//   }
//   count: usersCount
// `;

// const findFields = /((?<alias>(\D\w)\w*):)?(?<name>(\D\w)\w*)(\s*\((?<args>(\s|.)+?)\))?(\s*{(?<fields>(\s|.)+)})?/g;
// function parseGraphql(query) {
//   const res = findFields.exec(query);
//   console.log(res);
// }

// parseGraphql(query);
// parseGraphql(query);

const USERS_QUERY = () => `
  users(limit: 1) {
    id
    username
    email
  }
`;

const findArgs = /^\((?<args>(\s|.)*?)\)/;
const name_type = /\s*(?<name>\w+)\s*=\s*('|")(?<type>\S+)('|")/;
const collectArgs = function(args, arg) {
  const { name, type } = name_type.exec(arg).groups;
    return { ...args, [name]: type };
}
function extractArgs(query) {
  return findArgs.exec(query).groups.args
  |> # !== ''
    && #.match(/\s*\w+\s*=\s*('|")\S+('|")/g).reduce(collectArgs, {})
    || undefined;
}

// const str = USERS_QUERY.toString();
// const findArgs = /^\((?<args>(\s|.)*?)\)/;
// let args = findArgs.exec(str).groups.args;
// const splitNameAndType = /\s*(?<name>\w+)\s*=\s*('|")(?<type>\S+)('|")/;
// args = args.match(/\s*\w+\s*=\s*('|")\S+('|")/g)
// .reduce(
//   (args, arg) => {
//     const { name, type } = splitNameAndType.exec(arg).groups;
//     return { ...args, [name]: type };
//   },
//   {}
// );
console.log(extractArgs(USERS_QUERY));