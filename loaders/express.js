import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import helmet from "helmet"
import { engine } from 'express-handlebars';


import apiRouter from '../dist/api.js';
import mainRouter from '../client/routes/main.js';

export async function init (app) {
    app.engine("hbs",
        engine({
            extname: "hbs",
            defaultLayout: false
        })
    );
    app.set('trust proxy', 1);
    app.set("view engine", "hbs");    
    app.set('views','./client/views');
    app.disable('x-powered-by');
    
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended : true}));
    app.use(cookieParser());
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                "default-src": [ "'self'"],
                "connect-src": ["localhost:*", "*.scrap.devent.kr", , "scrap.devent.kr", "192.168.0.62:*"],
                "script-src": ["'self'", "*.jsdelivr.net", '*.scrap.devent.kr', "'unsafe-inline'", "'unsafe-eval'"],
                'img-src': ["'self'", 'data:', 'blob:'],

            },
        },
    }));

    app.use((err, req, res, next) => {
       res.status(500).send({
            msg: "server error"
       })
    })

    app.use('/dist', express.static('client/dist'));

    app.use('/api', apiRouter);
    app.use('/', mainRouter);
    return app;
}
