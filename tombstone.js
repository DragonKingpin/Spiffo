var app = angular.module('myapp',[]);

trace( chrome.extension.getBackgroundPage() )

var winBackground = chrome.extension.getBackgroundPage();

Ursus.fnGetTabsInfosRecall     = function ( cb ) {
    var queryInfo = {
        // active: true,
        // currentWindow: true
    };

    chrome.tabs.query( queryInfo, function(tabs) {
        cb(tabs);
    });
};

Ursus.pvfnTombInfoTabsChromify = function ( that ) {
    return objKeysYokedIfExited(
        that, [ "windowId", "index", "url", "active", "pinned", "openerTabId" ]
    );
};

Ursus.pvfnTombInfoWinsChromify = function ( that, nWinId ) {
    var j = objKeysYokedIfExited(
        that, [ "focused", /* // Thoes are document's: "top", "left", "width", "height" */, "tabs", "incognito", "type", "state" ]
    );

    j[ "id" ] = nWinId;

    return j;
};

Ursus.pvfnSummonWinsAndTabs    = function ( winMapped ) {
    var jDetail = { "detail":{ } };
    jDetail[ "detail" ][ "winMapped" ] = winMapped;

    winBackground.dispatchEvent( new CustomEvent( "WinsSpawnEvent", jDetail ) );
};

Ursus.pvfnSiftWinTabsGroupBy   = function ( winTabss ) {
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

            winMapped[ wid ][ "info" ] =     Ursus.pvfnTombInfoWinsChromify( jWT, wid )   ;
            winMapped[ wid ][ "tabs" ].push( Ursus.pvfnTombInfoTabsChromify( jWT      ) ) ;


            //chrome.tabs.create( Ursus.pvfnTombInfoTabsChromify( jTomb ) );
        }
    }

    return winMapped;
};


app.controller("mainController", function ($scope, $http) {
    Ursus.fnGetTabsInfos = function (  ) {
        Ursus.fnGetTabsInfosRecall(function(tabs) {
            $scope.$apply(function(){
                $scope.tabsInfo = JSON.stringify( tabs );
            });
        });
    };

    Ursus.fnSpawnTabsFromInfos = function (  ) {
        try {

            //chrome.windows.create( { url: "http://rednest.cn" } )
            var szTabsRespawnAreaIn = document.getElementById( "tabsRespawnAreaIn" ).value;
            if( szTabsRespawnAreaIn ) {
                var jTombss = [];
                if( szTabsRespawnAreaIn.startsWith( "[" ) && szTabsRespawnAreaIn.endsWith( "]" ) ) {
                    jTombss = JSON.parse( szTabsRespawnAreaIn );

                    let winMapped = Ursus.pvfnSiftWinTabsGroupBy( jTombss );
                    Ursus.pvfnSummonWinsAndTabs( winMapped );


                    return;
                }

                var jUrls = szTabsRespawnAreaIn.split( "\n" );
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
    $scope.Ursus   = Ursus;


    $scope.getTabsUrl = function() {
        Ursus.fnGetTabsInfosRecall(function(tabsUrl) {
            $scope.$apply(function(){
                $scope.urlList = tabsUrl;
            });
        });
    };

});

