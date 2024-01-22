// The `message` event is fired in a web worker any time `worker.postMessage(<data>)` is called.
// `event.data` represents the data being passed into a worker via `worker.postMessage(<data>)`.
self.addEventListener('message', async event => {
    // Grab the imageURL from the event - we'll use this both to download
    // the image and to identify which image elements to update back in the
    // UI thread
    const imageURL = event.data;

    // First, we'll fetch the image file
    const response = await fetch(imageURL);

    // Once the file has been fetched, we'll convert it to a `Blob`
    const blob = await response.blob();

    // Send the image data to the UI thread!
    self.postMessage({
        imageURL: imageURL,
        blob: blob,
    })
})