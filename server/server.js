const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const newsApiKey = 'dfe6ae9c2b4940f8a669635a085a048f';

app.get('/api/news', async (req, res) => {
      const { country = 'in', category = 'general', page = 1, pageSize = 8 } = req.query;
      try {
            const response = await axios.get(`https://newsapi.org/v2/top-headlines`, {
                  params: {
                        country, category, apikey: newsApiKey, page, pageSize
                  }
            });
            res.json(response.data);
      }
      catch(error){
            console.error('Error fetching news: ', error);
            res.status(500).json({message : 'Error fetching news'});
      }
});

app.use(express.static(path.join(__dirname, '../build')));
app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../build', 'index.html'));
});
app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
})