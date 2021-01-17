const express = require('express');
// tells server to use required port when necessary 
// or designated port otherwise (in this case 3001)
const PORT = process.env.PORT || 3001;
const app = express();
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');
const { animals } = require('./data/animals');
//require PATH and FILESYSTEM modules
const path = require('path');
const fs = require('fs');
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
// give HTTP easy access to front end assets
app.use(express.static('public'));
// import data from file
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);


// ====================================================
// LISTEN
// ====================================================
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});