Spiffo.app = angular.module('myapp',[]);

Spiffo.fnGetTabsInfosRecall     = function ( cb ) {
    var queryInfo = {
        // active: true,
        // currentWindow: true
    };

    chrome.tabs.query( queryInfo, function(tabs) {
        cb(tabs);
    });
};

Spiffo.pvfnTombInfoTabsChromify = function ( that ) {
    return objKeysYokedIfExited(
        that, [ "windowId", "index", "url", "active", "pinned", "openerTabId" ]
    );
};

Spiffo.pvfnTombInfoWinsChromify = function ( that, nWinId ) {
    var j = objKeysYokedIfExited(
        that, [ "focused", /* // Thoes are document's: "top", "left", "width", "height" */, "tabs", "incognito", "type", "state" ]
    );

    j[ "id" ] = nWinId;

    return j;
};

Spiffo.pvfnSummonWinsAndTabs    = function ( winMapped ) {
    var jDetail = { "detail":{ } };
    //jDetail[ "detail" ][ "winMapped" ] = winMapped;
    jDetail[ "winMapped" ] = winMapped;

    chrome.windows.getCurrent( {}, function( winThis ) {
        chrome.runtime.sendMessage({ action: "WinsSpawnEvent", data: jDetail, winThis: winThis }, response => {
            if ( response.result === "success" ) {
                console.log( "success" );
            }
            else if ( response.result === "error" ) {
                alert( response.what );
            }
        });
    });

    //winBackground.dispatchEvent( new CustomEvent( "WinsSpawnEvent", jDetail ) );
};

Spiffo.pvfnSiftWinTabsGroupBy   = function ( winTabss ) {
    let winMapped = {};

    for ( let i = 0; i < winTabss.length; i++ ) {
        let jWTs = winTabss[ i ];
        for ( let j = 0; j < jWTs.length; j++ ) {
            let jWT = jWTs[ j ], wid = 0;

            if ( jWT.hasOwnProperty( "windowId" ) ) {
                wid = jWT[ "windowId" ];
            }

            if( !winMapped[ wid ] ) {
                winMapped[ wid ] = {};
            }

            if( !winMapped[ wid ][ "tabs" ] ) {
                winMapped[ wid ][ "tabs" ] = [];
            }

            winMapped[ wid ][ "info" ] =     Spiffo.pvfnTombInfoWinsChromify( jWT, wid )   ;
            winMapped[ wid ][ "tabs" ].push( Spiffo.pvfnTombInfoTabsChromify( jWT      ) ) ;


            //chrome.tabs.create( Spiffo.pvfnTombInfoTabsChromify( jTomb ) );
        }
    }

    return winMapped;
};


Spiffo.app.controller("tombstoneController", function ($scope, $http) {
    Spiffo.fnGetTabsInfos = function (  ) {
        Spiffo.fnGetTabsInfosRecall(function(tabs) {
            $scope.$apply(function(){
                $scope.tabsInfo = JSON.stringify( [ tabs ] );
            });
        });
    };

    Spiffo.fnGetCurrentWinTabsInfos = function (  ) {
        chrome.windows.getCurrent(function (window) {
            var currentWindowId = window.id;
            trace( "Current Window ID: ", currentWindowId );

            chrome.tabs.query({ windowId: currentWindowId }, function (tabs) {
                //trace( "Tabs in current window: ", tabs );
                $scope.$apply(function(){
                    $scope.tabsInfo = JSON.stringify( [ tabs ] );
                });
            });
        });
    };

    Spiffo.fnSpawnTabsFromInfos = function (  ) {
        try {

            //chrome.windows.create( { url: "http://rednest.cn" } )
            var szTabsTombArea = document.getElementById( "tabsTombArea" ).value;
            if( szTabsTombArea ) {
                var jTombss = [];
                if( szTabsTombArea.startsWith( "[" ) && szTabsTombArea.endsWith( "]" ) ) {
                    jTombss = JSON.parse( szTabsTombArea );

                    let winMapped = Spiffo.pvfnSiftWinTabsGroupBy( jTombss );
                    Spiffo.pvfnSummonWinsAndTabs( winMapped );


                    return;
                }

                var jUrls = szTabsTombArea.split( "\n" );
                if( jUrls.length ) {
                    for ( let i = 0; i < jUrls.length; i++ ) {
                        var jTomb = {  };
                        jTomb [ "url" ] = jUrls[ i ];

                        chrome.tabs.create( jTomb );
                    }
                }
            }
        }
        catch ( e ) {
            alert( "Jesus Fuck !!! What->" + e.toString() );
        }
    };

    $scope.urlList = [];
    $scope.Spiffo   = Spiffo;


    $scope.getTabsUrl = function() {
        Spiffo.fnGetTabsInfosRecall(function(tabsUrl) {
            $scope.$apply(function(){
                $scope.urlList = tabsUrl;
            });
        });
    };

});

