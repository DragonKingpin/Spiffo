let fuckBilibili = function () {
    var fuckDOM = function(those) {
        if (those) {
            for (let i = 0; i < those.length; ++i) {
                let d = those[i];
                if (d) {
                    d.remove();
                    console.log("fuck this, and this!");
                }
            }
        }
    }

    let fuckBiliAd = function () {
        let ads = document.querySelectorAll(".ad-report");
        fuckDOM(ads);

        ads = document.querySelectorAll(".ad-feedback-menu.feedback-menu");
        fuckDOM(ads);

        ads = document.querySelectorAll("#slide_ad");
        fuckDOM(ads);
    }

    try{
        fuckBiliAd();
    }
    catch (e) {
        console.warn( e.toString() );
    }
};


(function () {
    try {
        let biliFuckerTimer = setInterval(function () {
            fuckBilibili();
        }, 4000);
    }
    catch (e) {
        console.log(e);
    }

})();