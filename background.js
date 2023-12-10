Ursus.fnInitWinsSpawnEvent = function () {
    //var event = new CustomEvent( "WinsSpawnEvent", { "args":{} } );
    window.addEventListener('WinsSpawnEvent', function ( event ) {
        if( $isTrue( event.detail ) && $isTrue( event.detail.winMapped ) ) {
            let winMapped = event.detail.winMapped;
            chrome.windows.getCurrent( {}, function( winThis ) {
                try {
                    let winAt = 0;

                    for ( let k in winMapped ) {
                        if ( winMapped.hasOwnProperty( k ) ) {
                            let win  = winMapped[ k ];
                            let tabs = win [ "tabs" ];
                            if( winAt++ == 0 ) {
                                for ( let j = 0; j < tabs.length; ++j ) {
                                    let tab = tabs[ j ];
                                    tab[ "windowId" ] = winThis[ "id" ];
                                    chrome.tabs.create( tab );
                                }
                            }
                            else {
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
                        }
                    }
                }
                catch ( e ) {
                    alert( "Jesus Fuck !!! What->" + e.toString() );
                }

            } );
        }
    }, false );
}


Ursus.fnInitWinsSpawnEvent();

window.Ursus = Ursus;