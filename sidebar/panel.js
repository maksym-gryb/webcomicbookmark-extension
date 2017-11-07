var log_sidepanel = document.querySelector('#log');

var gettingAllCommands = browser.commands.getAll();
gettingAllCommands.then((commands) => {
    for (let command of commands) {
        log_sidepanel.innerHTML = command;
    }
});

/**
 * Fired when a registered command is activated using a keyboard shortcut.
 *
 * In this sample extension, there is only one registered command:
 * "Ctrl+Shift+U". On Mac, this command will automatically be converted to
 * "Command+Shift+U".
 */
browser.commands.onCommand.addListener((command) => {
    log_sidepanel.innerHTML = command;
});
