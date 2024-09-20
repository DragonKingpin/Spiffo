var $isEmpty = function   ( h ) {
    var k;
    for ( k in h ) {
        return false;
    }
    return true;
}
var $isTrue    = function ( b ){ // Fuck JS, who would fucking think `[],{}` as true ????
    if( b instanceof Object ){
        return !$isEmpty( b );
    }
    return b !== "" && !!b;
};


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



Spiffo.tombstone = {
    spawnNewWin: function ( win, tabs ) {
        let winFram  = win[ "info" ];
        delete winFram[ "id" ]; // Legacy ID is useless.

        //alert( JSON.stringify( winFram )  )

        chrome.windows.create( winFram, function ( neoWin ) {
            for ( let j = 0; j < tabs.length; ++j ) {
                let tab = tabs[ j ];
                tab[ "windowId" ] = neoWin[ "id" ];
                delete tab[ "id"    ];
                delete tab[ "index" ];
                delete tab[ "openerTabId" ];
                //alert( JSON.stringify( tab ) )
                chrome.tabs.create( tab );
            }

            setTimeout( function () {
                chrome.tabs.remove( [neoWin.tabs[0].id] );
            }, 200 );
        } );
    }
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if ( message.action === "WinsSpawnEvent" ) {
        if( $isTrue( message ) && $isTrue( message.data.winMapped ) ) {
            let winMapped = message.data.winMapped;

            let winThis = message.winThis;
            try {
                let winAt = 0;

                for ( let k in winMapped ) {
                    if ( winMapped.hasOwnProperty( k ) ) {
                        let win  = winMapped[ k ];
                        let tabs = win [ "tabs" ];
                        //console.log( win );
                        if( winAt++ === 0 ) {
                            try{
                                for ( let j = 0; j < tabs.length; ++j ) {
                                    let tab = tabs[ j ];
                                    tab[ "windowId" ] = winThis[ "id" ];
                                    chrome.tabs.create( tab );
                                }
                            }
                            catch ( e ) {
                                console.warn( e );
                                Spiffo.tombstone.spawnNewWin( win, tabs );
                            }
                        }
                        else {
                            Spiffo.tombstone.spawnNewWin( win, tabs );
                        }
                    }
                }
            }
            catch ( e ) {
                sendResponse( { result : "error", what: "Jesus Fuck !!! What->" + e.toString() } );
            }

            sendResponse( { result : "success" } );
        }
    }
});

