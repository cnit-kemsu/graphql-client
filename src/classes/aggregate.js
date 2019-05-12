import { findArgs } from './findArgs';

export function aggregate(queries) {
  const types = {};
  const values = {};

  let resultQuery = '';
  for (const [index, [query, variables]] of Object.entries(queries)) {
    const args = findArgs(query);
    const aliases = {};
    for (const name of Object.keys(args)) {
      const alias = types[name] === undefined ? name : name + index + 1;
      aliases[name] = '$' + alias;
      types[alias] = args[name];
      if (variables[name] !== undefined) values[alias] = variables[name];
    }
    resultQuery += '\n  ' + query(aliases);
  }

  return [
    Object.entries(types).map(
      ([name, type]) => '$' + name + ': ' + type
    ) |> #.join('') |> # && '(' + # + ')'
    |> `query operation${#} {${resultQuery}\n}`.replace(/\n\s*\n/g, '\n'),
    values
  ];
}