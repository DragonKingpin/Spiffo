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

    renderTabTitle: function ( tabs ) {
        if( tabs ) {
            Spiffo.tabControl.thisTab = tabs[ 0 ];
            Spiffo.tabControl.$scope.$apply(function(){
                Spiffo.tabControl.$scope.currentTabTitle = Spiffo.tabControl.thisTab.title;
            });
        }
    },

    redirectRenameExecuteToTab: function ( activatedTab, bLockAppend ) {
        chrome.scripting.executeScript({
            target: { tabId: activatedTab[0].id },
            func: Spiffo.tabControl.setTabTitle,
            args: [ document.querySelector( "#title-editor" ).value, bLockAppend ]
        });
    }
};


Spiffo.app.controller("tabControlController", function ($scope, $timeout) {
    $scope.Spiffo  = Spiffo;
    Spiffo.tabControl.$scope = $scope;
    $scope.titleIsLocked = false;

    var self = this;
    self.checkTitleLockStatus = function () {
        var thisUrl = Spiffo.tabControl.thisTab.url;
        chrome.storage.sync.get(thisUrl, function(data) {
            var bIsLock       = !!( data[ thisUrl ] && data[ thisUrl ][ "lock"       ] );
            var bIsLockAppend = !!( data[ thisUrl ] && data[ thisUrl ][ "appendMode" ] );

            $timeout(function() {
                $scope.titleIsLocked = bIsLock;
                $scope.titleIsLockedAppend = bIsLockAppend;
            });
            console.log( bIsLockAppend )
        });
    };

    self.checkBodyContentEditableStatus = function ( tabs ) {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: function() {
                return document.body.contentEditable === 'true';
            }
        }, function(results) {
            if ( chrome.runtime.lastError ) {
                if( chrome.runtime.lastError.message.indexOf( "Cannot access a chrome://" ) >= 0 ) {
                    return; // Just ignore them.
                }
                console.error(JSON.stringify( chrome.runtime.lastError ));
                return;
            }

            var isContentEditable = results[0].result;

            $timeout(function() {
                $scope.bodyContentEditable = isContentEditable;
            });
        });
    };

    chrome.tabs.query(
        {active: true, currentWindow: true},
        function ( tabs ) {
            Spiffo.tabControl.renderTabTitle( tabs );

            self.checkTitleLockStatus();
            self.checkBodyContentEditableStatus( tabs );
        }
    );

    Spiffo.tabControl.fnRenameThis = function ( bLockAppend ) {
        chrome.tabs.query({active: true, currentWindow: true},
            function ( tabs ) {
                Spiffo.tabControl.redirectRenameExecuteToTab( tabs, bLockAppend );
            }
        );
    };

    Spiffo.tabControl.fnSetLockTitleStatus = function( bStatus, bLockAppend ) {
        var url = Spiffo.tabControl.thisTab.url;
        var customTitle = $_PINE("#title-editor").val();

        var titleData = {};
        titleData[ url ] = {};
        titleData[ url ][ "title"      ] = customTitle;
        titleData[ url ][ "lock"       ] = bStatus;
        titleData[ url ][ "appendMode" ] = bLockAppend;
        chrome.storage.sync.set(titleData, function() {
            Spiffo.tabControl.fnRenameThis( bLockAppend );
            Spiffo.tabControl.$scope.$apply(function(){
                $scope.titleIsLocked       = bStatus;
                $scope.titleIsLockedAppend = bLockAppend;
            });
            trace( "Custom title saved for: " , titleData );
        });
    };


    Spiffo.tabControl.setContentEditableStatus = function( bStatus ) {
        var fnSetSelector = function () {
            return bStatus ? function () {
                document.body.contentEditable = 'true';
                return document.body.contentEditable === 'true';
            } : function () {
                document.body.contentEditable = 'inherit';
                return document.body.contentEditable === 'true';
            };
        }

        chrome.tabs.query(
            {active: true, currentWindow: true},
            function ( tabs ) {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: fnSetSelector()
                }, function(results) {
                    if ( chrome.runtime.lastError ) {
                        console.error( chrome.runtime.lastError );
                        return;
                    }

                    var isContentEditable = results[0].result;

                    Spiffo.tabControl.$scope.$apply(function(){
                        $scope.bodyContentEditable = isContentEditable;
                    });
                });
            }
        );
    };
});