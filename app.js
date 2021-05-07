// load the things we need
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const rootDir = require('./Utilities/path')

app.use(bodyParser.urlencoded({ extended: false }));

// set the view engine to ejs
app.set('view engine', 'ejs');
const siteRoutes = require('./routes/site');
app.use(siteRoutes)




app.listen(8080);
console.log('app sur le port 8080');