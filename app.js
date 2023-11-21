const express = require('express');
const path = require('path');
const stocks = require('./stocks');

const app = express();
app.use(express.static(path.join(__dirname, 'static')));

/* Added error handling */

app.get('/stocks', async (req, res) => {
  try {
    const stockSymbols = await stocks.getStocks();
    res.send({ stockSymbols });
  } catch (err) {
    console.log(`Couldn't find Stock Symbols:\n ${err}`);
  }
});

app.get('/stocks/:symbol', async (req, res) => {
  try {
    const { params: { symbol } } = req;
    const data = await stocks.getStockPoints(symbol, new Date());
    res.send(data);
  } catch (err) {
    console.log(`Error within Stock Symbol Points:\n ${err}`);
    // res.status(500).send({ error: 'Internal Server Error during retrieval '});
  }
});

app.listen(3000, () => console.log('Server is running!'));
