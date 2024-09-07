var S_ZH_LOGIN_COUNTER = 0

let fuckZhiHu = function () {
    let fuckZhiHuLoginMark = function () {
        let hLoginMark = document.querySelector(".signFlowModal .Modal-closeIcon");
        if( hLoginMark && hLoginMark.length > 0 ) {
            hLoginMark = hLoginMark[0];
        }
        if( hLoginMark && hLoginMark.parentNode ) {
            hLoginMark = hLoginMark.parentNode;
            hLoginMark.click();
            hLoginMark.parentNode.parentNode.remove();
            console.log( "%cZhihu '.signFlowModal .Modal-closeIcon' has been fucked.","color:red" )
            return true;
        }
        return false;
    };

    let fuckZhiHuAd = function () {
        let hBannerLinks = document.querySelectorAll(".Banner-link");
        if( hBannerLinks ){
            for( var i = 0; i < hBannerLinks.length; i++ ) {
                if( hBannerLinks[i].parentNode ){
                    hBannerLinks[i].parentNode.remove();
                }
            }
        }

        let hPcFeedAdBtns = document.querySelectorAll(".Pc-feedAd-container .advert-signpc-popup-menu button");
        if( hPcFeedAdBtns ){
            for( var i = 0; i < hPcFeedAdBtns.length; i++ ) {
                if( hPcFeedAdBtns[i].click ){
                    hPcFeedAdBtns[i].click();
                    console.log( "%c ZhiHu Ad has been fucked!","color:green" );
                }
            }
        }

        let hPcWordAdBtns = document.querySelectorAll(".Pc-word-card-sign .Pc-word-card-sign-popup-menu button");
        if( hPcWordAdBtns ){
            for( var i = 0; i < hPcWordAdBtns.length; i++ ) {
                if( hPcWordAdBtns[i].click ){
                    hPcWordAdBtns[i].click();
                    console.log( "%c ZhiHu Ad(Word) has been fucked!","color:green" );
                }
            }
        }

        let hPcFeedAd = document.querySelectorAll(".Pc-feedAd-container");
        if( hPcFeedAd ){
            for( var i = 0; i < hPcFeedAd.length; i++ ) {
                if( hPcFeedAd[i].parentNode ){
                    hPcFeedAd[i].parentNode.remove();
                }
            }
        }

        let fuck_topSearch_items = document.querySelectorAll(".TopSearch-items");
        if( fuck_topSearch_items ){
            for( var i = 0; i < fuck_topSearch_items.length; i++ ) {
                if( fuck_topSearch_items[i] ){
                    fuck_topSearch_items[i].remove();
                }
            }
        }

    }

    try {
        if ( S_ZH_LOGIN_COUNTER < 2 ) {
            if( fuckZhiHuLoginMark() ) {
                ++S_ZH_LOGIN_COUNTER;
            }
        }
    }
    catch (e) {
        console.warn( e.toString() );
    }

    try{
        fuckZhiHuAd();
    }
    catch (e) {
        console.warn( e.toString() );
    }
};


(function () {
    fuckZhiHu();
    try {
        let hZhiHuFuckerTimer = setInterval(function () {
            fuckZhiHu();
        }, 500);
    }
    catch (e) {
        console.log(e);
    }

})();