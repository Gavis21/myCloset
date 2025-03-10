import express, { Express } from "express";
import dotenv from "dotenv";
import http from 'http';
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import authRoute from "./routes/auth.route";
import AuthRequest from './middlewares/auth';
import outfitsRoute from "./routes/outfits.route";
import usersRoute from "./routes/users.route";
import PostsRoute from "./routes/posts.route";


dotenv.config();

const init = (): Promise<Express> => {
  const promise = new Promise<Express>((resolve) => {
      // DB
    const db = mongoose.connection;
    db.once("open", () => console.info("Connected to DB!"));
    db.on("error", (error) => console.error(`Failed connection to Db - ${error}`));
    const connectionString = process.env.DB_CONNECTION_STRING;
    mongoose.connect(connectionString!).then(() => {
      const app: Express = express();
      const port = process.env.PORT || 3000;

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
            description:
              "MyCloset Backend",
          },
        },
        apis: [`${__dirname}/apiDoc.yml`],
      };
      console.log(`Wanted swagger location - ${__dirname}/apiDoc.yml`)
      const specs = swaggerJsDoc(options);
      
      // Routes
      app.use("/auth", authRoute);
      app.use("/outfits", AuthRequest, outfitsRoute);
      app.use("/users", AuthRequest, usersRoute);
      app.use("/posts", AuthRequest, PostsRoute);
      app.use("/swagger", swaggerUI.serve, swaggerUI.setup(specs));

      console.info(`Started listening on port ${port}`);
      resolve(app);
    
    });
  });

  return promise;
};

export default init;

if(process.env.NODE_ENV !== 'PRODUCTION'){
  init().then((app)=> http.createServer(app).listen(process.env.PORT));
} 