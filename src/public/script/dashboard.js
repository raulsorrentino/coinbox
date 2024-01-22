//#region TOP100

const ImageLoaderWorker = new Worker('./script/image-loader.worker.js');

ImageLoaderWorker.addEventListener('message', event => {
    // Grab the message data from the event
    const imageData = event.data;

    // Get the original element for this image
    const imageElement = document.querySelector(`img[data-src='${imageData.imageURL}']`);

    // We can use the `Blob` as an image source! We just need to convert it
    // to an object URL first
    const objectURL = URL.createObjectURL(imageData.blob);
    imageElement.setAttribute('src', objectURL);

    // Let's remove the original `data-src` attribute to make sure we don't
    // accidentally pass this image to the worker again in the future
    imageElement.removeAttribute('data-src');
})

loadImage();

async function loadImage() {
    await getTop100();

    const imgElements = document.querySelectorAll('img[data-src]');

    // loop over the image elements and pass their URLs to the web worker
    imgElements.forEach(imageElement => {
        const imageURL = imageElement.getAttribute('data-src');
        ImageLoaderWorker.postMessage(imageURL);
    })
}

/**
 * Returns the top100 cryptos and inserts them into table.
 */
async function getTop100() {
    let response = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d", {
        method: "GET",
        credentials: "omit"
    });

    let jsonObj = await response.json();
    const tableRef = document.getElementById('top100');

    for (let index = 0; index < jsonObj.length; index++) {
        const element = jsonObj[index];
        createRowTop100(tableRef, element, index);
    }

}

var newCell;
var newText;

/**
 * Inserts the information of a crypto into a row of the top100 table.
 * @param {*} tableRef Reference to the top100 table.
 * @param {*} object Json object containing a crypto.
 * @param {*} index Element index .
 */
function createRowTop100(tableRef, object, index) {

    let newRow = tableRef.insertRow();
    if (index > 9) {
        newRow.classList.add('collapse');
        newRow.classList.add('collapse-top100');
    }

    // #
    newCell = newRow.insertCell();
    newText = document.createTextNode(index + 1);
    newCell.appendChild(newText);

    // Coin
    newCell = newRow.insertCell();
    newCell.classList.add('text-nowrap');
    let img = document.createElement('img');
    img.style.height = '20px';
    img.style.width = '20px';
    img.style.marginRight = '10px';
    img.src = object.image;
    newText = document.createTextNode(object.name);
    newCell.appendChild(img);
    newCell.appendChild(newText);

    // Price
    newCell = newRow.insertCell();
    newCell.classList.add('text-nowrap');
    newText = document.createTextNode((object.current_price) ? (object.current_price.toFixed(2) + ' $') : '?');
    newCell.appendChild(newText);

    // 1h
    newCell = newRow.insertCell();
    controlNullPercentage(object.price_change_percentage_1h_in_currency);
    newCell.appendChild(newText);

    // 24h
    newCell = newRow.insertCell();
    controlNullPercentage(object.price_change_percentage_24h_in_currency);
    newCell.appendChild(newText);

    // 7d
    newCell = newRow.insertCell();
    controlNullPercentage(object.price_change_percentage_7d_in_currency);
    newCell.appendChild(newText);

    // 24h volume
    newCell = newRow.insertCell();
    newCell.classList.add('text-nowrap');
    newText = document.createTextNode((object.total_volume) ? (numberWithCommas(object.total_volume) + ' $') : '?');
    newCell.appendChild(newText);

    // Market cap
    newCell = newRow.insertCell();
    newCell.classList.add('text-nowrap');
    newText = document.createTextNode((object.market_cap) ? (numberWithCommas(object.market_cap) + ' $') : '?');
    newCell.appendChild(newText);

    // Last 7 days (sparkline)
    newCell = newRow.insertCell();
    newCell.setAttribute("id", 'spark' + (index + 1));

    img = document.createElement('img');
    img.setAttribute('data-src', `http://${window.location.hostname}:3000/img/sparkline/spark` + (index + 1) + '.png');
    img.style.width = '100px';
    img.style.height = '40px';
    newCell.appendChild(img);
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function controlNullPercentage(value) {
    let change = (value) ? value.toFixed(2) : '?';

    if (change != '?') {
        ((change >= 0) ? newCell.style.color = '#50afb2' : newCell.style.color = '#ab5780');
        newText = document.createTextNode(change + '%');
    } else {
        newCell.style.color = '#ab5780';
        newText = document.createTextNode(change);
    }
}

function viewMore() {
    let viewMore = document.getElementById('view-more');
    if (viewMore.textContent == 'View more...') {
        viewMore.textContent = 'View less';
    } else {
        viewMore.textContent = 'View more...';
    }
}

//#endregion

//#region CATEGORIES

getMetaverse();
getExchange();
getPlayToEarn();

/**
 * Returns the metaverse cryptos and inserts them into table.
 */
async function getMetaverse() {
    let response = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=metaverse&order=volume_desc&per_page=5&page=1&sparkline=false&price_change_percentage=24h", {
        method: "GET",
    });

    let jsonObj = await response.json();
    const tableRef = document.getElementById('metaverse');

    for (let index = 0; index < 5; index++) {
        const element = jsonObj[index];
        createRow(tableRef, element, index);
    }
}

/**
 * Returns the play to earn cryptos and inserts them into table.
 */
async function getPlayToEarn() {
    let response = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=play-to-earn&order=volume_desc&per_page=5&page=1&sparkline=false&price_change_percentage=24h", {
        method: "GET"
    });

    let jsonObj = await response.json();
    const tableRef = document.getElementById('play-to-earn');

    for (let index = 0; index < 5; index++) {
        const element = jsonObj[index];
        createRow(tableRef, element, index);
    }
}

/**
 * Returns the cex cryptos and inserts them into table.
 */
async function getExchange() {
    let response = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=centralized-exchange-token-cex&order=volume_desc&per_page=5&page=1&sparkline=false&price_change_percentage=24h", {
        method: "GET"
    });

    let jsonObj = await response.json();
    const tableRef = document.getElementById('exchange');

    for (let index = 0; index < 5; index++) {
        const element = jsonObj[index];
        createRow(tableRef, element, index);
    }
}

/**
 * Inserts the information of a crypto into a row of the Play to earn table.
 * @param {*} tableRef Reference to the top100 table.
 * @param {*} object Json object containing a crypto.
 * @param {*} index Element index .
 */
function createRow(tableRef, object, index) {
    let newRow = tableRef.insertRow();

    // #
    newCell = newRow.insertCell();
    newText = document.createTextNode(index + 1);
    newCell.appendChild(newText);

    // Coin
    newCell = newRow.insertCell();
    newCell.classList.add('text-nowrap');
    let img = document.createElement('img');
    img.style.height = '20px';
    img.style.width = '20px';
    img.style.marginRight = '10px';
    img.src = object.image;
    newText = document.createTextNode(object.name);
    newCell.appendChild(img);
    newCell.appendChild(newText);

    // 24h
    newCell = newRow.insertCell();
    newCell.classList.add('text-nowrap');
    controlNullPercentage(object.price_change_percentage_24h);
    newCell.appendChild(newText);
}

//#endregion

//#region NEWS

getNews();

/**
 * It takes news from the json and inserts it into the news section.
 */
async function getNews() {
    let response = await fetch('http://' + window.location.hostname + ':3000/json/news.json', {
        method: "GET"
    });

    let jsonObj = (await response.json()).results;
    const listGroup = document.getElementById('news');

    for (let index = 0; index < 3; index++) {
        const element = jsonObj[index];
        createRowNews(listGroup, element, index);
    }

}

/**
 * Inserts the crypto news into a list group.
 * @param {*} listGroup Reference to the top100 table.
 * @param {*} object Json object containing a news.
 * @param {*} index Element index .
 */
function createRowNews(listGroup, object, index) {
    let newRow = document.createElement('li');
    newRow.classList.add('list-group-item');

    let text = document.createTextNode(object.title);
    newRow.appendChild(text);

    newBr = document.createElement('br');
    newRow.appendChild(newBr);

    /**
     * The rel attribute sets the relationship between the page and the linked URL. 
     * Setting it to noopener noreferrer is to prevent a type of phishing known as tabnabbing.
     */
    newLink = document.createElement('a');
    newLink.classList.add('text-nowrap');
    newLink.setAttribute('target', '_blank');
    newLink.setAttribute('rel', 'noopener noreferrer');
    text = document.createTextNode('Read more...');
    newLink.appendChild(text);
    newLink.href = object.url;
    newRow.appendChild(newLink);

    listGroup.appendChild(newRow);
}

//#endregion