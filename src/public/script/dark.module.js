//#region CONTENT LOADED

/**
 * It takes the local storage content and manipulates it, if the content is not present it creates it according to the system preferences.
 */
function allStorage() {

    let objDarkMode = JSON.parse(localStorage.getItem('objDarkMode'));
    if (!objDarkMode) {
        objDarkMode = {
            darkMode: (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches),
            date: new Date()
        };
        localStorage.setItem('objDarkMode', JSON.stringify(objDarkMode));
    }
    updateToggleDarkMode(objDarkMode.darkMode);
}

document.addEventListener('DOMContentLoaded', allStorage());

//#endregion

//#region DARKMODE OR LIGHTMODE (OS's preferred color scheme)

/**
 * Sets dark mode or light mode depending on the input boolean value.
 * @param {Boolean} darkMode True for dark mode.
 */
function updateToggleDarkMode(darkMode) {

    let body = document.body;
    if (darkMode) {
        body.classList.add('dark-theme-variables');
    } else {
        body.classList.remove('dark-theme-variables');
    }

    let obj = {
        darkMode: darkMode,
        date: new Date()
    };
    localStorage.setItem('objDarkMode', JSON.stringify(obj));
}

/**
 * Depending on the state of the switch changes the mode and saves the new preference in the local storage
 */
function switchDarkMode() {
    updateToggleDarkMode(!document.body.classList.contains('dark-theme-variables'));
}

/**
 * window.matchMedia('(prefers-color-scheme: dark)').matches
 * Returns a boolean, if the Media-Query is true.
 */
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    const newColorScheme = event.matches ? "dark" : "light";
    if (newColorScheme == "dark") {
        updateToggleDarkMode(true);
    } else {
        updateToggleDarkMode(false);
    }
});

//#endregion