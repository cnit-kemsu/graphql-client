import React from 'react';
import { Router } from "./Router";

const nonUndefined = value => value !== undefined;

function match(pathname) {
  const route = pathname.split('/');

  const endless = route[route.length - 1] === '*';
  if (!endless && route.length !== Router.currentRoute.length) return undefined;
  if (endless && route.length > Router.currentRoute.length + 1) return undefined;

  const props = { match: '' };
  for (const [index, entry] of Object.entries(route)) {

    if (entry === '*') break;
    const routerEntry = Router.currentRoute[index];
    if (entry[0] === ':') props[entry.substr(1)] = routerEntry;
    else if (entry !== routerEntry) return undefined;
    props.match += '/' + routerEntry;
  }
  return props;
}

function handleRoute([path, component], index) {
  return match(path)
  |> # && React.createElement(component, {
    key: 'route-' + index,
    ...#
  });
}

export class Routing {

  constructor(forceUpdate) {
    this.forceUpdate = forceUpdate;

    this.handleChange = this.handleChange.bind(this);
    this.unsubscribeFromEvents = this.unsubscribeFromEvents.bind(this);
    this.handleSubscriptions = this.handleSubscriptions.bind(this);
  }

  static Route(routes) {
    return Object.entries(
      typeof routes === 'function' ? routes() : routes
    ).map(handleRoute)
    .filter(nonUndefined);
  }

  handleChange() {
    this.forceUpdate();
  }

  subscribeToEvents() {
    this.changeSub = Router.changeEvent.subscribe(this.handleChange);
  }

  unsubscribeFromEvents() {
    this.changeSub.unsubscribe();
  }

  handleSubscriptions() {
    this.subscribeToEvents();
    return this.unsubscribeFromEvents;
  }
}