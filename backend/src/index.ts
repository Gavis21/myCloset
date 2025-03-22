import express, { Express } from "express";
import dotenv from "dotenv";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import authRoute from "./routes/auth.route";
import AuthRequest from "./middlewares/auth";
import outfitsRoute from "./routes/outfits.route";
import usersRoute from "./routes/users.route";
import PostsRoute from "./routes/posts.route";
import FileRoute from "./routes/file.route";
import path from "path";
import https from 'https'
import { readFileSync } from "fs";

dotenv.config();

const init = (): Promise<Express> => {
  const promise = new Promise<Express>((resolve) => {
    // DB
    const db = mongoose.connection;
    db.once("open", () => console.info("Connected to DB!"));
    db.on("error", (error) =>
      console.error(`Failed connection to Db - ${error}`)
    );
    const connectionString = process.env.DB_CONNECTION_STRING;
    mongoose.connect(connectionString!).then(() => {
      const app: Express = express();

      // Middlewares
      app.use(cors());
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "*");
        res.header("Access-Control-Allow-Headers", "*");
        res.header("Access-Control-Allow-Credentials", "true");
        next();
      });

      // Swagger
      const options = {
        definition: {
          openapi: "3.0.0",
          info: {
            title: "MyCloset backend",
            version: "1.0.0",
            description: "MyCloset Backend",
          },
        },
        apis: [`${__dirname}/apiDoc.yml`],
      };
      console.log(`Wanted swagger location - ${__dirname}/apiDoc.yml`);
      const specs = swaggerJsDoc(options);

      // Routes
      app.use("/auth", authRoute);
      app.use("/outfits", AuthRequest, outfitsRoute);
      app.use("/users", AuthRequest, usersRoute);
      app.use("/posts", AuthRequest, PostsRoute);
      app.use("/file", FileRoute);
      app.use("/public", express.static("public"));
      app.use("/swagger", swaggerUI.serve, swaggerUI.setup(specs));

      app.use(
        "/assets",
        express.static(
          path.resolve(__dirname, "..", "..", "..", "front/dist/assets")
        )
      );

      app.get("/", (req, res) =>
        res.sendFile(
          path.resolve(__dirname, "..", "..", "..", "front/dist", "index.html")
        )
      );

      resolve(app);
    });
  });

  return promise;
};

export default init;

init().then((app) => {
  if (process.env.NODE_ENV !== "PRODUCTION") {
    const port = process.env.PORT
    console.info(`Started listening on port ${port}`);
    http.createServer(app).listen(port);
  } else {
    const port = process.env.HTTPS_PORT

    const options = {
      key: readFileSync(path.resolve(__dirname, "../cert/client-key.pem")),
      cert: readFileSync(path.resolve(__dirname, "../cert/client-cert.pem")),
    };

    console.info(`Started listening on port ${port}`);
    https.createServer(options, app).listen(port);
  }
});
