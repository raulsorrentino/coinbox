// chart
google.charts.load('current', { 'packages': ['corechart'] });

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(function() {
    getChart();
});

/**
 * Reloads the chart every time the window is resized so that the chart is responsive.
 */
window.addEventListener('resize', function(event) {
    reloadChart();
}, true);

function reloadChart() {
    getChart();
}

const btnDark = document.getElementById('darkmode');
btnDark.addEventListener('click', () => {
    getChart();
});

async function getChart() {
    let responseUser = await fetch('\me', {
        method: "GET"
    });
    let jsonUser = await responseUser.json();
    wallet = jsonUser.wallet;

    drawChart('chart', wallet);
}

/**
 * Callback that creates and populates a data table, instantiates the chart, passes in the data and draws it.
 * The drawn chart will be green if (firstPrice < lastPrice) otherwise it will be red.
 * @param {String} id Id of the HTML element in which to insert the chart.
 * @param {*} arrayWallet 
 */
function drawChart(id, arrayWallet) {

    var dark = document.body.classList.contains('dark-theme-variables');

    let dataChart = [
        ['Coin', 'Quantity']
    ];

    for (var k in arrayWallet) {

        if (arrayWallet.hasOwnProperty(k)) {
            dataChart.push([k, arrayWallet[k]]);
        }
    }
    var data = google.visualization.arrayToDataTable(dataChart);


    var options = {
        height: 350,
        chartArea: {
            top: 5,
            bottom: 5,
            width: '100%',
            height: '100%'
        },
        pieHole: 0.4,
        fontSize: 20,
        legend: 'none',
        backgroundColor: { fill: 'transparent' },
        pieSliceBorderColor: { color: 'white' },
        pieSliceText: 'label',
        pieSliceTextStyle: { color: 'white' },
        slices: {
            0: { color: '2E0249' },
            1: { color: '570A57' },
            2: { color: 'A91079' },
            3: { color: 'F806CC' },
            4: { color: 'F806CC' },
            5: { color: 'F806CC' }
        }
    };

    var chart = new google.visualization.PieChart(document.getElementById(id));

    chart.draw(data, options);
}