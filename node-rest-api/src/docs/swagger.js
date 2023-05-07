const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node.js REST API Documentation',
      version: '1.0.0',
      description: 'Documentation for the Node.js REST API',
    },
    servers: [
      {
        url: 'http://localhost:3002',
        description: 'Development server',
      },
      {
        url: 'https://example.com',
        description: 'Production server',
      },
    ],
  },
  apis: ['./src/api/routes/*.js','./src/api/middleware/*.js', './src/domain/models/*.js'],
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};