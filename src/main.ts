import express from "express";
import bodyParser from "body-parser";
import fs from "node:fs";
import { Login } from "wilmaapi";

const Logger = (Data: string) => {
  console.log(`[${new Date().toString().split(" GMT")[0]}] ${Data}`);
};

const Main = () => {
  const app = express();
  const port = JSON.parse(fs.readFileSync("config.json").toString()).wilmahttp
    .port;

  app.use(bodyParser.urlencoded());

  app.get("/", (req: any, res: any) => {
    Logger(`New connection to "/" from ${req.ip}`);
    res.send("WilmaHTTP");
  });

  app.post("/login", (req: any, res: any) => {
    Logger(`New connection to "/login" from ${req.ip}`);
    Logger(
      `\n\tUsername: ${req.body.username}\n\tPassword: ${req.body.password}\n\tServer: ${req.body.server}`
    );

    if (
      req.body.username == undefined ||
      req.body.password == undefined ||
      req.body.server == undefined
    )
      res.status(400).send("FALSE");

    Login(req.body.username, req.body.password, req.body.server)
      .then((ress: any) => {
        if (!ress) {
          Logger("FALSE");
          res.status(401).send("FALSE");
        } else {
          Logger("TRUE");
          res.status(200).send("TRUE");
        }
      })
      .catch((ress: any) => {});
  });

  app.listen(port, () => {
    Logger(`WilmaHTTP listening on port ${port}`);
  });
};

Main();
