const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const coin = urlParams.get('coin');

var id = 'bitcoin';
var currType = 'price';
var currDays = '1';


// chart
google.charts.load('current', { 'packages': ['corechart'] });

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(function() {
    getCoin();
});

/**
 * Reloads the chart every time the window is resized so that the chart is responsive.
 */
window.addEventListener('resize', function(event) {
    reloadChart();
}, true);

function reloadChart() {
    getChart(id, currType, currDays);
}

const btnDark = document.getElementById('darkmode');
btnDark.addEventListener('click', () => {
    getChart(id, currType, currDays);
});

//#region RADIO BUTTON

const select1 = document.getElementById('group1');

select1.addEventListener('click', ({ target }) => { // handler fires on root container click
    if (target.getAttribute('name') === 'group1') { // check if user clicks right element
        currType = target.value;
        getChart(id, currType, currDays);
    }
});

const select2 = document.getElementById('group2');

select2.addEventListener('click', ({ target }) => { // handler fires on root container click
    if (target.getAttribute('name') === 'group2') { // check if user clicks right element
        currDays = target.value;
        getChart(id, currType, currDays);
    }
});

//#endregion

/**
 * Returns the searched coin.
 */
async function getCoin() {
    let responseSearch = await fetch(`https://api.coingecko.com/api/v3/search?query=${coin}`, {
        method: "GET"
    });
    let jsonSearch = await responseSearch.json();
    id = jsonSearch.coins[0].id;

    let responseCoin = await fetch(`https://api.coingecko.com/api/v3/coins/${jsonSearch.coins[0].id}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=flase&sparkline=false`, {
        method: "GET"
    });
    let jsonCoin = await responseCoin.json();

    const title = document.getElementById('coinTitle');
    const icon = document.getElementById('coinIcon');
    const description = document.getElementById('coinDescription');

    icon.src = jsonSearch.coins[0].large;
    title.textContent = jsonSearch.coins[0].name;

    // regex looks for <, an optional slash /, one or more characters that are not >, then either > or $ (the end of the line)
    let descriptionText = (jsonCoin.description.en).replace(/(<([^>]+)>)/ig, '');
    const descriptionArr = descriptionText.split('.');
    descriptionText = descriptionArr[0] + '.' + descriptionArr[1] + '.' + descriptionArr[2] + '...';

    description.innerText = descriptionText;

    getChart(jsonSearch.coins[0].id, 'price', 1);
}

async function getChart(id, type, days) {
    let responseChart = await fetch(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`, {
        method: "GET"
    });
    let jsonChart = await responseChart.json();

    drawChart('chart', (type == 'price') ? jsonChart.prices : jsonChart.market_caps);
}

/**
 * Callback that creates and populates a data table, instantiates the chart, passes in the data and draws it.
 * The drawn chart will be green if (firstPrice < lastPrice) otherwise it will be red.
 * @param {String} id Id of the HTML element in which to insert the chart.
 * @param {Array} arrayPrice Price array.
 */
function drawChart(id, arrayPrice) {

    var dark = document.body.classList.contains('dark-theme-variables');

    let dataChart = [
        ['Time', 'Price']
    ];
    for (let index = 0; index < arrayPrice.length; index++) {
        const date = new Date(arrayPrice[index][0]).toLocaleDateString();
        dataChart.push([date, arrayPrice[index][1]])
    }

    const firstPrice = dataChart[1][1];
    const lastPrice = dataChart[dataChart.length - 1][1];

    var data = google.visualization.arrayToDataTable(dataChart);

    var options = {
        colors: (firstPrice < lastPrice) ? ['#50afb2'] : ['#ab5780'],
        legend: 'none',
        vAxis: {
            textStyle: { color: (dark) ? '#edeffd' : '#363949' },
            gridlines: {
                color: 'transparent'
            },
            baselineColor: 'transparent'
        },
        hAxis: {
            textPosition: 'none',
            textStyle: { color: (dark) ? '#edeffd' : '#363949' },
            gridlines: {
                color: 'transparent'
            },
            baselineColor: 'transparent'
        },
        backgroundColor: { fill: 'transparent' }
    };

    var chart = new google.visualization.LineChart(document.getElementById(id));

    chart.draw(data, options);
}