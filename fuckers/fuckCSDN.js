let fuckCSDNBlog = function () {
    let fuckCSDNBlogLoginMark = function () {
        let hLoginMark = document.querySelector(".passport-login-container");
        if( hLoginMark ) {
            //hLoginMark.click();
            hLoginMark.remove();
            console.log( "%cCSDN 'login-mark' has been harmonized.","color:red" )
            return true;
        }
        return false;
    };

    let fuckCSDNBlogRecommendAdBox = function () {
        let hRecommendAdBox = document.getElementById( "recommendAdBox" );
        if( hRecommendAdBox ) {
            hRecommendAdBox.remove();
            console.log( "%cCSDN 'recommendAdBox' has been harmonized.","color:red" )
        }
    };

    let fuckCSDNLoginCopy = function () {
        document.body.contentEditable = true;
    };

    fuckCSDNBlogLoginMark();
    fuckCSDNBlogRecommendAdBox();
    fuckCSDNLoginCopy();
};


(function () {
    fuckCSDNBlog();
    try {
        let hCSDNBlogTimer = setInterval(function () {
            fuckCSDNBlog();
        }, 500);
    }
    catch (e) {
        console.log(e);
    }

})();