// Hide all .hidden elements
for (let el of document.querySelectorAll('.hidden'))
    el.style.visibility = 'hidden';

// Do all the things
var myWindowId;
var comic_name = document.querySelector('#comic_name');
var title_input = document.querySelectorAll('.title_input');
var edit_comic_name = document.querySelector('#edit-comic-name');

function remember() {
    browser.tabs.query({windowId: myWindowId, active: true}).then((tabs) => {
        let contentToStore = {};
        let obj = {};

        obj.title = title_input[0].value;
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
            // for (let el of title_input) el.style.visible = 'hidden';

            var obj = storedInfo[Object.keys(storedInfo)[0]];

            /*
            if (obj.title == null) {
                // show editable comic name
                document.querySelector('#input_title_block').style.visible =
                    'visible';
                document.querySelector('#display_title_block').style.visible =
                    'hidden';
            } else {
                document.querySelector('#input_title_block').style.visible =
                    'hidden';
                document.querySelector('#display_title_block').style.visible =
                    'visible';

                document.querySelector('#edit-comic-name').innerHTML =
                    obj.title;
                document.querySelector('#display-comic-name').innerHTML =
                    obj.title;
            }
            */

            comic_name.innerHTML = obj.url;
        });
}

browser.tabs.onActivated.addListener(updateContent);

browser.tabs.onUpdated.addListener(updateContent);

/*
edit_comic_name.addEventListener('click', function() {
    // show editable comic name
    document.querySelector('#input_title_bloc').style.visible = 'visible';
    document.querySelector('#display_title_block').style.visible = 'hidden';
});
*/

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
