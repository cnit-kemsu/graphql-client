// const cache = [];
// function findInCache(graphql) {
//   const currentQuery = ([c_graphql]) => c_graphql === graphql;
//   return cache.find(currentQuery) |> # && #[1];
// }

// const findArgs = /^\((?<args>(\s|.)*?)\)/;
// const name_type = /\s*(?<name>\w+)\s*=\s*('|")(?<type>\S+)('|")/;
// const collectArgs = function(args, arg) {
//   const { name, type } = name_type.exec(arg).groups;
//     return { ...args, [name]: type };
// };
// function extractArgs(graphql) {
//   return findArgs.exec(graphql).groups.args
//   |> # !== ''
//     && #.match(/\s*\w+\s*=\s*('|")\S+('|")/g).reduce(collectArgs, {})
//     || undefined;
// }

// function getArgs(graphql) {
//   return findInCache(graphql) ||
//   extractArgs(graphql)
//   |> cache.push([graphql, #]) && #;
// }

export class Query {

  data = {};
  loading = true;
  error = undefined;

  constructor(client, forceUpdate, graphql, onError, onComplete, skip = false) {
    this.client = client;
    this.forceUpdate = forceUpdate;
    this.graphql = graphql;
    // this.args = findInCache(graphql) ||
    //   extractArgs(graphql)
    //   |> cache.push([graphql, #]) && #;
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