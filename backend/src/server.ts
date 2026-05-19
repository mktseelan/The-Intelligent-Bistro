import { env } from "./config/env.js";
import { app } from "./app.js";

app.listen(env.PORT, () => {
  console.log(`Intelligent Bistro backend listening on port ${env.PORT}`);
});
