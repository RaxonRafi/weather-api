const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
const port = 3000;

app.use(express.json());

const apiKey = '9656ac2b5b4db43ca89f11f8c1ce052e';


app.post('/getWeather', async (req, res) => {
  try {
    const { cities } = req.body;

    if (!cities || !Array.isArray(cities)) {
      return res.status(400).json({ error: 'Invalid input. Please provide an array of cities.' });
    }

    const weatherResults = await Promise.all(
      cities.map(async (city) => {
        try {
          const response = await axios.get(
            `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    
          );

          const temperature = response.data.main.temp;
          const formattedTemperature = `${temperature}°C`;

          return { [city]: formattedTemperature };
        } catch (error) {
          console.error(`Error fetching weather for ${city}:`, error.message);
          return { [city]: 'N/A' };
        }
      })
    );

    const weather = weatherResults.reduce((acc, result) => ({ ...acc, ...result }), {});
    res.json({ weather });
  } catch (error) {
    console.error('Error processing request:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
