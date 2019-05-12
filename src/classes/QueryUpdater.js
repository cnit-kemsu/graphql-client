import { GraphqlClient } from './GraphqlClient';

export class QueryUpdater {

  data = {};
  errors = null;
  loading = true;
  requireUpdate = false;

  constructor(forceUpdate, query, onError, onComplete, skip = false) {
    this.forceUpdate = forceUpdate;
    this.query = query;
    this.onError = onError;
    this.onComplete = onComplete;
    this.skip = skip;

    this.addToSuspended = this.addToSuspended.bind(this);
    this.removeFromSuspended = this.removeFromSuspended.bind(this);
    this.handleSubscriptions = this.handleSubscriptions.bind(this);
  }

  addToSuspended() {
    if (this.skip) return;
    GraphqlClient.queries.push([this.query, this.variables]);
    this.loading = true;
    GraphqlClient.suspended++;
  }
  removeFromSuspended() {
    if (this.skip) return;
    GraphqlClient.suspended--;
  }

  setState({ data, loading, errors }) {
    if (data !== undefined && this.data !== data) {
      this.data = data;
      this.requireUpdate = true;
    }
    if (loading !== undefined && this.loading !== loading) {
      this.loading = loading;
      this.requireUpdate = true;
    }
    if (errors !== undefined && this.errors !== errors) {
      this.errors = errors;
      this.requireUpdate = true;
    }
  }

  test() {
    if (!this.requireUpdate) return false;
    this.requireUpdate = false;
    return true;
  }

  update() {
    if(this.test()) this.forceUpdate();
  }

  handleSubscriptions() {
    GraphqlClient.updaters.push(this);
    return () => {
      GraphqlClient.updaters.splice(this.client.updaters.indexOf(this), 1);
    };
  }

}