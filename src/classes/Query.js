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

export class Query {

  data = {};
  loading = true;
  error = undefined;

  constructor(client, forceUpdate, query, onError, onComplete, skip = false) {
    this.client = client;
    this.forceUpdate = forceUpdate;
    this.query = query;
    this.args = extractArgs(query);
    this.onError = onError;
    this.onComplete = onComplete;
    this.skip = skip;

    //this.refetch = this.refetch.bind(this);
    this.handleSubscriptions = this.handleSubscriptions.bind(this);
  }

  // async fetch() {
  //   try {

  //     this.data = await this.client.fetch({
  //       query: this.query,
  //       variables: this.variables
  //     });
  //     this.error = undefined;
  //     this.onComplete?.(this.data);

  //   } catch (error) {
  //     this.error = error;
  //     this.onError?.(error);
  //   }

  //   this.loading = false;
  //   this.forceUpdate();
  // }

  // handleUpdate(variables) {

  //   if (this.skip) {
  //     this.skip = false;
  //     return;
  //   }
  //   this.loading = true;

  //   this.variables = variables;
  //   this.fetch();
  // }

  // refetch(variables) {

  //   this.loading = true;
  //   this.forceUpdate();

  //   if (variables !== undefined) this.variables = variables;
  //   this.fetch();
  // }

  handleSubscriptions() {
    this.client.queries.push(this);
    return () => {
      //this.forceUpdate = () => undefined;
      this.client.queries.splice(this.client.queries.indexOf(this), 1);
    };
  }

}