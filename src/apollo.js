import Vue from 'vue'
import VueApollo from 'vue-apollo'
import { HttpLink } from 'apollo-link-http';
import { ApolloLink, concat } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-boost'

const apiLink = new HttpLink({
  uri: 'https://graphql.2mui.cn/v1/graphql'
})
const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext({
    headers: {
      authorization: 'cklmp222a083pja4'
    }
  });
  return forward(operation);
})

// const apolloClient = new ApolloClient({
//   // 你需要在这里使用绝对路径
//   uri: 'https://graphql.2mui.cn/v1/graphql'
// });

const apolloClient = new ApolloClient({
  link: concat(authMiddleware, apiLink),
  cache: new InMemoryCache()
});

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})

Vue.use(VueApollo);
export default apolloProvider;
