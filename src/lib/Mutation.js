import { GraphqlClient } from './GraphqlClient';
import { UIBlocker } from './UIBlocker';
import { buildQuery } from './buildQuery';
import { findArgTypes } from './findArgTypes';
import { convertValue } from './convertValue';

export class Mutation {

  constructor(query, { onError, onComplete, blockUI = true }) {
    this.mutation = 'mutation ' + buildQuery([[query]])[0];
    this.onError = onError;
    this.onComplete = onComplete;
    this.blockUI = blockUI;
    this.argTypes = findArgTypes(query);

    this.commit = this.commit.bind(this);
  }

  async commit(variables) {
    if (this.blockUI) UIBlocker.disable();

    const allVariables = {
      ...this.variables,
      ...variables
    };
    for (const name in this.argTypes) allVariables[name] = convertValue(allVariables[name], this.argTypes[name]);
    
    const { data, errors } = await GraphqlClient.fetch(this.mutation, allVariables);
    
    if (this.blockUI) UIBlocker.enable();

    if (errors == null) this.onComplete?.(data, allVariables);
    else {
      this.onError?.(errors);
      return errors;
    }
  }

}