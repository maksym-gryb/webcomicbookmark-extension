var log_sidepanel = document.querySelector('#log');

browser.commands.onCommand.addListener((command) => {
    log_sidepanel.innerHTML += command + '<br />';
});
