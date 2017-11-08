var myWindowId;
var log_sidepanel = document.querySelector('#log');

function remember(){
	browser.tabs.query({windowId: myWindowId, active: true}).then((tabs) => {
		let contentToStore = {};
		base_url = getBaseURL(tabs[0].url);
		contentToStore[base_url] = log_sidepanel.innerHTML;
		browser.storage.local.set(contentToStore);
	});
}

function forget(){
	browser.tabs.query({windowId: myWindowId, active: true}).then((tabs) => {
		let contentToStore = {};
		base_url = getBaseURL(tabs[0].url);
		contentToStore[base_url] = "";
		browser.storage.local.set(contentToStore);
	});
	
	updateContent();
}

browser.commands.onCommand.addListener((command) => {
    log_sidepanel.innerHTML += command + '<br />';
	remember();
});

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
function recordUrl(tabInfo){
	log_sidepanel.innerHTML += tabInfo.url + "<br />";
	remember();
}

function webcomicAddPopup(){
	browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
		log_sidepanel.innerHTML += tabs[0].url + "<br />";
		remember();
	});
}

function updateWebcomic(){
	browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
		log_sidepanel.innerHTML = tabs[0].url;
		remember();
	});
}

document.querySelector("#add").addEventListener("click", webcomicAddPopup);

document.querySelector("#remove").addEventListener("click", forget);

document.querySelector("#update").addEventListener("click", updateWebcomic);

/* Utility Functions */
function getBaseURL(url){//convert this to simply get the current tab, instead of needing a parameter
	return url.split('/').slice(0, 3).join("/");
}