// vim:set ai et shiftwidth=4 softtabstop=4 :
function HistLocBar(){
    this.maxDays = 30;
    var getMaxDays = browser.storage.sync.get({
        'maxDays': 30
    });

    var self = this;

    getMaxDays.then((res) => {
        self.maxDays = res.maxDays;
    });

    this.onStorageChanged = function (changes, areaName){
        if(areaName == "sync" && changes.hasOwnProperty("maxDays")){
            self.maxDays = changes.maxDays.newValue;
        }
    }

    browser.storage.onChanged.addListener(this.onStorageChanged);

    this.onInputChanged = function(text, suggest){
        var curTime = new Date();
        var startTime = new Date(curTime.getTime() - (self.maxDays * 86400000));

        browser.history.search({
            text: text,
            maxResults: 6,
            startTime: startTime
        }).then((items) => {
            suggest(
                items.map((item) => {
                    return {
                        content: item.url,
                        description: item.title
                    };
                })
            );
        });
    }

    this.onInputEntered = function(url, disposition){
        switch (disposition) {
            case "currentTab":
                browser.tabs.update({url});
                break;
            case "newForegroundTab":
                browser.tabs.create({url});
                break;
            case "newBackgroundTab":
                browser.tabs.create({url, active: false});
                break;
        }
    }

    return this;
}

var hlb = new HistLocBar();

browser.omnibox.onInputChanged.addListener(hlb.onInputChanged);
browser.omnibox.onInputEntered.addListener(hlb.onInputEntered);
