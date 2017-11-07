var myWindowId;
var log_sidepanel = document.querySelector('#log');

function remember(){
	browser.tabs.query({windowId: myWindowId, active: true}).then((tabs) => {
		let contentToStore = {};
		contentToStore[tabs[0].url] = log_sidepanel.innerHTML;
		browser.storage.local.set(contentToStore);
	});
}

function forget(){
	browser.tabs.query({windowId: myWindowId, active: true}).then((tabs) => {
		let contentToStore = {};
		contentToStore[tabs[0].url] = "";
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
      return browser.storage.local.get(tabs[0].url);
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
function webcomicAddPopup(){
	log_sidepanel.innerHTML += "ptoato<br />";
	remember();
}

document.querySelector("#add").addEventListener("click", webcomicAddPopup);

document.querySelector("#remove").addEventListener("click", forget);