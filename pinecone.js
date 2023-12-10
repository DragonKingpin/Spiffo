/**
 *  Pinecone Framework For JavaScript ( Bean Nuts Pinecone Pinecone JS Plutonium Prime Edition)
 *  Copyright © 2008 - 2024 Bean Nuts Foundation ( DR.Undefined ) All rights reserved. [Mr.A.R.B / WJH]
 *  Open Source licensed under the GPL. No Commercial Use.
 *  Tip:
 *  *****************************************************************************************
 *  Other information about this framework, such as papers, patents, etc -> http://www.rednest.cn
 *  Warning: This source code is protected by copyright law and international treaties.
 *  JS Plutonium Edition special for web-design.
 *  Pinecone JS Family [Tritium(All in one), Plutonium(this), Uranium(node.js)] 20200821
 *  *****************************************************************************************
 *  Code by Mr.A.R.B / WJH [ www.nutgit.com/ www.xbean.net / www.rednest.cn ]
 *  Include Almond, C/CPP, JAVA, PHP, Python, JavaScript, ActionScript, VB[Basic], E, Common Lisp
 *  *****************************************************************************************
 *  ;) Hope you enjoy this
 */


/**
 *  Pinecone static class like C++, using namespace to avoid name conflict.
 *  Pinecone will not recommend to modify `__proto__` or `prototype` to add new functions.
 *  Avoiding implicit `this` in javascript, we suggest to call any function explicitly.
 *  *****************************************************************************************
 *  Eg. obj.__proto__.fn = function(){...} -> obj.fn(...);  [ Chaos and implicit ] < Unknown last modifier >
 *      Namespace.fn( obj ); [ explicit and low conflict ]
 *  *****************************************************************************************
 *  If there is too long for caller like:  Namespace. ... .Namespace.Class.fn()
 *  Using namespace is very final like:    var simpleName = Namespace. ... .Namespace.Class.fn
 */
var Pinecone = {
    config:{
        "VerPine"      : 202106,
        "version"      : "2.7.0",
        "author"       : "MR.A.R.B[" + undefined + "]",
        "releaseDate"  : "20210606",
        "rootServer"   : "http://www.rednest.cn/",
        "contactInfo"  : "E-Mail:arb@rednest.cn",
        "debugMode"    : true,
        "#_ReserveNotice_" :[
            "TrialVersion", "'domQuery' precarious modified.", "Trial Matching Pinecone C/C++ FastCGI & Java Illumination Family"
        ]
    },

    init:function(pFun){
        pFun(arguments);
    },

    isDebugMode: function() {
        return Pinecone.config.debugMode;
    },

    Http: {
        queryStringMap   : undefined,
        cookiesStringMap : undefined,

        getQueryString: function(){
            var url = window.document.location.href.toString();
            var urls = url.split("?");
            if( typeof(urls[1]) == "string" ){
                return urls[1];
            }
            return "";
        },

        parseQueryString: function(){
            var szURL = Pinecone.Http.getQueryString();
            if( !szURL ){
                return {};
            }
            var urls = szURL.split("&");
            var urlChips = {};

            for( var i in urls ){
                var nodes = urls[i].split("=");
                for( var j in nodes ){
                    nodes[j] = nodes[j].split("#")[0];
                }
                var szKey = nodes[0], szValue = nodes[1];
                try {
                    szValue = decodeURIComponent( szValue.replace(/\+/g, '%20') ) ;
                }
                catch (e) {
                    console.log(e);
                }

                if( szKey.match(/\[\]/g) ){
                    if( szKey.length > 2 ){
                        szKey = szKey.replace( /\[\]/g, "" );
                    }
                    if( urlChips[szKey] === undefined ){
                        urlChips[szKey] = [];
                    }
                    urlChips[szKey].push( szValue );
                }
                else {
                    urlChips[szKey] = szValue;
                }
            }
            return urlChips;
        },

        parseCookiesString: function () {
            var debris = document.cookie.split(';');
            var map = {};
            if( debris.length === 1 && debris[0] === '' ){
                return map;
            }
            for( var i = 0; i < debris.length; i++ ) {
                var each = debris[i].trim();
                var eachs = each.split( '=' );
                if( eachs.length > 1 ){
                    var val = eachs[1];
                    try { val = JSON.parse( eachs[1] ); } catch (e) { }
                    map[ eachs[0] ] = val;
                }
                else {
                    if( Pinecone.config.debugMode ){
                        console.warn( "Illegal cookie string." )
                    }
                }
            }
            return map;
        },

        getQueryStringMap: function () {
            if( Pinecone.Http.queryStringMap === undefined ) {
                Pinecone.Http.queryStringMap = Pinecone.Http.parseQueryString();
            }
            return Pinecone.Http.queryStringMap;
        },

        getCookiesStringMap: function () {
            if( Pinecone.Http.cookiesStringMap === undefined ) {
                Pinecone.Http.cookiesStringMap = Pinecone.Http.parseCookiesString();
            }
            return Pinecone.Http.cookiesStringMap;
        }
    },

    DOMHelper:{
        dir: function(elem, dir, until) {
            var matched = [],
                cur = elem[dir];
            while (cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery(cur).is(until))) {
                if (cur.nodeType === 1) {
                    matched.push(cur);
                }
                cur = cur[dir];
            }
            return matched;
        },
        valueById   : function (exp,val) {
            var handle = document.getElementById(exp);
            if(handle){
                handle.value = val;
                return handle.value;
            }
            return null;
        },
        cssById     : function (exp,p,v) {
            var handle = document.getElementById(exp);
            if(handle){
                handle.style.setProperty(p, v);
                return handle.style;
            }
            return null;
        },
        yokeIdText  : function ( id, obj, ns ){
            if( obj && id ) {
                if( Pinecone.PrototypeTraits.isArray( id ) ){
                    for ( var i = 0; i < id.length; ++i ) {
                        Pinecone.DOMHelper.yokeIdText( id[i], obj, ns );
                    }
                }
                else if( Pinecone.PrototypeTraits.isString( id ) ){
                    var t = document.getElementById( ns ? ns + id : id );
                    if( t ){
                        t.innerText = obj[ id ];
                        return t.innerText;
                    }
                }
            }
            return null;
        },
        yokeIdVal   : function ( id, obj, ns ){
            if( obj && id ) {
                if( Pinecone.PrototypeTraits.isArray( id ) ){
                    for ( var i = 0; i < id.length; ++i ) {
                        Pinecone.DOMHelper.yokeIdVal( id[i], obj, ns );
                    }
                }
                else if( Pinecone.PrototypeTraits.isString( id ) ){
                    var t = document.getElementById( ns ? ns + id : id );
                    if( t ){
                        t.value = obj[ id ];
                        return t.value;
                    }
                }
            }
            return null;
        },
        event       : {
            add: function( obj, type, fn ) {
                if( obj.addEventListener ){
                    obj.addEventListener( type, function(ev){
                        if( fn() === false ){
                            ev.preventDefault();
                            ev.cancelBubble = true;
                        }
                    },false);
                }
                else if( obj.attachEvent ){
                    obj.attachEvent('on' + type,function(){
                        if( fn() === false ){
                            window.event.cancelBubble = true;
                            return false;
                        }
                    });
                }
            }
        },
        attrHooks   : {
            type: {
                set: function( elem, value ) {
                    var val = elem.value;
                    elem.setAttribute( "type", value );
                    if ( val ) {
                        elem.value = val;
                    }
                    return value;
                }
            }
        }
    },

    Navigate:{
        isHTTPS: function () {
            return ('https:' === document.location.protocol);
        },
        queryStringify : function ( url, kvs, judgeFirst ) {
            if( kvs ){
                var i = 0;
                for( var key in kvs ){
                    if( kvs.hasOwnProperty(key) ){
                        if ( kvs[key] ) {
                            url += ( (judgeFirst && i++ === 0) ? "?" : "&" ) + key + "=" + encodeURIComponent( kvs[key]) ;
                        }
                    }
                }
            }
            return url;
        },
        urlAutoMerge : function ( mergeData, GET ) {
            var GET_BUF = Pinecone.Objects.clone(GET);
            if(mergeData){
                for(var key in mergeData){
                    if(mergeData.hasOwnProperty(key)){
                        if(GET_BUF.hasOwnProperty(key)){
                            delete GET_BUF[key];
                        }
                        if(mergeData[key]){
                            GET_BUF[key] = mergeData[key];
                        }
                    }
                }
            }
            return (this.queryStringify(window.location.href.toString().split("?")[0],GET_BUF,true));
        },
        back         : function ( w ) {
            if( w === 1 ){
                history.back();
                return;
            }
            self.location = document.referrer;
        },
        redirect     : function ( url ){
            window.location.href = url;
        },
    },

    DateTime:{
        time2IE:function (time) {
            return time.replace(/-/g,"/");
        },
        parseTimestamp:function (time) {
            return new Date(this.time2IE(time)).valueOf();
        },
        format: function( fmt, date ) {
            date = date ? date : new Date();
            var t = {
                "M+" : date.getMonth()+1,
                "d+" : date.getDate(),
                "h+" : date.getHours(),
                "m+" : date.getMinutes(),
                "s+" : date.getSeconds(),
                "q+" : Math.floor( ( date.getMonth() + 3 ) / 3 ),
                "S"  : date.getMilliseconds()
            };
            if(/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
            }
            for(var i in t) {
                if(new RegExp("("+ i +")").test(fmt)){
                    fmt = fmt.replace(RegExp.$1, ( RegExp.$1.length === 1 ) ? (t[i]) : (("00"+ t[i]).substr((""+ t[i]).length)));
                }
            }
            return fmt;
        }
    },

    Random:{
        nextInt:function (min,max) {
            return parseInt(Math.random() * (max-min+1) + min,10);
        },
        nextString:function ( from, to, scale ) {
            if( Pinecone.PrototypeTraits.isNumber( from ) && to === undefined && scale === undefined ){
                scale = from ? from : 10;
                from = '0'; to = 'z';
            }
            if(from > to){
                return false;
            }
            var randomDict = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
            var ss = "";
            for(var i=0; i < scale; i++){
                ss = ss + randomDict[this.nextInt(randomDict.indexOf(from), randomDict.indexOf(to))];
            }
            return ss;
        },
        nextColor: function( c ) {
            return  '#' + (function(color){
                return (color +=  '0123456789abcdef'[Math.floor(Math.random()*16)])
                && (color.length === 6) ?  color : arguments.callee(color);
            })( c ? c : '');
        }
    },

    String:{
        hypertext2Text: function (t,bNoSpace,bNoLine,bSavage) {
            if( t ){
                t = t.replace(/<[^>]+>/g, '');
                if(arguments[1] !== false){
                    t = t.replace(" ","");
                }
                if(arguments[2] !== false){
                    t = t.replace(/\t|\r|\n/g,"");
                }
                if(arguments[3]){
                    t = t.replace(/<[^>]+/g, '');
                }
            } else {
                t = "";
            }
            return t;
        },
        format: function( str, args ) {
            if ( arguments.length === 2 && Pinecone.PrototypeTraits.isObject(args) ) {
                for ( var key in args ) {
                    if( args.hasOwnProperty( key ) ) {
                        str = str.replace( new RegExp("({" + key + "})", "g"), args[key] );
                    }
                }
            }
            else {
                for ( var i = 1; i < arguments.length; i++ ) {
                    if ( arguments[i] !== undefined ) {
                        str = str.replace( new RegExp("({)" + (i-1) + "(})", "g"), arguments[i] );
                    }
                }
            }
            return str;
        }
    },

    FormChecker:function (formID) {
        this.formHandle = document.getElementById(formID);
        this.alSavedElements = [];
        this.bCheckForm = true;

        this.saveFormElements = function () {
            for(var i = 0 ; i < this.formHandle.elements.length ; i++ ) {
                if("select-one" === this.formHandle.elements[i].type) {
                    this.alSavedElements.push(this.formHandle.elements[i].selectedIndex);
                    continue;
                }
                if("radio" === this.formHandle.elements[i].type || "checkbox" === this.formHandle.elements[i].type) {
                    this.alSavedElements.push(this.formHandle.elements[i].checked);
                    continue;
                }
                this.alSavedElements.push(this.formHandle.elements[i].value);
            }
        };

        this.ignoreFormCheck = function () {
            this.bCheckForm = false;
        };

        this.forceFormCheck = function() {
            this.bCheckForm = true;
        };

        this.isFormChanged = function(form) {
            var bChanged = false;
            if(form.elements.length!== this.alSavedElements.length) {
                bChanged = true;
                return bChanged;
            }
            for(var i = 0 ; i < form.elements.length ; i++ ) {
                if("submit" !== form.elements[i].type && "button" !== form.elements[i].type && "reset" !== form.elements[i].type && "hidden" !== form.elements[i].type && "radio" !== form.elements[i].type && "checkbox" !== form.elements[i].type && "select-one" !== form.elements[i].type && form.elements[i].value!==this.alSavedElements[i]) {
                    bChanged = true;
                    break;
                }
                if("select-one" === form.elements[i].type && form.elements[i].selectedIndex!== this.alSavedElements[i]) {
                    bChanged = true;
                    break;
                }
                if(("radio" === form.elements[i].type || "checkbox" === form.elements[i].type ) && form.elements[i].checked !== this.alSavedElements[i]) {
                    bChanged = true;
                    break;
                }
            }
            return bChanged;
        };

        this.getFormStatus = function() {
            return (this.bCheckForm && this.isFormChanged(this.formHandle));
        };

        this.saveFormElements();
    },

    stateRename:function (handle,stateMap,defaultNum) {
        if(!defaultNum){
            defaultNum = handle;
        }
        if(stateMap){
            var map = {};
            if(stateMap["enum"]){
                var index = stateMap["enum"].length > 1?(function () {var temp = stateMap["enum"][0];stateMap["enum"] = stateMap["enum"][1];return temp;})():0;
                for (var key in stateMap["enum"]) {
                    if(stateMap["enum"].hasOwnProperty(key)){

                        map[index++] = stateMap["enum"][key];
                    }
                }
                delete stateMap["enum"];
            }
            Pinecone.Objects.merge(stateMap,map);
            if(stateMap.hasOwnProperty(handle)){
                handle = stateMap[handle];
            }else {
                handle = defaultNum;
            }
        }
        return handle;
    },


    fuckJS: function() {
        (+function () {
            alert( "Yes fuck js, what fuck syntax it is!" );
            return !! [ ~ [], ~[] ];
        }());
    },

    about: function () {
        alert("Pinecone Ver." + this.config.version +
            " For Javascript.\nArchitect: DR.A.R.B[undefined], Long Long Int[JoeyBada$$]\n;) Hope you enjoy this");
    }
};

Pinecone.Debug = {
    jStringify  : function( any ) {
        return JSON.stringify(any);
    },
    messageBox  : function ( any ) {
        alert( this.jStringify(any) );
    },
    spawnAtHead : function ( sz ) {
        var h = document.createElement( arguments[1] ? arguments[1] : "div" );
        h.innerHTML = sz;
        document.body.insertBefore( h, document.body.firstChild );
    },
    notice      : function () {
        for( var i = 0;i < arguments.length; i++ ){
            try{
                pPine.Debug.spawnAtHead('<h1>' + Pinecone.Debug.jStringify( arguments[i] )+'</h1>');
            } catch (e) {
                console.warn( e );
            }
            console.log( "args" + i + ":",arguments[i]);
        }
    },
    probe       : function () {
        if( !arguments[0] ){
            alert( 'Pinecone: Shitty Mason Is Here !');
        }
        else{
            if( arguments[0] === true ){
                trace( 'Pinecone: pluto is a planet !');
            }
        }
        return false;
    },
    log         : function () {
        if( Pinecone.isDebugMode() ){
            for( var i = 0;i < arguments.length; i++ ){
                console.log( arguments[i] );
            }
        }
    }
};

Pinecone.domQuery = function (selector, context) { //JQStyle
    this.defun = this.prototype;
    this.defun = {
        init    : function (selector, context) {
            var nodeList = [];
            if (typeof (selector) == 'string') {
                nodeList = (context || document).querySelectorAll(selector);
            } else if (selector instanceof Node) {
                nodeList[0] = selector;
            } else if (selector instanceof NodeList || selector instanceof Array) {
                nodeList = selector;
            }
            this.length = nodeList.length;
            for (var i = 0; i < this.length; i += 1) {
                this[i] = nodeList[i];
            }
            return this;
        },
        each    : function ( fn, bRet ) {
            var res = [];
            for ( var i = 0; i < this.length; i++ ) {
                res[i] = fn.call(this[i]);
            }
            if (bRet) {
                if (res.length === 1) {
                    res = res[0];
                }
                return res;
            }
            return this;
        },
        eq      : function () {
            var nodeList = [];
            for (var i = 0; i < arguments.length; i++) {
                nodeList[i] = this[arguments[i]];
            }
            return Pinecone.domQuery(nodeList);
        },
        first   : function () {
            return this.eq(0);
        },
        last    : function () {
            return this.eq(this.length - 1);
        },
        find    : function (str) {
            var nodeList = [];
            var res = this.each(function () {
                return this.querySelectorAll(str);
            }, 1);
            if (res instanceof Array) {
                for (var i = 0; i < res.length; i++) {
                    for (var j = 0; j < res[i].length; j++) {
                        nodeList.push(res[i][j]);
                    }
                }
            } else {
                nodeList = res;
            }
            return domQuery(nodeList);
        },
        parent  : function () {
            return Pinecone.domQuery(this.each(function () {
                return this.parentNode;
            }, 1));
        },
        hide    : function () {
            return this.each(function () {
                this.style.display = "none";
            });
        },
        show    : function () {
            return this.each(function () {
                this.style.display = "";
            });
        },
        text    : function (str) {
            if (str !== undefined) {
                return this.each(function () {
                    this.innerText = str;
                });
            } else {
                return this.each(function () {
                    return this.innerText;
                }, 1);
            }
        },
        html    : function (str) {
            if (str !== undefined) {
                return this.each(function () {this.innerHTML = str;});
            } else {
                return this.each(function () {return this.innerHTML;}, 1);
            }
        },
        outHtml : function (str) {
            if (str !== undefined) {
                return this.each(function () {
                    this.outerHTML = str;
                });
            } else {
                return this.each(function () {
                    return this.outerHTML;
                }, 1);
            }
        },
        val     : function (str) {
            if (str !== undefined) {
                return this.each(function () {
                    this.value = str;
                });
            } else {
                return this.each(function () {
                    return this.value;
                }, 1);
            }
        },
        css     : function (key, value, important) {
            if( key instanceof Object && arguments.length < 2 ){
                for(var i in key){
                    if(key.hasOwnProperty(i)){
                        this.css(i,key[i]);
                    }
                }
            }else if (value !== undefined) {
                return this.each(function () {
                    this.style.setProperty(key, value,(important?'important':null));
                });
            } else {
                return this.each(function () {
                    return this.style.getPropertyValue(key);
                }, 1);
            }
        },
        attr    : function (key, value) {
            if (value !== undefined) {
                return this.each(function () {
                    this.setAttribute(key, value);
                });
            } else {
                return this.each(function () {
                    return this.getAttribute(key);
                }, 1);
            }
        },
        removeAttr  : function (key) {
            return this.each(function () {
                this.removeAttribute(key);
            });
        },
        remove      : function () {
            return this.each(function () {
                this.remove();
            });
        },
        append      : function (str) {
            return this.each(function () {
                this.insertAdjacentHTML('beforeend', str);
            });
        },
        prepend     : function (str) {
            return this.each(function () {
                this.insertAdjacentHTML('afterbegin', str);
            });
        },
        hasClass    : function (str) {
            return this.each(function () {
                return this.classList.contains(str);
            }, 1);
        },
        addClass    : function (str) {
            return this.each(function () {
                return this.classList.add(str);
            });
        },
        removeClass : function (str) {
            return this.each(function () {
                return this.classList.remove(str);
            });
        },
        click       : function (f)  {
            if (typeof (f) == "function") {
                this.each(function () {
                    this.addEventListener("click", f);
                });
            } else {
                this.each(function () {
                    var event = document.createEvent('HTMLEvents');
                    event.initEvent("click", true, true);
                    this.dispatchEvent(event);
                });
            }
        },
        tag         : function (tag) {
            this[0] = document.createElement(tag);
            return this;
        },
        dom         : function (str) {
            var dom = document.createElement('p');
            dom.innerHTML = str;
            this[0] = dom.childNodes[0];
            return this;
        },
        parents     : function () {
            return Pinecone.domQuery(this.each(function () {
                return Pinecone.DOMHelper.dir(this, "parentNode");
            }, 1));
        },
        on          : function ( szEvents, fn ){
            this.each( function () {
                var events = szEvents.split(' ');
                for ( var i = 0; i < events.length; i++  ){
                    Pinecone.DOMHelper.event.add( this, events[i], fn );
                }
            });
            return this;
        },
    };
    this.defun.init.prototype = this.defun;
    return new this.defun.init(selector, context);
};

Pinecone.PrototypeTraits = {
    typeid  : function ( t ) {
        return Object.prototype.toString.call(t);
    },
    isObject: function ( t ) {
        return null !==t && "[object Object]" === this.typeid(t);
    },
    ofObject: function ( t ) {
        return t instanceof Object;
    },
    isArray : function ( t ) {
        return "[object Array]" === this.typeid(t);
    },
    isString: function ( t ) {
        return "[object String]" === this.typeid(t);
    },
    isNumber: function ( t ) {
        return "[object Number]" === this.typeid(t);
    },
    isValidNumber: function ( t ) {
        return !isNaN(parseFloat(t)) && isFinite(t);
    },
    isBoolean: function ( t ) {
        return "[object Boolean]" === this.typeid(t);
    },
    isFunction: function ( t ) {
        return "[object Function]" === this.typeid(t);
    },
};

Pinecone.Objects = {
    // Like PHP, <String should be considered as 1 element>, mode 1-> all object using keys.length
    sizeof       : function   ( h, mode ) {
        if( h === null || h === undefined ){
            return 0;
        }
        else if( Pinecone.PrototypeTraits.isArray( h ) ){
            return h.length;
        }
        else if( Pinecone.PrototypeTraits.isObject( h ) ) {
            return Pinecone.Objects.keys(h).length;
        }

        if( h instanceof Object ){
            if( mode === 1 ){
                return Pinecone.Objects.keys(h).length;
            }
        }

        return 1; // What should we do, fuck JS, for unknown length must be only 1 element.
    },
    isEmpty      : function   ( h ) {
        var k;
        for ( k in h ) {
            return false;
        }
        return true;
    },
    clone        : function   ( hObj ) {
        var newO = {};
        for ( var key in hObj ) {
            if (hObj.hasOwnProperty(key)) {
                if (typeof hObj[key] === "object") {
                    if (hObj[key].constructor === Array) {
                        newO[key] = hObj[key].slice();
                    } else {
                        newO[key] = this.clone(hObj[key]);
                    }
                } else {
                    newO[key] = hObj[key];
                }
            }
        }
        return newO;
    },
    valueAt      : function   ( hObj, i ) {
        var j = 0;
        for ( var key in hObj ) {
            if ( j++ === i && hObj.hasOwnProperty( key ) ) {
                var buf = {};
                buf[key] = hObj[key];
                return buf;
            }
        }
    },
    keyAt        : function   ( hObj, i ) {
        var j = 0;
        for ( var key in hObj ) {
            if ( j++ === i && hObj.hasOwnProperty(key) ) {
                return key;
            }
        }
    },
    merge        : function   ( h, from, keys ) {
        if ( h && from ) {
            if( keys ){
                for ( var i = 0; i < keys.length; i++ ) {
                    if ( from.hasOwnProperty( keys[i] ) ) {
                        h[ keys[i] ] = from[ keys[i] ];
                    }
                }
            }
            else {
                for ( var key in from ) {
                    if ( from.hasOwnProperty(key) ) {
                        h[key] = from[key];
                    }
                }
            }
        }
    },
    keys         : function   ( hObj, bNotOwned ) {
        if( Object.getOwnPropertyNames && !bNotOwned ) {
            return Object.getOwnPropertyNames( hObj );
        }
        else if( Object.keys && bNotOwned ){
            return Object.keys( hObj );
        }
        else {
            var res = [];
            for ( var key in hObj ) {
                if( !hObj.hasOwnProperty(key) ){
                    if( bNotOwned ){
                        continue;
                    }
                }
                res.push( key );
            }
            return res;
        }
    },
    firstKey     : function   ( h ) {
        return Pinecone.Objects.keyAt( h, 0 );
    },
    lastKey      : function   ( h ) {
        var keys = Pinecone.Objects.keys( h );
        return keys[ h.length - 1 ];
    },
    assign       : function   ( h ) {
        if ( h  == null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }
        h  = Object( h );
        for ( var i = 1; i < arguments.length; i++ ) {
            var row = arguments[i];
            if ( row != null ) {
                for ( var key in row ) {
                    if ( Object.prototype.hasOwnProperty.call(row, key) ) {
                        h [key] = row[key];
                    }
                }
            }
        }
        return h ;
    },
    affirmObject : function   ( h ){
        var t = {};
        if( Pinecone.PrototypeTraits.isObject( h ) ){
            return h;
        }
        else if( Pinecone.PrototypeTraits.isArray( h ) ){
            for ( var i = 0; i < h.length; i++ ) {
                t[ i ] = h[ i ];
            }
        }
        else if( h === undefined || h === null ){
            return t;
        }
        else {
            t[ 0 ] = h;
        }
        return t;
    },
    affirmArray  : function   ( h ){
        var t = [];
        if( Pinecone.PrototypeTraits.isArray( h ) ){
            return h;
        }
        else if( Pinecone.PrototypeTraits.isObject( h ) ){
            for ( var k in h ) {
                if( h.hasOwnProperty( k ) ){
                    t.push( h[k] );
                }
            }
        }
        else if( h === undefined || h === null ){
            return t;
        }
        else {
            t[ 0 ] = h;
        }
        return t;
    },
    tableSearch  : function   ( obj , matchK, matchVs, keyOfWantedCol ) {
        var res = {};
        for (var i = 0; i < obj.length; i++) {
            var r = obj[i]; var t = r[matchK];
            for (var j = 0; j < matchVs.length; j++) {
                var m = matchVs[j];
                if ( t === m ) {
                    res[m] = r[keyOfWantedCol];
                }
            }
        }
        return res;
    },
    tableSearchSingle: function ( obj , matchK, matchV, keyOfWantedCol ) {
        return this.tableSearch( obj, matchK,[matchV], keyOfWantedCol )[matchV];
    }
};

Pinecone.isTotalTrue = function ( b ){ // Fuck JS, who would fucking think `[],{}` as true ????
    if( b instanceof Object ){
        return !Pinecone.Objects.isEmpty( b );
    }
    return b !== "" && !!b;
};

Pinecone.isThenSet = function( val, defaultNum ){
    return this.isTotalTrue(val) ? val : defaultNum;
};

Pinecone.domQuery.ajax = function ( hOpt ) {
    function empty() {}

    function toArray(arr,k,obj) {
        for(var i in obj){
            arr.push(encodeURI(k)+'[]='+encodeURI(obj[i]));
        }
    }

    function obj2Url(obj) {
        var arr = [];
        for (var k in obj) {
            if(obj.hasOwnProperty(k)){
                if(obj[k] instanceof Array){
                    toArray(arr,k,obj[k]);
                }else {
                    arr.push(encodeURI(k) + '=' + encodeURI(obj[k]));
                }
            }
        }
        return arr.join('&').replace(/%20/g, '+');
    }

    var opt = {
        url: '',
        sync: true,
        method: 'GET',
        data: '',
        dataType: 'json',
        username: null,
        password: null,
        success: empty,
        error: empty,
        timeout: 10000
    };

    if(!hOpt['method']){
        hOpt['method'] = hOpt['type'] ? hOpt['type'] : 'GET'
    }

    Pinecone.Objects.assign(opt, hOpt);
    var abortTimeout = null;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            xhr.onreadystatechange = empty;
            clearTimeout(abortTimeout);
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                var result = xhr.responseText;
                try {
                    if (opt.dataType === 'json') {
                        result = result.replace(' ', '') === '' ? null : JSON.parse(result);
                    }
                } catch (e) {
                    opt.error(e, xhr);
                    xhr.abort();
                }
                opt.success(result, xhr);
            } else if (0 === xhr.status) {
                opt.error("Request Failed !", xhr);
            } else {
                opt.error(xhr.statusText, xhr);
            }
        }
    };
    var data = opt.data ? obj2Url(opt.data) : opt.data;
    opt.method = opt.method.toUpperCase();
    if (opt.method === 'GET') {
        opt.url += (opt.url.indexOf('?') === -1 ? '?' : '&') + data;
    }
    xhr.open(opt.method, opt.url, opt.sync, opt.username, opt.password);
    if (opt.method === 'POST') {
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }
    if (opt.timeout > 0) {
        abortTimeout = setTimeout(function () {
            xhr.onreadystatechange = empty;
            xhr.abort();
            opt.error('Network Request Timeout !', xhr);
        }, opt.timeout);
    }
    xhr.send(data);
};

Pinecone.functions = {
    call: function( name ){
        if( !name ){
            return false;
        }
        var args = arguments[1];
        args = (args === null)?"":args;
        try{
            eval(name+"("+args+")");
        }catch (e) {
            console.log(e);
            if(e.name === "ReferenceError"){
                return false;
            }
        }
        return true;
    },
    getName: function ( functionInfo ) {
        functionInfo = functionInfo.substr('function '.length);
        return functionInfo.substr(0, functionInfo.indexOf('('));
    }
};

Pinecone.renderer = {
    autoRender: function ( selector, data ) {
        var pP = Pinecone.domQuery(selector);
        switch (pP[0].localName) {
            case ("script"):case ("select"):
            case ("input"):{
                var t = pP[0].type;
                if( t === "checkbox" && ( Pinecone.isTotalTrue(data) || data === 'true' ) ){
                    pP.attr("checked",true);break;
                }
                pP.val(data);break;
            }
            default:{
                pP.text(data);break;
            }
        }

    },
    quickRender: function( map, selector, fnKeyModifier ){
        for( var key in map ){
            if( map.hasOwnProperty(key) ){
                try{this.autoRender((fnKeyModifier?fnKeyModifier(key):(selector?selector+" "+key:key)),map[key]);}catch (e) {}
            }
        }
    },
    tag:function(key,value){
        var pHTML = document.getElementsByTagName("html")[0];
        pHTML.innerHTML = pHTML.innerHTML.replace("{{"+key+"}}",value);
    },
    formDynamicRenderer: function (dataMapArray,distinguishSuffix,independentMapArray) {
        for(var key in dataMapArray){
            if(dataMapArray.hasOwnProperty(key)){
                var oldKey = key;
                if(independentMapArray && independentMapArray.hasOwnProperty(key)){
                    key = independentMapArray[key];
                }else {
                    key += distinguishSuffix;
                }
                Pinecone.DOMHelper.valueById(key,dataMapArray[oldKey]);
            }
        }
    },
    childPages: {
        choose: function ( renderArray, who ) {
            for( var i=0; i<renderArray.length; i++ ){
                if( who === renderArray[i] ){
                    Pinecone.DOMHelper.cssById(renderArray[i],"display", "block");
                }else {
                    Pinecone.DOMHelper.cssById(renderArray[i],"display", "none");
                }
            }
        },
        autoDisplay: function( renderArray, invoker, defaultInvoker ){
            Pinecone.renderer.childPages.choose( renderArray, (invoker && renderArray.indexOf(invoker) > -1) ? invoker : defaultInvoker );
        }
    }
};

Pinecone.renderer.childPages.summoner = function ( dom, parent ) { // Child Page Dispatcher (CPD)
    "use strict";
    var proto = {};
    proto.defun = function ( dom, parent ) {
        this.dom                = dom;
        this.proto              = this;
        this.parent             = parent;
        this.namespace          = "";
        this.mfnFrontChild      = Pinecone.Objects.firstKey( this.dom );
        if( !this.mfnFrontChild ){
            return;
        }
        this.mDefaultChild      = arguments[1] ? arguments[1] : this.mfnFrontChild;
        this.mbAutoDisplay      = true;
        this.mszCurrentFun      = this.mDefaultChild;

        this.beforeSummon = function ( fn ) {
            if( Pinecone.PrototypeTraits.isFunction( fn ) ){
                fn( this.proto );
            }
            return this.proto;
        };

        this.afterGenieSummoned = function ( who ) {

        };

        this.setAutoDisplay = function (b) {
            this.mbAutoDisplay = !!b;
            return this.proto;
        };

        this.getNamespace = function () {
            return this.namespace;
        };

        this.getSelfName = function () {
            return this.mszCurrentFun;
        };

        this.getSelectorNamespace = function () {
            return "#" + this.mszCurrentFun;
        };

        this.spawnSubSelector = function ( q ) {
            return this.getSelectorNamespace()  + " " + ( q?q:"");
        };

        this.getChildrenPages = function () {
            return pPine.Objects.keys( this.dom );
        };

        this.summon = function ( w ) {
            w = w ? w : this.mDefaultChild;

            if( !this.dom.hasOwnProperty( w ) ){
                w = this.mDefaultChild;
                Pinecone.Debug.log( "JSBasedModelRenderer: Illegal Action." );
            }

            if( w ){
                try {
                    if( this.mbAutoDisplay ){
                        Pinecone.renderer.childPages.autoDisplay(
                            this.getChildrenPages(), w , this.mDefaultChild
                        );
                    }

                    this.mszCurrentFun = w;
                    var hGenie = this.dom[w];
                    if( Pinecone.PrototypeTraits.isFunction( hGenie ) ){
                        hGenie( this, w );
                    }
                    else if ( Pinecone.PrototypeTraits.isObject( hGenie ) ) {
                        hGenie["fn"]( this, w );
                    }

                    this.afterGenieSummoned( w );
                }
                catch (e) {
                    Pinecone.Debug.log( "JSBasedModelRenderer: " + e.toString(), e );
                }
            }
            else {
                Pinecone.Debug.log( "JSBasedModelRenderer: none of children given." );
            }

            return this.proto;
        };
    };

    return new proto.defun( dom, parent );
};

var $_GET    = Pinecone.Http.getQueryStringMap(),
    $_COOKIE = Pinecone.Http.getCookiesStringMap(),
    $_PINE   = Pinecone.domQuery,  pPine = Pinecone ,
    $_CPD    = Pinecone.renderer.childPages.summoner,
    $_PMVC   = Pinecone.renderer;

var sizeof     = pPine.Objects.sizeof,
    notice     = pPine.Debug.notice,
    trace      = console.log,
    probe      = pPine.Debug.probe,
    $isTrue    = pPine.isTotalTrue
;

function __FUNCTION__ () {
    return Pinecone.functions.getName(
        arguments.callee.arguments.callee.caller.toString()
    );
}