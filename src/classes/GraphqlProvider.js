import React from 'react';

export const GraphqlContext = React.createContext();

export function GraphqlProvider({ client, children }) {
  return (
    <GraphqlContext value={client}>
      {children}
    </GraphqlContext>
  );
}