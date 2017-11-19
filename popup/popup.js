// Hide all .hidden elements
for (let el of document.querySelectorAll('.hidden'))
    el.style.visibility = 'hidden';

// Do all the things
var myWindowId;
var comic_name = document.querySelector('#comic_name');
var title_input = document.querySelectorAll('.title_input');

const BOOKMARK_TYPE = 0;
const FOLDER_TYPE = 1;

function remember() {
    browser.tabs.query({windowId: myWindowId, active: true}).then((tabs) => {
        let contentToStore = {};
        let obj = {};
        var base_url = getBaseURL(tabs[0].url);

        obj.title = title_input[0].value;
        obj.url = tabs[0].url;
        obj.host = base_url;
        obj.favicon = tabs[0].favIconUrl;

        /* FUTURE DEVELOPMENT: sidepanel tree-view */
        obj.type = BOOKMARK_TYPE;
        obj.childOf = null;
        /* END FUTURE DEVELOPMENT*/

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
    browser.tabs.query({currentWindow: true, active: true})
        .then((tabs) => {
            return browser.storage.local.get(getBaseURL(tabs[0].url));
        })
        .then((storedInfo) => {
            var obj = storedInfo[Object.keys(storedInfo)[0]];

            if (!obj || !obj.title) {
                document.querySelector('#display-comic-name').value = '';
            } else {
                document.querySelector('#display-comic-name').value = obj.title;
            }

            if (!obj)
                comic_name.innerHTML = '';
            else
                comic_name.innerHTML = obj.url;
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
            browser.tabs
                .update(tabs[0].id, {active: true, url: comic_name.innerHTML})
                .then(onUpdate, onError);
        } catch (err) {
            comic_name.innerHTML = err;
        }
    });
}

function onUpdate() {
    // dummy function
};

function onError() {
    // dummy function
}

document.querySelector('#update').addEventListener('click', remember);

document.querySelector('#goto').addEventListener('click', gotoWebcomicPage);

/* Utility Functions */
function getBaseURL(url) {
    return url.split('/').slice(0, 3).join('/');
}
