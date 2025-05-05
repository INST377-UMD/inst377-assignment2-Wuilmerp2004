const form = document.getElementById('stockForm');
const chartCanvas = document.getElementById('myChart').getContext('2d');
let chartInstance = null;

// ✅ 1. Define the function so it can be reused
async function fetchStockChart(ticker, range) {
  const toDate = new Date();
  const fromDate = new Date();
  fromDate.setDate(toDate.getDate() - range);

  const from = fromDate.toISOString().split('T')[0];
  const to = toDate.toISOString().split('T')[0];

  const apiKey = 'YMtuMGxKt8lyb9l0iueiyGkooKDuUUPX';
  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}?adjusted=true&sort=asc&limit=50&apiKey=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      alert("No data available or invalid stock symbol.");
      return;
    }

    const labels = data.results.map(point => new Date(point.t).toLocaleDateString());
    const prices = data.results.map(point => point.c);

    if(chartInstance) {
      chartInstance.destroy();
    }

    chartInstance = new Chart(chartCanvas, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: `${ticker} Closing Price (${range} days)`,
          data: prices,
          borderColor: 'blue',
          borderWidth: 1,
          fill: false
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: false
          }
        }
      }
    });

  } catch (err) {
    console.error("Error fetching or displaying data:", err);
    alert("Something went wrong. Please check the console.");
  }
}

// ✅ 2. Update the form submit to use the function
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const ticker = document.getElementById('ticker').value.toUpperCase();
  const range = parseInt(document.getElementById('range').value);

  fetchStockChart(ticker, range);
});

// ✅ 3. Your Reddit API logic remains unchanged
fetch("https://tradestie.com/api/v1/apps/reddit?date=2022-04-03").then((data) => {
  return data.json();
}).then((objectData) => {
  const top5 = objectData
    .sort((a, b) => b.no_of_comments - a.no_of_comments)
    .slice(0, 5);

  let tableData = "";
  top5.map((values) => {
    const tickerLink = `<a href="https://finance.yahoo.com/quote/${values.ticker}/" target="_blank">${values.ticker}</a>`;
    let sentimentIcon = "";

    if (values.sentiment === "Bullish") {
      sentimentIcon = '<img src=https://img.etimg.com/thumb/msid-101444663,width-640,resizemode-4/markets/stocks/news/golden-crossovers-these-6-stocks-signal-further-bullishness/bullish-signs.jpg width="80">';
    } else if (values.sentiment === "Bearish") {
      sentimentIcon = '<img src=https://cdn.corporatefinanceinstitute.com/assets/bear-market.jpeg width="80">';
    }

    tableData += `<tr>
      <td>${tickerLink}</td>
      <td>${values.no_of_comments}</td>
      <td>${sentimentIcon}</td>
    </tr>`;
  });
  document.getElementById("table_body").innerHTML = tableData;
});
if (annyang) {
  const ValidColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'white'];
  const ValidPages = ['home', 'stocks', 'dogs'];

  const commands = {
    'hello': () => {
      alert('Hello how are you?');
    },
    'Change the color to :color': (color) => {
      color = color.toLowerCase();
      if (ValidColors.includes(color)) {
        document.body.style.backgroundColor = color;
      } else {
        alert('Invalid color. Please choose from: ' + ValidColors.join(', '));
      }
    },
    'Navigate to *page': (page) => {
      page = page.toLowerCase();
      if (ValidPages.includes(page)) {
        window.location.href = page + '.html';
      } else {
        alert('Invalid page. Please choose from: ' + ValidPages.join(', '));
      }
    },
    'Lookup *stock': (stock) => {
      const stockSymbol = stock.toUpperCase().trim();
      document.getElementById('ticker').value = stockSymbol;
      const range = parseInt(document.getElementById('range').value) || 30;
      fetchStockChart(stockSymbol, range);
    }
  };

  annyang.addCommands(commands);

  document.getElementById('start-record-btn').addEventListener('click', () => {
    annyang.start();
    console.log('Microphone is on');
  });

  document.getElementById('stop-record-btn').addEventListener('click', () => {
    annyang.abort();
    console.log('Microphone is off');
  });
}