function convert([key, value]) {
  return JSON.stringify(value) |> encodeURI |> key + '=' + #;
}

function extract(values, value) {
  return value.split('=') |> {
    ...values,
    [#[0]]: decodeURI(#[1]) |> JSON.parse
  };
}

export class QS {

  static stringify(values) {
    return values === undefined ? '' :
      Object.entries(values).map(convert).join('&') |> # && '?' + # || '';
  }

  static parse(search) {
    return !search ? undefined :
      search.substr(1).split('&').reduce(extract, {});
  }

}