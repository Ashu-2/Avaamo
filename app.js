/**
 * Dependencies
 */

const express = require('express');

const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const dotenv = require('dotenv');
const expressValidator = require('express-validator')
const api = require('./routes/api');

/**
 * Initialize Express
 */

const app = express();
/**
 * Env
 */
dotenv.config({ path: '.env' });

/**
 * port
 */
app.set('port', process.env.PORT || 8080);
/**
 * Configuaration
 */
app.use(require('express-status-monitor')());
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Routes handler
 */
app.use('/api', api)
/**
 * Error Handler.
 */
if (process.env.NODE_ENV === 'development') {
    app.use(errorHandler());
  } else {
    app.use((err, req, res, next) => {
      console.error(err);
      res.status(500).send('Server Error');
    });
  }
  
  /**
   * Server
   */
  app.listen(app.get('port'), () => {
    console.log('%s Magic occurs at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
    console.log('look at the keyboard, press CTRL-C to stop\n');
  });
  
  module.exports = app;
  
