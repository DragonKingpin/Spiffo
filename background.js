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

var objKeysYokedIfExited = function ( obj, ks ) {
    var j = {};

    for ( let i = 0; i < ks.length; i++ ) {
        let k = ks[ i ];

        if ( obj.hasOwnProperty( k ) ) {
            j[ k ] = obj[ k ];
        }
    }

    return j;
};

var logChromeLastError = function ( context ) {
    let error = chrome.runtime.lastError;
    if( error ) {
        console.warn( context + ": " + error.message );
    }
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
                let inject = chrome.scripting.executeScript({
                    target: {tabId: tabId},
                    func: Spiffo.tabControl.setTabTitle,
                    args: [ data[ tab.url ][ "title" ], data[ tab.url ][ "appendMode" ] ]
                });

                if( inject && inject.catch ) {
                    inject.catch(function ( e ) {
                        console.warn( "setTabTitle skipped: " + e.message );
                    });
                }
            }
        });
    }
});



Spiffo.tombstone = {
    cleanWinFrame: function ( win ) {
        let info = win && win[ "info" ] ? win[ "info" ] : {};
        let winFrame = objKeysYokedIfExited(
            info,
            [ "focused", "incognito", "type", "state", "top", "left", "width", "height" ]
        );

        if( !winFrame[ "type" ] ) {
            winFrame[ "type" ] = "normal";
        }

        return winFrame;
    },

    cleanTabFrame: function ( tab, windowId, active ) {
        let tabFrame = objKeysYokedIfExited(
            tab,
            [ "url", "pinned", "muted" ]
        );

        tabFrame[ "windowId" ] = windowId;
        tabFrame[ "active" ] = !!active;

        return tabFrame;
    },

    createTab: function ( tab, cb ) {
        chrome.tabs.create( tab, function ( neoTab ) {
            logChromeLastError( "create tab skipped" );
            if( cb ) {
                cb( neoTab );
            }
        });
    },

    restoreTabsInWindow: function ( windowId, tabs, skipAt ) {
        let activeCreatedId = undefined;

        for ( let j = 0; j < tabs.length; ++j ) {
            if( j === skipAt ) {
                continue;
            }

            let tab = tabs[ j ];
            let shouldActivate = !!tab[ "active" ];
            let tabFrame = Spiffo.tombstone.cleanTabFrame( tab, windowId, false );

            Spiffo.tombstone.createTab( tabFrame, function ( neoTab ) {
                if( shouldActivate && neoTab && neoTab[ "id" ] ) {
                    activeCreatedId = neoTab[ "id" ];
                    chrome.tabs.update( activeCreatedId, { active: true }, function () {
                        logChromeLastError( "activate restored tab skipped" );
                    });
                }
            });
        }
    },

    spawnNewWin: function ( win, tabs ) {
        let winFram = Spiffo.tombstone.cleanWinFrame( win );
        let firstTabAt = tabs && tabs.length ? 0 : -1;

        //alert( JSON.stringify( winFram )  )

        if( firstTabAt >= 0 && tabs[ firstTabAt ][ "url" ] ) {
            winFram[ "url" ] = tabs[ firstTabAt ][ "url" ];
        }

        chrome.windows.create( winFram, function ( neoWin ) {
            logChromeLastError( "create window skipped" );
            if( !neoWin || !neoWin[ "id" ] ) {
                return;
            }

            Spiffo.tombstone.restoreTabsInWindow( neoWin[ "id" ], tabs || [], firstTabAt );

            if( firstTabAt >= 0 && tabs[ firstTabAt ][ "active" ] && neoWin.tabs && neoWin.tabs[0] ) {
                chrome.tabs.update( neoWin.tabs[0].id, { active: true }, function () {
                    logChromeLastError( "activate first restored tab skipped" );
                });
            }
        } );
    }
};

Spiffo.tombstoneCookies = {
    isIncognitoContext: function () {
        return !!( chrome.extension && chrome.extension.inIncognitoContext );
    },

    isSealUrl: function ( url ) {
        try {
            let parsed = new URL( url );
            return parsed.protocol === "http:" || parsed.protocol === "https:";
        }
        catch ( e ) {
            return false;
        }
    },

    packCookie: function ( cookie, sourceUrl, incognito ) {
        let packed = objKeysYokedIfExited(
            cookie,
            [
                "domain", "hostOnly", "name", "value", "path", "secure",
                "httpOnly", "sameSite", "session", "expirationDate", "storeId",
                "partitionKey"
            ]
        );

        packed[ "url" ] = sourceUrl;
        packed[ "incognito" ] = incognito;

        return packed;
    },

    setCookie: function ( cookie ) {
        return new Promise( function ( resolve ) {
            let details = objKeysYokedIfExited(
                cookie,
                [ "url", "name", "value", "path", "secure", "httpOnly", "sameSite", "expirationDate", "partitionKey" ]
            );

            if( !cookie[ "hostOnly" ] && cookie[ "domain" ] ) {
                details[ "domain" ] = cookie[ "domain" ];
            }

            if( cookie[ "session" ] ) {
                delete details[ "expirationDate" ];
            }

            chrome.cookies.set( details, function ( neoCookie ) {
                let error = chrome.runtime.lastError;
                resolve({
                    ok: !error && !!neoCookie,
                    name: cookie[ "name" ],
                    domain: cookie[ "domain" ],
                    error: error ? error.message : undefined
                });
            });
        });
    },

    sealForTabs: async function ( tabs ) {
        let seen = {};
        let sealed = [];

        for ( let i = 0; i < tabs.length; ++i ) {
            let tab = tabs[ i ];
            if( !tab || !Spiffo.tombstoneCookies.isSealUrl( tab[ "url" ] ) ) {
                continue;
            }

            let cookies = await new Promise( function ( resolve ) {
                chrome.cookies.getAll({ url: tab[ "url" ] }, function ( items ) {
                    let error = chrome.runtime.lastError;
                    if( error ) {
                        console.warn( error );
                        resolve( [] );
                        return;
                    }
                    resolve( items || [] );
                });
            });

            for ( let j = 0; j < cookies.length; ++j ) {
                let cookie = cookies[ j ];
                let key = [
                    cookie[ "storeId" ] || "",
                    cookie[ "domain" ] || "",
                    cookie[ "path" ] || "",
                    cookie[ "name" ] || "",
                    JSON.stringify( cookie[ "partitionKey" ] || null )
                ].join( "\n" );

                if( seen[ key ] ) {
                    continue;
                }

                seen[ key ] = true;
                sealed.push( Spiffo.tombstoneCookies.packCookie(
                    cookie,
                    tab[ "url" ],
                    !!tab[ "incognito" ]
                ));
            }
        }

        return {
            included: true,
            scope: "sealedTabsOnly",
            contextIncognito: Spiffo.tombstoneCookies.isIncognitoContext(),
            items: sealed
        };
    },

    restore: async function ( cookies ) {
        let items = cookies && cookies[ "items" ] ? cookies[ "items" ] : [];
        let contextIncognito = Spiffo.tombstoneCookies.isIncognitoContext();
        let restored = 0;
        let skipped = 0;
        let errors = [];

        for ( let i = 0; i < items.length; ++i ) {
            let cookie = items[ i ];
            if( !Spiffo.tombstoneCookies.isSealUrl( cookie[ "url" ] ) ) {
                skipped++;
                continue;
            }

            if( !!cookie[ "incognito" ] !== contextIncognito ) {
                skipped++;
                continue;
            }

            let result = await Spiffo.tombstoneCookies.setCookie( cookie );
            if( result.ok ) {
                restored++;
            }
            else {
                errors.push( result );
            }
        }

        return {
            restored: restored,
            skipped: skipped,
            errors: errors
        };
    }
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if ( message.action === "SealCookies" ) {
        Spiffo.tombstoneCookies.sealForTabs( message.tabs || [] ).then(function ( cookies ) {
            sendResponse({ result: "success", cookies: cookies });
        }).catch(function ( e ) {
            sendResponse({ result : "error", what: "Jesus Fuck !!! What->" + e.toString() });
        });
        return true;
    }

    if ( message.action === "RestoreCookies" ) {
        Spiffo.tombstoneCookies.restore( message.cookies ).then(function ( report ) {
            sendResponse({ result: "success", report: report });
        }).catch(function ( e ) {
            sendResponse({ result : "error", what: "Jesus Fuck !!! What->" + e.toString() });
        });
        return true;
    }

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
                                Spiffo.tombstone.restoreTabsInWindow( winThis[ "id" ], tabs || [], -1 );
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

