import { GraphqlClient } from './GraphqlClient';

export class QueryUpdater {

  data = {};
  errors = undefined;
  loading = true; // TODO:
  requireUpdate = false;

  constructor(forceUpdate, query, onError, onComplete, skip) {
    this.forceUpdate = forceUpdate;
    this.query = query;
    this.onError = onError;
    this.onComplete = onComplete;
    this.skip = skip;

    this.addToSuspended = this.addToSuspended.bind(this);
    this.removeFromSuspended = this.removeFromSuspended.bind(this);
    this.removeFromUpdaters = this.removeFromUpdaters.bind(this);
    this.handleSubscriptions = this.handleSubscriptions.bind(this);
  }

  addToSuspended() {
    if (this.skip) return;
    GraphqlClient.entries.push([this.query, this.variables]);
    this.loading = true;
    GraphqlClient.suspendedQueue++;
  }

  removeFromSuspended() {
    if (this.skip) return;
    GraphqlClient.suspendedQueue--;
  }

  makeLoading() {
    this.loading = true;
    this.requireUpdate = true;
  }

  makeComplete({ data, errors }) {
    this.loading = false;

    for (const key in this.data) delete this.data[key];
    for (const key in data) this.data[key] = data[key];
    
    this.errors = errors;
    this.requireUpdate = true;
    if (errors == null) this.onComplete?.(data);
    else this.onError?.(errors);
  }

  test() {
    if (!this.requireUpdate) return false;
    this.requireUpdate = false;
    return true;
  }
  update() {
    if(this.test()) this.forceUpdate();
  }

  removeFromUpdaters() {
    GraphqlClient.updaters.indexOf(this)
    |> GraphqlClient.updaters.splice(#, 1);
  }
  handleSubscriptions() {
    GraphqlClient.updaters.push(this);
    return this.removeFromUpdaters;
  }

}