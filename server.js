const express = require('express');
// tells server to use required port when necessary 
// or designated port otherwise (in this case 3001)
const PORT = process.env.PORT || 3001;
const app = express();
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
// give HTTP easy access to front end assets
app.use(express.static('public'));
// import data from file
const { animals } = require('./data/animals');
//require PATH and FILESYSTEM modules
const path = require('path');
const fs = require('fs');

// query -- can return multiple data objects
function filterByQuery(query, animalsArray) {
    let filteredResults = animalsArray;
    if (query.personailtyTraits) {
        //save personality traits as a dedicated array
        //if personality traits is string, place it into a new array and save
        if (typeof query.personailtyTraits === 'string') {
            personailtyTraitsArray = [query.personailtyTraits];
            //console.log(personailtyTraitsArray);
        } else {
            personailtyTraitsArray = query.personailtyTraits;
            console.log(personailtyTraitsArray);
        }
        //loop through each trait in the personality traits array
        personailtyTraitsArray.forEach(trait => {
            // Check the trait against each animal in the filteredResults array.
            // Remember, it is initially a copy of the animalsArray,
            // but here we're updating it for each trait in the .forEach() loop.
            // For each trait being targeted by the filter, the filteredResults
            // array will then contain only the entries that contain the trait,
            // so at the end we'll have an array of animals that have every one 
            // of the traits when the .forEach() loop is finished.
            filteredResults = filteredResults.filter(
                animal => animal.personailtyTraits.indexOf(trait) !== -1
            );
        });
     }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults
};
// param -- finds a single data object
function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
};

// function to create a new animal and write it to our JSON data file
function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);
    // use FS module to wrie new animal to JSON file
    fs.writeFileSync(
        path.join(__dirname, '/data/animals.json'),
        JSON.stringify({ animals : animalsArray }, null, 2)
    )

    // return finished code to post route for response
    return animal;
}

// function to validate data
function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if (!animal.personailtyTraits || !Array.isArray(animal.personailtyTraits)) {
        return false;
    }
    return true;
}

app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

app.post('/api/animals', (req, res) => {
    //req.body is where our incoming content will be
    req.body.id = animals.length.toString();

    // if any data in req.body is incorrect, sned 400 error back
    if(!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.');
    } else {

        // add animal to JSON file and animals array in this function
        const animal = createNewAnimal(req.body, animals);
        res.json(animal);
    }
});

// root route 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
  });
// ====================================================
// LISTEN
// ====================================================
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});