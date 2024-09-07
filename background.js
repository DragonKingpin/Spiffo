var Spiffo = {};

Spiffo.tabControl = {
    thisTab: {},

    setTabTitle: function ( title, appended ) {
        if( appended ) {
            if( document.title.indexOf( title ) < 0 ) {
                document.title = title + document.title;
            }
        }
        else {
            document.title = title;
        }
    },
};

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if ( changeInfo.status === 'complete' || changeInfo[ "title" ] ) {
        console.log( tab, changeInfo );
        chrome.storage.sync.get(tab.url, function(data) {
            if ( data[ tab.url ] && data[ tab.url ][ "lock" ] ) {
                chrome.scripting.executeScript({
                    target: {tabId: tabId},
                    func: Spiffo.tabControl.setTabTitle,
                    args: [ data[ tab.url ][ "title" ], data[ tab.url ][ "appendMode" ] ]
                });
            }
        });
    }
});

