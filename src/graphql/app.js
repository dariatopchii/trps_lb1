const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { schema, root } = require("./schema");
const { log } = require("../utils/logger");

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root
  })
);

module.exports = app;
