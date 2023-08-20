import * as fs from "fs";

const logError = (errMsg) => {
  const now = new Date();
  fs.appendFile("logs/errors.txt", `[${now.toISOString()}]: ${errMsg}\n`);
};

const logRequest = (req) => {
  const now = new Date();
  const nowStr = now.toISOString().split("T")[0];
  const fileName = `logs/${nowStr}.txt`;

  fs.readFile(fileName, "utf-8", (error) => {
    if (error) {
      fs.writeFile(fileName, "", (error) => {
        if (error) {
          logError(error);
        }
      });
    }
  });

  try {
    const data = JSON.stringify({
      originalUrl: req.originalUrl,
      query: req.query,
    });

    fs.appendFile(fileName, `[${now.toISOString()}]: ${data}\n`, (error) => {
      if (error) {
        logError(error);
      }
    });
  } catch (error) {
    logError(error);
  }
};

export { logError, logRequest };
