// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require('cors');

// const app = express();

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // MongoDB Connection
// const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/ESP32';
// mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('MongoDB connection error:', err));

// // Data Schema
// const dataSchema = new mongoose.Schema({
//   temperature: { type: Number, required: true },
//   humidity: { type: Number, required: true },
//   timestamp: { type: Date, default: Date.now }
// });


// // API to save data


// app.post('/api/data', async (req, res) => {
//   const newData = new Data(req.body);
//   try {
//     await newData.save();
//     res.status(201).send('Data saved');
//   } catch (err) {
//     console.error('Error saving data:', err);
//     res.status(500).send('Error saving data');
//   }
// });

// // API to fetch data
// app.get('/api/data', async (req, res) => {
//   try {
//     const data = await Data.find().sort({ timestamp: -1 }).limit(10);
//     res.json(data);
//   } catch (err) {
//     console.error('Error fetching data:', err);
//     res.status(500).send('Error fetching data');
//   }
// });

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// // เชื่อมต่อกับ MongoDB
// mongoose.connect('mongodb://localhost:27017/your_database', { useNewUrlParser: true, useUnifiedTopology: true });

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/ESP32';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const moistureSchema = new mongoose.Schema({
    moisture: Number,
    timestamp: { type: Date, default: Date.now }
});

const Moisture = mongoose.model('Moisture', moistureSchema);

app.post('/api/data', (req, res) => {
    const moistureData = new Moisture({ moisture: req.body.moisture });
    moistureData.save()
        .then(() => res.status(201).send('Data saved'))
        .catch(err => res.status(500).send(err));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
