const { log } = require("../utils/logger");
const app = require("./app");

const PORT = 3000;

app.listen(PORT, () => {
  log(`REST Tasks server running on http://localhost:${PORT}`);
});
