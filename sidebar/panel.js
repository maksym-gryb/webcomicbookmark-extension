var myWindowId;
var comics_list = document.querySelector('#comics_list');

function remember() {
    browser.tabs.query({windowId: myWindowId, active: true}).then((tabs) => {
        let contentToStore = {};
        base_url = getBaseURL(tabs[0].url);
        contentToStore[base_url] = comics_list.innerHTML;
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
            comics_list.innerHTML += '<a href="' + results[key] + '"' +
                '>' + getBaseURL(results[key]) + '</a>' +
                '<br />';
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
