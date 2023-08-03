import express from 'express';

import * as loaderExpress from './loaders/express.js';


async function startExpressServer() {
    const app = express();
  
    await loaderExpress.init(app);
  
    return app.listen(9031, err => {
        console.log(`[ + ] The server is running.`);
    });
}
  
let server = await startExpressServer();
export { server }