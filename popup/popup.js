// Hide all .hidden elements
for (let el of document.querySelectorAll('.hidden'))
    el.style.visibility = 'hidden';

// Do all the things
var myWindowId;
var comic_name = document.querySelector('#comic_name');
var title_input = document.querySelector('#title_input');

function remember() {
    browser.tabs.query({windowId: myWindowId, active: true}).then((tabs) => {
        let contentToStore = {};
        let obj = {};

        obj.title = title_input.value;
        obj.url = tabs[0].url;
        obj.host = getBaseURL(tabs[0].url);

        base_url = getBaseURL(tabs[0].url);
        contentToStore[base_url] = obj;
        browser.storage.local.set(contentToStore);

        updateContent();
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
            title_input.value = storedInfo[Object.keys(storedInfo)[0]].title;
            comic_name.innerHTML = storedInfo[Object.keys(storedInfo)[0]].url;
        });
}

browser.tabs.onActivated.addListener(updateContent);

browser.tabs.onUpdated.addListener(updateContent);

browser.windows.getCurrent({populate: true}).then((windowInfo) => {
    myWindowId = windowInfo.id;
    updateContent();
});

function gotoWebcomicPage() {
    browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
        try {
            browser.tabs.create({url: comic_name.innerHTML});
            browser.tabs.remove(tabs[0].id);
        } catch (err) {
            comic_name.innerHTML = err;
        }
    });
}

document.querySelector('#update').addEventListener('click', remember);

document.querySelector('#goto').addEventListener('click', gotoWebcomicPage);

/* Utility Functions */
function getBaseURL(url) {
    return url.split('/').slice(0, 3).join('/');
}
