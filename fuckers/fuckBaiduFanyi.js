
var fuckBaiduFanYi = function (){
    let hGuide = document.querySelector(".app-guide-close");
    if( hGuide ) {
        let hCloseBtn = hGuide;
        if( hCloseBtn ) {
            hCloseBtn.click();
            return true;
        }
    }
    return false;
};

(function () {
    fuckBaiduFanYi();
    try {
        let hFuckBaiduFanYiTimer = setInterval(function () {
            if( fuckBaiduFanYi() ) {
                console.log( "Baidu FanYi bullshit has been annihilated." );
                clearInterval( hFuckBaiduFanYiTimer );
                return 0;
            }
        }, 500);
    }
    catch (e) {
        console.log(e);
    }

})();