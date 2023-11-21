// Get Elements
const canvas = document.getElementById('chart');
const ctx = canvas.getContext('2d');
const ticker = document.querySelector('#ticker');

// Hide the spinner

function initToggle() {
  toggleSpinner();
  toggleCanvas();
}

function toggleSpinner() {
  const spinner = document.querySelector('.spinner');
  spinner.style.display = 'none';
}

function toggleCanvas() {
  canvas.style.display = 'inline-block';
}

// Query the avaliable stocks

async function getStock() {
  await fetch('/stocks')
    .then(res => res.json())
    .then(data => {
      console.log(JSON.stringify(data));
    }).catch(err => { // Error Handling not necessarily required here
      console.log(`Error occured during Fetch of Stock Symbols:\n${err}`);
    });
}

// Query the values & timestamps of 'said' stock

async function getStockPoint(symbol) {
  await fetch(`/stocks/${symbol}`)
    .then(res => res.json())
    .then(data => {
      const stockDate = data.map(i => {
        const date = new Date(i.timestamp);
        const stockDate = date.toLocaleString();
        return { stockDate, value: i.value };
      });
      console.log(`Stock Data: ${JSON.stringify(stockDate)}`);
      initToggle();
      drawLineChart(stockDate);
      ticker.textContent = `$${symbol}`;
    }).catch(err => { // Error Handling incase of in-valid stock.
      console.log(`Error occured during Fetch of Stock Points:\n${err}`);
      // location.reload(); // Possibly add another way to handle.
    });
}

function drawLineChart(obj) {
  let vals = obj.map(i => i.value); // get values of the stock
  let dates = obj.map(i => i.stockDate); // get stock dates
  // format with the lines drawn 
  let chartHeight = canvas.height - 125; 
  let chartWidth = canvas.width - 100;
  // range of the values
  let max = Math.max(...vals); // find the smallest 
  let min = Math.min(...vals); // find the largest
  let range = max - min; // get the range of the values

  ctx.beginPath();
  ctx.strokeStyle = 'green';

  for (let i = 0; i < vals.length; i++) {
    let x = (i / (vals.length - 1)) * chartWidth + 50;
    let y = chartHeight - ((vals[i] - min) / range) * chartHeight + 50;

      ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Timestamps

  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  for (let i = 0; i < dates.length; i++) {
    let x = (i / (vals.length - 1)) * chartWidth + 50;
    let y = chartHeight + 100;
    ctx.fillText(dates[i], x, y);
  }
}

function drawLine (start, end, style) {
  ctx.beginPath()
  ctx.strokeStyle = style || 'black'
  ctx.moveTo(...start)
  ctx.lineTo(...end)
  ctx.stroke()
}

function drawTriangle (apex1, apex2, apex3) {
  ctx.beginPath()
  ctx.moveTo(...apex1)
  ctx.lineTo(...apex2)
  ctx.lineTo(...apex3)
  ctx.fill()
}

// Call functions

// getStock();
getStockPoint('FB');

drawLine([50, 50], [50, 550]);
drawTriangle([35, 50], [65, 50], [50, 35]);

drawLine([50, 550], [950, 550]);
drawTriangle([950, 535], [950, 565], [965, 550]);
