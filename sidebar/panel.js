var myWindowId;
var comics_list = document.querySelector('#comics_list');

/* Constructor for Comic links */
function createComicLink(url, host) {
    var comic_link = document.createElement('a');
    comic_link.classList.add('comic_link');
    comic_link.setAttribute('href', url);
    comic_link.innerHTML = host;

    comics_list.appendChild(comic_link);
}

/* The good stuff */
function remember() {
    browser.tabs.query({windowId: myWindowId, active: true}).then((tabs) => {
        /* UNDERCONSTRUCTION */
        var obj = Object.create();
        obj.title = '';
        obj.url = '';
        obj.host = '';

        obj.title = prompt('Comic Title', tabs[0].title);
        obj.url = tabs[0].url;
        obj.host = getBaseURL(tabs[0].url);

        /* END UNDERCONSTRUCTION */
        let contentToStore = {};
        base_url = getBaseURL(tabs[0].url);
        // contentToStore[base_url] = tabs[0].url;
        contentToStore[base_url] = obj;
        browser.storage.local.set(contentToStore);
    });
}

function forget() {
    browser.tabs.query({windowId: myWindowId, active: true}).then((tabs) => {
        let contentToStore = {};
        base_url = getBaseURL(tabs[0].url);
        contentToStore[base_url] = '';
        browser.storage.local.set(contentToStore);
        updateContent();
    });
}

function updateContent() {
    browser.storage.local.get(null).then((results) => {
        var keys = Object.keys(results);
        comics_list.innerHTML = '';
        for (let key of keys) {
            createComicLink(
                results[key].url,
                results[key].title ? results[key].title : results[key].host);
        }
    });
}

browser.tabs.onActivated.addListener(updateContent);

browser.tabs.onUpdated.addListener(updateContent);

browser.windows.getCurrent({populate: true}).then((windowInfo) => {
    myWindowId = windowInfo.id;
    updateContent();
});

/* Add new webcomic */
function recordUrl(tabInfo) {
    comics_list.innerHTML += tabInfo.url + '<br />';
    remember();
    updateContent();
}

function webcomicAddPopup() {
    browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
        comics_list.innerHTML += tabs[0].url + '<br />';
        remember();
        updateContent();
    });
}

function updateWebcomic() {
    browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
        comics_list.innerHTML = tabs[0].url;
        remember();
        updateContent();
    });
}

function gotoWebcomicPage() {
    browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
        try {
            browser.tabs.remove(tabs[0].id);
            browser.tabs.create({url: comics_list.innerHTML});
        } catch (err) {
            comics_list.innerHTML = err;
        }
    });
}

/* Utility Functions */
function getBaseURL(url) {
    return url.split('/').slice(0, 3).join('/');
}
