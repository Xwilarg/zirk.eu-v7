// When we click on something, disable all elements and enable the current one
function displayTab(tabClass, currentTabName) {
    let targetElement = document.getElementById(currentTabName);

    for (let elem of document.getElementsByClassName(tabClass)) {
        elem.hidden = true;
    }

    if (targetElement !== null)
    {
        targetElement.hidden = false;
        for (let lazy of document.querySelectorAll(`#${currentTabName} .lazy`)) {
            lazy.src = lazy.dataset.src;
        }
    }
}