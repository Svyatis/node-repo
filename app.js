'use strict';
// Load dependencies
const express = require('express');
const app = express();
// Import the required dependencies
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// We are going to implement a JWT middleware that will ensure the validity of our token. 
// We'll require each protected route to have a valid access_token sent in the Authorization header
const authCheck = jwt({
  secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://svyatis.auth0.com/.well-known/jwks.json"
    }),
    // This is the identifier we set when we created the API
    audience: 'http://localhost:3001',
    issuer: "svyatis.auth0.com", // e.g., you.auth0.com
    algorithms: ['RS256']
});

// Public route
app.get('/api/deals/public', (req, res)=>{
  let deals = [
    {
		id: 1234,
		name: 'Name of Product',
		description: 'Description of Product',
		originalPrice: 19.99, // Original price of product
		salePrice: 9.99 // Sale price of product
	}
  ];
  res.json(deals);
})

// Private route
app.get('/api/deals/private', authCheck, (req,res)=>{
  let deals = [
    {
		id: 4567,
		name: 'Name of Product',
		description: 'Description of Product',
		originalPrice: 19.99, // Original price of product
		salePrice: 9.99 // Sale price of product
	}
  ];
  res.json(deals);
})

app.listen(3001);
console.log('Serving deals on localhost:3001');