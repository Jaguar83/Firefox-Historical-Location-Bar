// vim:set ai et shiftwidth=4 softtabstop=4 :
function saveOptions(e) {
    var options = {
        maxDays: new Number(document.querySelector("#maxDays").value)
    };

    if(options.maxDays < 1 && options.maxDays > 366){
        document.querySelector("#error").removeAttribute("class");
    } else {
        document.querySelector("#error").setAttribute("class", "hidden");
        browser.storage.sync.set(options);
    }
    e.preventDefault();
}

function restoreOptions() {
    var getMaxDays = browser.storage.sync.get({
        'maxDays': 30
    });
    getMaxDays.then((res) => {
        document.querySelector("#maxDays").value = res.maxDays;
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
