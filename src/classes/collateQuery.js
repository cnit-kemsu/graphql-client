import { getArgs } from './args';

export function collateQuery(queriesToFetch) {
  const types = {};
  const values = {};

  let resultQuery = '';
  for (const [index, [graphql, variables]] of Object.entries(queriesToFetch)) {
    const args = getArgs(graphql);
    const aliases = {};
    for (const key of Object.keys(args)) {
      const name = key + index;
      aliases[key] = '$' + name;
      types[name] = args[key];
      if (variables[key] !== undefined) values[name] = variables[key];
    }
    resultQuery += graphql(aliases) + '\n';
  }

  console.log(types); //DEBUG
  console.log(resultQuery); //DEBUG
  console.log(values); //DEBUG

  return [
    Object.entries(types).map(
      ([name, type]) => '$' + name + ': ' + type
    ) |> # && '(' + # + ')' || ''
    |> `query operation${#} {${resultQuery}}`.replace(/\n\s*\n/g, '\n'),
    values
  ];
}