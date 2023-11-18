const logger = require('morgan');
const chalk = require('chalk');

logger.format('FORMAT_MAIN', function (tokens, req, res) {
    const Now = new Date().toISOString();
    const date = Now.substring(11,19);
    return [
      chalk.gray(date),
      ...((req.headers['x-forwarded-for']) ? [chalk.green(req.headers['x-forwarded-for'])] : [chalk.green(req.ip)]),
      chalk.yellow(req.method),
      chalk.cyan(req.url),
      ...((res.statusCode) ? [chalk.red(res.statusCode)] : [""]),
      ...((req.headers['x-forwarded-proto']) ? [req.headers['x-forwarded-proto']] : [""]),
      ...((req.headers['x-forwarded-port']) ? [req.headers['x-forwarded-port']] : [""]),
      ...((req.headers['x-real-ip']) ? [req.headers['x-real-ip']] : [""]),
      '-',
      chalk.magenta(tokens['response-time'](req, res)), 'ms' // Color response time in magenta
    ].join(' ');
  });


module.exports = logger;
