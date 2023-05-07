const winston = require("winston");
const Elasticsearch = require("winston-elasticsearch");
//const SocketIO = require("winston-socketio");
const morgan = require("morgan");

const GRAFANA_HOST = process.env.GRAFANA_HOST || "localhost";
// define the custom settings for each transport (Elasticsearch, Grafana, console)
const esOptions = {
  level: 'info',
  indexPrefix: 'logging-api',
  indexSuffixPattern: 'YYYY-MM-DD',
  clientOpts: {
    node: "http://localhost:9200",
    maxRetries: 5,
    requestTimeout: 10000,
    sniffOnStart: false,
    auth: { username: "elastic", password: "elastic.pass" },
  },
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
};

const grafanaOptions = {
  level: "info",
  host: GRAFANA_HOST,
  port: 3001,
  path: "/grafana/api/log",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
};

const consoleOptions = {
  level: "debug",
  json: true,
  format: winston.format.combine(
        winston.format.json()
  ),
};

/**
 * 
 * If your API is called behind an Nginx or any proxy, 
 * you may encounter issues with the remote_addr attribute 
 * since you will not get the original source IP, but your proxy’s one.
 * If the configuration of proxy allows that,
 *  can just use the request header X-Forwarded-For to access this information
 */
const morganJSONFormat = () => JSON.stringify({
  method: ':method',
  url: ':url',
  http_version: ':http-version',
  remote_addr: ':remote-addr',
  remote_addr_forwarded: ':req[x-forwarded-for]', //Get a specific header
  response_time: ':response-time',
  status: ':status',
  content_length: ':res[content-length]',
  timestamp: ':date[iso]',
  user_agent: ':user-agent',
});

/**
 * Gather all routes with the same path under a single one /api/<name>/:id for a monitoring purpose.
 * @param {*} data 
 * @returns 
 */
function sanitizeUrl(data) {
  if (!data.url) {
      return;
  }
  const regex = /\/[0-9]+/g; //Adapt to your context
  const urlWithoutParameter = data.url.replace(regex, '/:id');
  data.url_sanitized = urlWithoutParameter;
}


//Take a Look: https://www.promyze.com/access-logs-nodejs-winston-morgan-storage-elasticsearch/

// instantiate a new Winston Logger with the settings defined above
const logger = winston.createLogger({
  transports: [
    new Elasticsearch.ElasticsearchTransport(esOptions),
    new winston.transports.Http(grafanaOptions),
    //new SocketIO(grafanaOptions), //Not option available by default in  grafana/conf/defaults.ini 
    new winston.transports.Console(consoleOptions),
    //new winston.transports.File({ filename: 'error.log', level: 'error' }),
    //new winston.transports.File({ filename: 'combined.log' })
  ],
  exitOnError: false, // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function (message, encoding) {
    // use the 'info' log level so the output will be picked up by all transports
    const data = JSON.parse(message);
    sanitizeUrl(data);
    return logger.info(data);
  },
};

// create a Morgan middleware that logs request errors and response time
const morganMiddleware = morgan( morganJSONFormat(), {
  // log errors as "error" level use 400 number
  skip: function (req, res) {
    return res.statusCode < 200;
  },
  stream: logger.stream,
});

module.exports = { logger, morganMiddleware };