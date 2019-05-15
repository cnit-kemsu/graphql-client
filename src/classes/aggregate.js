import { findArgs } from './findArgs';

function convertValue(value, type) {
  if (type.includes('Int') || type.includes('Float')) return Number(value);
}

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
      const arg = args[name];
      types[alias] = arg;
      const variable = variables[name];
      if (variable !== undefined) values[alias] = convertValue(variable, arg);
    }
    resultQuery += '\n  ' + query(aliases);
  }

  return [
    Object.entries(types).map(
      ([name, type]) => '$' + name + ': ' + type
    ) |> #.join(' ') |> # && '(' + # + ')'
    |> `operation${#} {${resultQuery}\n}`.replace(/\n\s*\n/g, '\n'),
    values
  ];
}