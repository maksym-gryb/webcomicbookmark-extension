var myWindowId;
var comics_list = document.querySelector('#comics_list');

/* Constructor for Comic links */
function createComicLink(url, host, favicon) {
    var comic_link = document.createElement('a');
    comic_link.classList.add('comic_link');
    comic_link.setAttribute('href', url);
    comic_link.innerHTML =
        '<img src=\'' + favicon + '\' width=\'16px\' height=\'16px\'>' + host;

    comics_list.appendChild(comic_link);
    // comics_list.appendChild(document.createElement('br'));
}

function updateContent() {
    browser.storage.local.get(null).then((results) => {
        var keys = Object.keys(results);
        comics_list.innerHTML = '';
        for (let key of keys) {
            createComicLink(
                results[key].url,
                results[key].title ? results[key].title : results[key].host,
                results[key].favicon);
        }
    });
}

browser.storage.onChanged.addListener(updateContent);

browser.tabs.onActivated.addListener(updateContent);

browser.tabs.onUpdated.addListener(updateContent);
