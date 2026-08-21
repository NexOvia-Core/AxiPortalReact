// import express from "express";
// import path from "node:path";
// import { fileURLToPath } from "node:url";

// const currentDir = path.dirname(fileURLToPath(import.meta.url));
// const publicDir = path.resolve(currentDir, "../public");

// const app = express();

// app.use(express.static(publicDir));

// app.get("*", (_request, response) => {
//   response.sendFile(path.join(publicDir, "index.html"));
// });

// const port = Number.parseInt(process.env.PORT || "8000", 10);
// app.listen(port, () => {
//   console.log(`Axi website server listening on http://localhost:${port}`);
// });
