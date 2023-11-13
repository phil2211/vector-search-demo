import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client';
import * as Realm from 'realm-web';

async function main() {
  const app = new Realm.App({ id: "openai-nbsjr" }); // Replace with your Realm app ID
  const credentials = Realm.Credentials.anonymous(); // Or use another authentication method
  const user = await app.logIn(credentials);

  const client = new ApolloClient({
    link: new HttpLink({
      uri: 'https://eu-central-1.aws.realm.mongodb.com/api/client/v2.0/app/openai-nbsjr/graphql', // Replace with your Realm GraphQL endpoint
      fetch: async (uri, options) => {
        if (!options.headers) {
          options.headers = {};
        }
        options.headers.Authorization = `Bearer ${user.accessToken}`;
        return fetch(uri, options);
      },
    }),
    cache: new InMemoryCache(),
  });

  ReactDOM.render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </React.StrictMode>,
    document.getElementById('root')
  );
}

main().catch((err) => {
  console.error("Failed to initialize Apollo Client:", err);
});
