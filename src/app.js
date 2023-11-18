const express = require('express')
const morgan = require('morgan')
const app = express()
const compression = require('compression')
const cookieParser = require('cookie-parser')
const configs = require('./configs/config')



// init middlewares
app.use(morgan('dev'));
// app.use(morgan('compile'));
// app.use(morgan('common'));
// app.use(morgan('short'));
// app.use(morgan('tiny'));

// setting security helmet
const helmet = require('helmet');
const { checkEnable } = require("./utils");
// setting base
app.use(helmet.frameguard({
  action: 'deny'
}));
// strict transport security
const reqDuration = 2629746000;
app.use(
  helmet.hsts({
    maxAge: reqDuration,
  })
);

// content security policy
app.use(helmet.contentSecurityPolicy({
  directives: {
    scriptSrc: ["'self'"],
    styleSrc: ["'self'"],
  },
}))

// x content type options
app.use(helmet.noSniff());
// x xss protection
app.use(helmet.xssFilter())
// referrer policy
app.use(helmet.referrerPolicy({
  policy: "no-referrer",
}))


// downsize response
app.use(compression({
  level: 6,// level compress
  threshold: 100 * 1024, // > 100kb threshold to compress
  filter: (req) => {
    return !req.headers['x-no-compress'];
  }
}));

// setting body parser, cookie parser
app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({extended: true, limit: '10kb'}));
app.use(cookieParser());

// init db
if (checkEnable(configs.db.enable)) {
  require('./configs/config.mongose');
  const {checkOverload} = require('./helpers/check.connect');
  checkOverload();
}

// export
module.exports = app;
