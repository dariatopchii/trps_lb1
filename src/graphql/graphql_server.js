const { log } = require("../utils/logger");
const app = require("./app");

const PORT = 5000;

app.listen(PORT, () => {
  log(`GraphQL server running on http://localhost:${PORT}/graphql`);
});
