// When we click on something, disable all elements and enable the current one
export function displayTab(tabClass: string, currentTabName: string): void {
    let targetElement = document.getElementById(currentTabName);

    for (let elem of document.getElementsByClassName(tabClass)) {
        (elem as HTMLElement).hidden = true;
    }

    if (targetElement !== null) {
        targetElement.hidden = false;
        // Images with "lazy" class attached to them need to be loaded 
        for (let lazy of document.querySelectorAll(`#${currentTabName} .lazy`)) {
            (lazy as HTMLImageElement).src = (lazy as HTMLElement).dataset.src!;
        }
        targetElement.scrollIntoView();
    }
}