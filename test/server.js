import express from 'express';
import graphqlHTTP from 'express-graphql';
import sqlite from 'sqlite';
import schema from './schema';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import config from '../webpack.config';
import webpackHotMiddleware from 'webpack-hot-middleware';

import https from 'https';
import fs from 'fs';
import path from 'path';

import multer from 'multer';
const upload = multer();

const app = express();

const compiler = webpack(config);
webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  // watchOptions: {
  //   aggregateTimeout: 300,
  //   poll: true
  // }
}) |> app.use;
webpackHotMiddleware(compiler, {
  //heartbeat: 1000
}) |> app.use;

app.use(
  '/graphql',
  upload.none(),
  graphqlHTTP(async () => {
      const db = await sqlite.open('./test/localdb');
      return {
          schema,
          context: {
            db
          },
          extensions() {
            if (db !== undefined) db.close();
          },
          graphiql: true
      };
  })
);

app.listen(3000);

// const server = https.createServer({
//   key: fs.readFileSync(
//     path.resolve(__dirname, 'key.txt')
//   ),
//   cert: fs.readFileSync(
//     path.resolve(__dirname, 'crt.txt')
//   )
// }, app);

// server.listen(3000);