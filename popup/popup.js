// Hide all .hidden elements
for (let el of document.querySelectorAll('.hidden'))
    el.style.visibility = 'hidden';

// Do all the things
var myWindowId;
var log_sidepanel = document.querySelector('#comic-name');

function remember() {
    browser.tabs.query({windowId: myWindowId, active: true}).then((tabs) => {
        let contentToStore = {};
        base_url = getBaseURL(tabs[0].url);
        contentToStore[base_url] = log_sidepanel.innerHTML;
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
    browser.tabs.query({windowId: myWindowId, active: true})
        .then((tabs) => {
            return browser.storage.local.get(getBaseURL(tabs[0].url));
        })
        .then((storedInfo) => {
            log_sidepanel.innerHTML = storedInfo[Object.keys(storedInfo)[0]];
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
    log_sidepanel.innerHTML += tabInfo.url + '<br />';
    remember();
    updateContent();
}

function webcomicAddPopup() {
    browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
        log_sidepanel.innerHTML += tabs[0].url + '<br />';
        remember();
        updateContent();
    });
}

function updateWebcomic() {
    browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
        log_sidepanel.innerHTML = tabs[0].url;
        remember();
        updateContent();
    });
}

function gotoWebcomicPage() {
    browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
        try {
            browser.tabs.create({url: log_sidepanel.innerHTML});
            browser.tabs.remove(tabs[0].id);
        } catch (err) {
            log_sidepanel.innerHTML = err;
        }
    });
}

// document.querySelector('#add').addEventListener('click', webcomicAddPopup);

// document.querySelector('#remove').addEventListener('click', forget);

document.querySelector('#update-2').addEventListener('click', updateWebcomic);

document.querySelector('#goto-2').addEventListener('click', gotoWebcomicPage);

/* Utility Functions */
function getBaseURL(url) {
    return url.split('/').slice(0, 3).join('/');
}
