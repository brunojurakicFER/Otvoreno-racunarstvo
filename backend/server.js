const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
const json2csv = require('json2csv').parse
const Driver = require('./models/Driver')
const cors = require('cors')
const { Parser } = require("json2csv")
const fs = require('fs');

const mongoDB = 'mongodb://localhost:27017/F1_drivers'
app.use(express.json())

app.use(cors({
  origin: 'http://localhost:3000'
}));

mongoose.connect(mongoDB)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err))

const formatResponse = (req, res, next) => {
  res.formatResponse = (status, message, data) => {
    res.json({
      status: status,
      message: message,
      response: data
    });
  };
  next();
};

app.use(formatResponse);

// Middleware to validate ObjectId
const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).formatResponse('Bad Request', 'Driver with the provided ID doesn\'t exist', null);
  }
  next();
}

// Middleware to filter drivers
const filterDrivers = async (req, res, next) => {
  try {
    const { column, value } = req.query
    let query = {}

    if (value) {
      const searchRegex = { $regex: value, $options: 'i' }
      const parsedValue = parseInt(value)

      if (column) {
        if (['wins', 'podiums', 'poles', 'points', 'championships', 'races_done', 'current_team.founded_year', 'current_team.championships_won'].includes(column)) {
          query[column] = isNaN(parsedValue) ? 0 : parsedValue
        } else {
          query[column] = searchRegex
        }
      } else {
        query = {
          $or: [
            { name: searchRegex },
            { surname: searchRegex },
            { nationality: searchRegex },
            ...(isNaN(parsedValue) ? [] : [
              { wins: parsedValue },
              { podiums: parsedValue },
              { poles: parsedValue },
              { points: parsedValue },
              { championships: parsedValue },
              { races_done: parsedValue },
              { 'current_team.founded_year': parsedValue },
              { 'current_team.championships_won': parsedValue }
            ]),
            { status: searchRegex },
            { 'current_team.name': searchRegex },
            { 'current_team.country': searchRegex }
          ]
        }
      }
    }

    let drivers = await Driver.find(query).lean()

    // Modify the response data to include "N/A" for missing fields
    drivers = drivers.map(driver => ({
      ...driver,
      current_team: {
        ...driver.current_team,
        name: driver.current_team?.name || 'N/A',
        country: driver.current_team?.country || 'N/A',
        founded_year: driver.current_team?.founded_year || 'N/A',
        championships_won: driver.current_team?.championships_won || 'N/A'
      }
    }))

    res.locals.drivers = drivers;
    next();
  } catch (err) {
    res.formatResponse('Error', err.message, null);
  }
}

// funkcija za refresh db
const writeJsonFile = async (data) => {
  const jsonPath = path.join(__dirname, '../F1_drivers.json');
  await fs.promises.writeFile(jsonPath, JSON.stringify(data, null, 2));
};

const writeCsvFile = async (data) => {
  const csvPath = path.join(__dirname, '../F1_drivers.csv');
  const fields = [
    'name', 'surname', 'nationality', 'wins', 'podiums', 'poles', 
    'points', 'championships', 'races_done', 'status',
    'current_team.name', 'current_team.country', 
    'current_team.founded_year', 'current_team.championships_won'
  ];
  const csv = json2csv(data, { fields });
  await fs.promises.writeFile(csvPath, csv);
};

const formatDriverAsJsonLd = (driver) => {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "identifier": driver._id,
    "name": `${driver.name} ${driver.surname}`,
    "nationality": driver.nationality,
    "additionalProperty": [
      { "@type": "PropertyValue", "name": "wins", "value": driver.wins },
      { "@type": "PropertyValue", "name": "podiums", "value": driver.podiums },
      { "@type": "PropertyValue", "name": "poles", "value": driver.poles },
      { "@type": "PropertyValue", "name": "points", "value": driver.points },
      { "@type": "PropertyValue", "name": "championships", "value": driver.championships },
      { "@type": "PropertyValue", "name": "races_done", "value": driver.races_done },
      { "@type": "PropertyValue", "name": "status", "value": driver.status }
    ],
    "memberOf": {
      "@type": "SportsTeam",
      "name": driver.current_team.name,
      "location": { "@type": "Country", "name": driver.current_team.country },
      "foundingDate": driver.current_team.founded_year,
      "additionalProperty": [
        { "@type": "PropertyValue", "name": "championships_won", "value": driver.current_team.championships_won }
      ]
    }
  };
};

const formatDriversAsJsonLd = (req, res, next) => {
  if (res.locals.drivers) {
    res.locals.drivers = res.locals.drivers.map(formatDriverAsJsonLd);
  }
  next();
};

// get drivers json from file
app.get('/drivers/json', (req, res) => {
  const filePath = path.join(__dirname, '../F1_drivers.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.formatResponse('Error', 'An error occurred while reading the JSON file', null);
    }
    const drivers = JSON.parse(data);
    const jsonLdDrivers = drivers.map(formatDriverAsJsonLd);
    const jsonLdContent = JSON.stringify(jsonLdDrivers, null, 2);
    
    res.attachment('F1_drivers.json');
    res.send(jsonLdContent);
  });
});

// get drivers csv from file
app.get('/drivers/csv', (req, res) => {
  const filePath = path.join(__dirname, '../F1_drivers.csv')
  res.setHeader('Content-Disposition', 'attachment; filename=F1_drivers.csv')
  res.sendFile(filePath, (err) => {
    if (err) {
      res.formatResponse('Error', 'An error occurred while sending the CSV file', null);
    }
  })
})

// get filtered drivers json from db
app.get('/drivers/export/json', filterDrivers, formatDriversAsJsonLd, (req, res) => {
  res.setHeader('Content-Disposition', 'attachment; filename=filtered_drivers.json');
  res.json(res.locals.drivers);
})

// get filtered drivers csv from db
app.get('/drivers/export/csv', filterDrivers, async (req, res) => {
  const drivers = res.locals.drivers.map(driver => ({
    ...driver,
    current_team_name: driver.current_team.name,
    current_team_country: driver.current_team.country,
    current_team_founded_year: driver.current_team.founded_year,
    current_team_championships_won: driver.current_team.championships_won
  }))

  const fields = [
    '_id', 'name', 'surname', 'nationality', 'wins', 'podiums', 'poles', 'points', 'championships', 'races_done', 'status',
    'current_team.name', 'current_team.country', 'current_team.founded_year', 'current_team.championships_won'
  ]
  const opts = { fields }

  try {
    const csv = json2csv(drivers, opts)
    res.setHeader('Content-Disposition', 'attachment; filename=filtered_drivers.csv')
    res.set('Content-Type', 'text/csv')
    res.send(csv)
  } catch (err) {
    console.error('Error generating CSV:', err)
    res.status(500).json({ error: 'An error occurred while generating the CSV file' })
  }
})

// get all drivers from db
app.get('/drivers', filterDrivers, formatDriversAsJsonLd, (req, res) => {
  res.formatResponse('OK', 'Fetched drivers', res.locals.drivers);
});

// get all teams
app.get('/teams', async (req, res) => {
  try {
    let teams = await Driver.distinct('current_team.name');
    teams = teams.filter(team => team !== 'N/A');
    const jsonLdTeams = teams.map(team => ({
      "@context": "https://schema.org",
      "@type": "SportsTeam",
      "name": team
    }));
    res.formatResponse('OK', 'Fetched teams', jsonLdTeams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get drivers by nationality
app.get('/drivers/nationality/:nationality', async (req, res, next) => {
  try {
    const drivers = await Driver.find({ nationality: req.params.nationality }).lean();
    res.locals.drivers = drivers;
    next();
  } catch (err) {
    res.formatResponse('Error', err.message, null);
  }
}, formatDriversAsJsonLd, (req, res) => {
  res.formatResponse('OK', 'Fetched drivers by nationality', res.locals.drivers);
});

// get drivers by status
app.get('/drivers/status/:status', async (req, res, next) => {
  try {
    const drivers = await Driver.find({ status: req.params.status }).lean();
    res.locals.drivers = drivers;
    next();
  } catch (err) {
    res.formatResponse('Error', err.message, null);
  }
}, formatDriversAsJsonLd, (req, res) => {
  res.formatResponse('OK', 'Fetched drivers by status', res.locals.drivers);
});

// get a single driver by ID
app.get('/drivers/:id', validateObjectId, async (req, res, next) => {
  try {
    const driver = await Driver.findById(req.params.id).lean();
    if (!driver) {
      return res.formatResponse('Not Found', 'Driver with the provided ID doesn\'t exist', null);
    }
    res.locals.drivers = [driver];
    next();
  } catch (err) {
    res.formatResponse('Error', err.message, null);
  }
}, formatDriversAsJsonLd, (req, res) => {
  res.formatResponse('OK', 'Fetched driver', res.locals.drivers[0]);
});

// post for adding a new driver
app.post('/drivers', async (req, res) => {
  try {
    const newDriver = new Driver(req.body)
    const savedDriver = await newDriver.save()
    res.formatResponse('OK', 'Driver added', savedDriver);
  } catch (err) {
    res.formatResponse('Error', err.message, null);
  }
})

// put for updating an existing driver by ID
app.put('/drivers/:id', validateObjectId, async (req, res) => {
  try {
    const updatedDriver = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!updatedDriver) {
      res.formatResponse('Not Found', 'Driver with the provided ID doesn\'t exist', null);
    } else {
      res.formatResponse('OK', 'Driver updated', updatedDriver);
    }
  } catch (err) {
    res.formatResponse('Error', err.message, null);
  }
})

// delete a driver by ID
app.delete('/drivers/:id', validateObjectId, async (req, res) => {
  try {
    const deletedDriver = await Driver.findByIdAndDelete(req.params.id)
    if (!deletedDriver) {
      res.formatResponse('Not Found', 'Driver with the provided ID doesn\'t exist', null);
    } else {
      res.formatResponse('OK', 'Driver deleted', { message: 'Driver deleted successfully' });
    }
  } catch (err) {
    res.formatResponse('Error', err.message, null);
  }
})

// route za refresh
app.get('/refresh-data', async (req, res) => {
  try {
    const token = req.headers['user']
    if (!token) {
      throw Error('Unauthorized')
    }
    const drivers = await Driver.find().lean();
    
    const processedDrivers = drivers.map(driver => ({
      ...driver,
      current_team: {
        name: driver.current_team?.name || 'N/A',
        country: driver.current_team?.country || 'N/A',
        founded_year: driver.current_team?.founded_year || 'N/A',
        championships_won: driver.current_team?.championships_won || 'N/A'
      }
    }));

    await Promise.all([
      writeJsonFile(processedDrivers),
      writeCsvFile(processedDrivers)
    ]);

    res.formatResponse('OK', 'Data files refreshed successfully', null);
  } catch (err) {
    res.formatResponse('Error', 'Failed to refresh data files: ' + err.message, null);
  }
});

// OpenAPI json
app.get('/openapi.json', (req, res) => {
  const filePath = path.join(__dirname, '../openapi.json')
  res.sendFile(filePath);
});

// Handle unsupported HTTP methods for defined routes
app.all('/drivers*', (req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'POST' && req.method !== 'PUT' && req.method !== 'DELETE') {
    return res.status(501).formatResponse('Not Implemented', 'Method not implemented for requested resource', null);
  }
  next();
});

// Handle unimplemented routes
app.use((req, res) => {
  res.status(404).formatResponse('Not Found', 'The requested URL was not found on this server', null);
});

app.listen(10000, () => {
  console.log('server started on port 10000')
})