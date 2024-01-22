const axios = require('axios');
const fs = require('fs');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

require('dotenv').config();

//#region CHARTJS

const width = 100; //px
const height = 40; //px
const backgroundColour = ''; // Uses https://www.w3schools.com/tags/canvas_fillstyle.asp
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour });

const createImage = async(arrayData) => {

    const firstPrice = arrayData[0];
    const lastPrice = arrayData[arrayData.length - 1];

    const config = {
        type: 'line',
        data: {
            labels: Array.from(Array(arrayData.length).keys()),
            datasets: [{
                data: arrayData,
                backgroundColor: 'rgba(120, 120, 0, 0)',
                fill: false,
                borderColor: (firstPrice <= lastPrice) ? '#50afb2' : '#ab5780',
                borderWidth: 1,
                tension: 0,
            }]
        },
        options: {
            responsive: true,
            elements: {
                point: {
                    radius: 0
                }
            },
            scales: {
                x: {
                    display: false
                },
                y: {
                    display: false
                },
            },
            plugins: {
                legend: {
                    display: false,
                },
                title: {
                    display: false,
                    text: ''
                }
            }
        },
    };

    const dataUrl = await chartJSNodeCanvas.renderToDataURL(config); // converts chart to image
    return dataUrl;
};

const createChartImages = async() => {

    axios
        .get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true')
        .then(res => {

            for (let index = 0; index < res.data.length; index++) {

                const element = res.data[index];

                createImage(element.sparkline_in_7d.price).then(val => {

                    let base64Image = val.split(';base64,').pop();
                    fs.writeFile('./src/public/img/sparkline/spark' + (index + 1) + '.png', base64Image, { encoding: 'base64' }, function(err) {
                        console.log('Update spark' + (index + 1));
                    });

                }).catch(err => {
                    console.log(err);
                });
            }
        })
        .catch(error => {
            console.error(error);
        });
};

//#endregion

//#region NEWS
const updateNews = async() => {

    axios
        .get('https://cryptopanic.com/api/v1/posts/?auth_token=' + process.env.AUTH_TOKEN_PANIC + '&public=true&filter=hot&kind=news')
        .then(res => {
            let json = JSON.stringify(res.data);

            fs.writeFile('./src/public/json/news.json', json, 'utf8', function(err) {
                console.log('Update news');
            });
        })
        .catch(error => {
            console.error(error);
        });
};

//#endregion

module.exports = {
    createChartImages, //for exporting to another file
    updateNews
}