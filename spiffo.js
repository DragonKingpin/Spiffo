var objKeysYokedIfExited = function ( obj, ks ) {
    var j = {};

    for ( let i = 0; i < ks.length; i++ ) {
        let k = ks[ i ];

        if ( obj.hasOwnProperty( k ) ) {
            j[ k ] = obj[ k ];
        }
    }

    return j;
}

var Spiffo = {
    onsuccess: function ( what ) {
        console.log( `Success: ${what}` )
    },

    onerror: function ( what ) {
        console.error( `Error: ${what}` )
    }
}