const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { schema, root } = require("./schema");
const { log } = require("../utils/logger");

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true 
  })
);

const PORT = 5000;

app.listen(PORT, () => {
  log(`GraphQL server running on http://localhost:${PORT}/graphql`);
});
