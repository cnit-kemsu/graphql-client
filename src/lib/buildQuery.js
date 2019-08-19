import { findArgTypes } from './findArgTypes';
import { convertValue } from './convertValue';

function stringifyArg([name, type]) {
  return '$' + name + ': ' + type;
}

export function buildQuery(entries) {
  const resultArgTypes = {};
  const resultVariables = {};

  let resultQuery = '';
  for (let index = 0; index < entries.length; index++) {
    const [query, variables] = entries[index];
    const argTypes = findArgTypes(query);
    const aliases = {};
    for (const name in argTypes) {
      const alias = resultArgTypes[name] === undefined ? name : name + '_' + index;
      aliases[name] = '$' + alias;
      resultArgTypes[alias] = argTypes[name];
      if (variables?.[name] !== undefined) resultVariables[alias] = convertValue(variables[name], argTypes[name]);
    }
    resultQuery += '\n  ' + query(aliases).trim();
  }

  return [
    Object.entries(resultArgTypes).map(stringifyArg).join(' ')
    |> # && '(' + # + ')'
    |> `operation${#} {${resultQuery}\n}`,//.replace(/\n+\s*\n+/g, '\n'),
    resultVariables
  ];
}