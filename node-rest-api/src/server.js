// src/index.js
// Check if in development mode
const isDevelopment = process.env.NODE_ENV === 'development';
if (isDevelopment || !process.env.NODE_ENV) {
  require('dotenv').config();
}

const { initialize } = require('./config/database');
const app = require('./api/app');
const swagger = require('./docs/swagger');
const PORT = process.env.PORT || 3000;


// Init Swagger
swagger(app);
// Connect to database and Create admin user, must be replace it for Auth0 (add more security)
initialize();


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


