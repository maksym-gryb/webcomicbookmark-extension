var myWindowId;
var log_sidepanel = document.querySelector('#log');
var logs_sidepanel = document.querySelector('#logs');

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
	logs_sidepanel.innerHTML = browser.storage.local.get(null).then((results) => {
		var keys = Object.keys(results);
		for (let key of keys) {
		  logs_sidepanel.innerHTML += results[key];
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

function gotoWebcomicPage(){
	browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
		try{
			browser.tabs.remove(tabs[0].id);
			browser.tabs.create({url: log_sidepanel.innerHTML});
		}
		catch(err)
		{
			log_sidepanel.innerHTML = err;
		}
	});
}

document.querySelector("#add").addEventListener("click", webcomicAddPopup);

document.querySelector("#remove").addEventListener("click", forget);

document.querySelector("#update").addEventListener("click", updateWebcomic);

document.querySelector("#goto").addEventListener("click", gotoWebcomicPage);

/* Utility Functions */
function getBaseURL(url){
	return url.split('/').slice(0, 3).join("/");
}