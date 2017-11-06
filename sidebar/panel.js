var log_sidepanel = document.querySelector('#log');
var x = 0;

window.addEventListener('mouseover', () => {
    x++;
    log_sidepanel.innerHTML = x;
});
