import React, { Component } from "react";
import { createUploadLink } from "apollo-upload-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { withClientState } from "apollo-link-state";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { ApolloProvider } from "react-apollo";
import { API_URL, defaults, resolvers } from "./resolver";
import Header from "./components/Header";
import Charts from "./components/Charts";

const httpLink = createUploadLink({
  uri: API_URL
});

// const authLink = setContext((_, { headers }) => {
//   const token = localStorage.getItem("token@ratelink");
//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `JWT ${token}` : null
//     }
//   };
// });

const cache = new InMemoryCache();

const stateLink = withClientState({
  defaults,
  resolvers
});

const client = new ApolloClient({
  cache,
  link: ApolloLink.from([
    stateLink,
    // authLink,
    httpLink
  ])
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Header />
        <Charts />
      </ApolloProvider>
    );
  }
}

export default App;
