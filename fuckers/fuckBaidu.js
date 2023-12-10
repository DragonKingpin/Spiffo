function eval_unique_then_click ( these ) {
    if( these && these.length > 0 ) {
        these[ 0 ].click();
        return true;
    }
    return false;
}

function click_unique_by_class ( sz ) {
    if( eval_unique_then_click( document.getElementsByClassName( sz ) ) ){
        console.log( "Oh ! Fuck this '" + sz + "' !" )
    }
}


var BaiduFucker = {
    mnAdsCount      : 0,
    mnWenKuLoginCnt : 0,

    fnParentUntil: function ( that, fnStop ) {
        var p = that.parentNode;
        while ( p ) {
            if( fnStop( p ) ){
                break;
            }
            p = p.parentNode;
        }
        return p;
    },

    fnCountAds: function (n) {
        BaiduFucker.mnAdsCount += n;
    },

    fnFuckByInnerWithParent : function ( ads ){
        length = ads.length;
        BaiduFucker.fnCountAds(length);
        for( var i=0; i < length; i++ ){
            var p = ads[i];
            if( p && p.innerText === "广告" && (p = p.parentNode.parentNode) ){
                p = BaiduFucker.fnParentUntil( p, function( p ) {
                    if( p.tagName.toLowerCase() === "div" && p.classList.length >= 5 ){
                        return true;
                    }
                } );
                if( p ){
                    p.remove();
                }
            }
        }
    },

    fnFuckByNewShitWithParent : function ( ads ){
        length = ads.length;
        BaiduFucker.fnCountAds(length);
        for( var i=0; i < length; i++ ){
            var p = ads[i];
            if( p && p.innerText === "广告" && (p = p.parentNode.parentNode) ){
                p.remove();
            }
        }
    },

    fnBaiduIsGay : function () {
        console.log( "%cBaidu is motherfucker and cocksucker gay !!!! Fuck baidu to death !!!", "color: red" );
    }
};

var purgeBaiduAd        = function () {
    var hAdRight = document.getElementById("content_right");
    if( hAdRight ){
        hAdRight.remove()
    }

    var hAdRS = document.getElementById("rs");
    if( hAdRS ){
        hAdRS.remove()
    }


    var ads = document.querySelectorAll(".c-abstract");
    var length = ads.length;
    for( var i=0;i<length;i++){
        var nodeBuf = ads[i].parentNode.parentNode;
        if( nodeBuf && nodeBuf.id !== "content_left"
            && nodeBuf.getAttribute("data-pos") ){
            nodeBuf.remove();
        }
    }


    ads = document.querySelectorAll(".ec_tuiguang_pplink");
    BaiduFucker.fnFuckByInnerWithParent( ads );

    ads = document.querySelectorAll(".c-gap-left span"); // ec-tuiguang 20210707
    BaiduFucker.fnFuckByInnerWithParent( ads );

    ads = document.querySelectorAll(".se_st_footer a");
    BaiduFucker.fnFuckByNewShitWithParent( ads );
};

var purgeUCAd           = function () {
    try {
        var t = document.querySelectorAll(".m-media")[0];
        if( t ){
            t.remove();
        }
    }catch (e) {
        console.log(e);
    }

    try {
        var t = document.getElementById("J_shopping");
        if( t ){
            t.remove();
        }
    }catch (e) {
        console.log(e);
    }

    try {
        var t = document.getElementById("J_recreation");
        if( t ){
            t.remove();
        }
    }catch (e) {
        console.log(e);
    }
};

var purgeBaiduWenkuShit = function () {
    click_unique_by_class( "next-step" );
    click_unique_by_class( "next-step" );
    click_unique_by_class( "next-step" );

    this.mfnFuckerLogin = function () {
        hBtnClose = document.querySelector( "#passport-login-pop .close-btn" );
        if( hBtnClose && BaiduFucker.mnWenKuLoginCnt < 1 ) {
            hBtnClose.click();
            ++BaiduFucker.mnWenKuLoginCnt;
        }
    }

    this.mfnFuckerLogin();
};

(function () {
    purgeBaiduAd();
    purgeUCAd();
    purgeBaiduWenkuShit();
    let id = setInterval(function () {
        try {
            purgeBaiduAd();
            purgeUCAd();
            purgeBaiduWenkuShit();
        }
        catch (e) {
            console.log(e);
        }
    }, 500);
    BaiduFucker.fnBaiduIsGay();
})();


