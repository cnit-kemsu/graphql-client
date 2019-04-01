import React from 'react';

export const GraphqlContext = React.createContext();

export function GraphqlProvider({ client, children }) {
  return (
    <GraphqlContext.Provider value={client}>
      {children}
    </GraphqlContext.Provider>
  );
}