import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Finma from './Finma';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import * as Realm from 'realm-web';

const APP_ID = process.env.REACT_APP_REALMAPP;

async function main() {
  const app = new Realm.App({ id: APP_ID }); 
  const credentials = Realm.Credentials.anonymous(); // Or use another authentication method
  const user = await app.logIn(credentials);

  const client = new ApolloClient({
    link: new HttpLink({
      uri: `https://eu-central-1.aws.realm.mongodb.com/api/client/v2.0/app/${APP_ID}/graphql`,
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
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/finma" element={<Finma />} />
        </Routes>
      </Router>
      </ApolloProvider>
    </React.StrictMode>,
    document.getElementById('root')
  );
}

main().catch((err) => {
  console.error("Failed to initialize Apollo Client:", err);
});
