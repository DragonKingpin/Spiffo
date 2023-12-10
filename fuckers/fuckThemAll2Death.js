//Baidu Shits------
//https://cpro.baidu.com
//drmcmm.baidu.com
//pos.baidu.com
//hm.baidu.com
//------------------------

var purgeADsByGoogle = function () {
    try {

        SimpleFilter:{
            var t = document.querySelectorAll(".adsbygoogle")[0];
            if( t ){
                t.remove();
            }
        }

    }catch (e) {
        console.log(e);
    }
};

var purgeADsByBaiduOrGoogle = function () {
    try {

        CrapComplexLevel1:{
            var shitAdsArrayProbable = document.querySelectorAll("iframe");
            for (var index in shitAdsArrayProbable){
                var row = shitAdsArrayProbable[index];
                var src = row.src;
                if( src && src.indexOf("pos.baidu") >= 0 ){
                    row.remove();
                }

                var _id = row.id;
                if( _id && _id.indexOf("google_ads") >= 0 ){
                    row.remove();
                }
            }
        }

    }
    catch (e) {
        console.log(e);
    }
};

(function () {
    purgeADsByGoogle();
    purgeADsByBaiduOrGoogle();
    try {
        let id = setInterval(function () {
            purgeADsByGoogle();
            purgeADsByBaiduOrGoogle();
        }, 500);
    }
    catch (e) {
        console.log(e);
    }

})();