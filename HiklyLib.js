define(function (require, exports, module) {

    //框架基础入口类
    var hiklyLib = function (config) {
            this.init(config)
        },
        hiklyUitl = function () {};

    //定义全局变量
    window.App = {
        Models: {},
        Views: {},
        Collections: {},
        Router: {},
        util: {}
    };

    //全局html代码片段缓存
    window.htmlCache = {};


    /**
     * underscore template settings
     */
    _.templateSettings = {
        evaluate: /{([\s\S]+?)}/g,
        interpolate: /{=([\s\S]+?)}/g,
        escape: /{-([\s\S]+?)}/g
    };

    /**
     * 加载内容
     * @author xiangxiao
     * @date   2015-07-06
     * @param  {[type]}   loadType [加载类型]
     * @param  {[type]}   path     [路径]
     * @param  {[type]}   key      [模块命]
     */
    hiklyUitl.prototype.loadContent = function (loadType, path, key) {
        window.App.Router.navigate(loadType + path + "/" + key, {
            trigger: true,
            replace: false
        });
    }

    /**
     * 根据模块加载路径
     * @author lisanchuan
     * @date   2015-07-06
     * @param  {[type]}   contentId  [对应加载到哪个id下，最好对应是div]
     * @param  {[type]}   CSSPath    [css路径]
     * @param  {[type]}   HtmlPath   [html路径]
     * @param  {[type]}   jsPathData [js路径]
     */
    hiklyUitl.prototype.loadModForPath = function (contentId, CSSPath, HtmlPath, jsPathData) {
        if (CSSPath && CSSPath != "") {
            require.async(CSSPath, function () {
                window.App.util.switchMod(contentId, jsPathData.key, HtmlPath, jsPathData)
            })
        } else {
            window.App.util.switchMod(contentId, jsPathData.key, HtmlPath, jsPathData)
        }
    }

    /**
     * 模块间的切换， 用于特殊场景传入id来控制页面的.js-[模块名称]的切换
     * @author lisanchuan
     * @date   2015-07-06
     * @param  {[type]}   contentId [对应div]
     * @param  {[type]}   key       [模块名称]
     * @param  {[type]}   HtmlPath  [html]
     */
    hiklyUitl.prototype.switchMod = function (contentId, key, HtmlPath, jsPathData) {
        switchModFun(key, contentId);
        if ($(".js-" + key).length > 0) {
            $(".js-" + key).removeClass('hide');
            window.App.util.loadJS(jsPathData, contentId, true);
        } else {
            var htmlData = this.loadPartials(HtmlPath, true);
            $(document).ready(function () {
                $(contentId).append(htmlData);
                $('[data-toggle="searchTool"]').each(function () {
                    $(this).searchTool("show");
                });
                $('.data-search').each(function () {
                    $(this).searchTool("show");
                });
                window.App.util.loadJS(jsPathData, contentId, true);
            })

        }
    }

    /**
     * 加载js
     * @author xiangxiao
     * @date   2015-07-06
     * @param  {[type]}   pathData [js路径文件]
     * @param  {[type]}   modFlag  [判断模块是要被隐藏或删除]
     * @return {[type]}            [description]
     */
    hiklyUitl.prototype.loadJS = function (jsPathData, contentId, modFlag) {
        var path = jsPathData.path;
        var key = jsPathData.key;
        var cnd = jsPathData.cnd;
        if (window.App.Models[key]) {
        	//同时兼容refresh和refsh两种刷新方法
        	if( window.App.Models[key].refresh){
        		window.App.Models[key].refresh(cnd);
        	}
            if( window.App.Models[key].refsh){
            	window.App.Models[key].refsh(cnd);
            }
        } else {
            require.async(path, function (cb) {
                if (cb) {
                    var ap = new cb(cnd);
                    window.App.Models[key] = ap;
                } else {
                    //alert('模块加载失败！');
                }
            })
        }
    }

    /**
     * 判断模块是要被隐藏或删除
     * @author xiangxiao
     * @date   2015-07-06
     * @param  {[type]}   currentKey [是否被删除]
     */
    var switchModFun = function (currentKey, contentId) {
        $(contentId + " .js-app").each(function (index, el) {
            var key = $(el).attr("modId");
            if (key == currentKey) {
                return;
            } else if ($(".js-" + key).find(".js-" + currentKey).length > 0) {
                return;
            } else {
                var app = window.App.Models[key];
                if (app) {
                    if (!app.switchType) {
                    	if(app.remove){
                    		app.remove();
                            delete window.App.Models[key];
                    	}else{
                    		$(el).remove();
                    	}
                    } else if (app.switchType == "hide") {
                        $(el).addClass('hide');
                    }
                }
            }
        });
    }

    /**
     * 加载HTML数据
     * @author xiangxiao
     * @date   2015-07-06
     * @param  {[type]}   path    [html路径]
     * @param  {[type]}   modFlag [description]
     * @return {[type]}           [description]
     */
    hiklyUitl.prototype.loadPartials = function (path, modFlag) {
        var cData = {};
        var ps = path.split("/");
        var key = ps[ps.length - 1];
        if (window.htmlCache[path]) {
            cData = window.htmlCache[path].clone(); //如果有缓存，从缓存取
        } else {
            $.ajax({
                    url: path,
                    async: false,
                    dataType: 'html',
                    actionFlag: false
                })
                .done(function (data) {
                    cData = data

                    var rD = $(data)
                    if (modFlag) {
                        rD.attr("modId", key.split(".")[0]);
                        rD.addClass('js-app');
                        rD.addClass('js-' + key.split(".")[0]);
                    }
                    window.htmlCache[path] = rD.clone();

                    cData = rD;
                })
        }
        return cData
    }



    /**
     * 添加一个less的样式表
     * @author xiangxiao
     * @date   2015-07-06
     * @param  {[type]}   path [description]
     */
    hiklyUitl.prototype.addLess = function (path) {
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.href = path;
        link.rel = 'stylesheet/less';
        link.type = 'text/css';
        head.appendChild(link);
    };

    hiklyUitl.prototype.buildPath = function (path) {
        path = this.cleanPath(path);
        var ps = path.split("/");
        var key = ps[ps.length - 1];
        var p = {
            "path": path,
            "key": key,
            "cnd": ""
        };
        if (key.indexOf(":") != -1) {
            p.path = path.split(":")[0];
            p.key = key.split(":")[0];
            p.cnd = key.split(":")[1];
        }
        return p;
    }


    hiklyUitl.prototype.cleanPath = function (path) {
        if (path.indexOf("&&") != -1) {
            path = path.split("&&")[0]
        }

        if (path.indexOf("#") != -1) {
            path = path.replace("#", "");
        }

        if (path.substr(path.length - 1, 1) == "/") {
            path = path.substring(0, path.length - 1);
        }


        return path;
    }

    //把数字转成中文数字
    var N = [
        "零", "一", "二", "三", "四", "五", "六", "七", "八", "九"
    ];

    hiklyUitl.prototype.convertToChinese = function (num) {
        var str = num.toString();
        var len = num.toString().length;
        var C_Num = [];
        for (var i = 0; i < len; i++) {
            C_Num.push(N[str.charAt(i)]);
        }
        return C_Num.join('');
    }

    hiklyUitl.prototype.isArray = function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }


    //合并两个JOSNOBJECT
    hiklyUitl.prototype.mergeJsonObject = function (jsonbject1, jsonbject2) {
        var resultJsonObject = {};
        for (var attr in jsonbject1) {
            resultJsonObject[attr] = jsonbject1[attr];
        }
        for (var attr in jsonbject2) {
            resultJsonObject[attr] = jsonbject2[attr];
        }

        return resultJsonObject;
    };

    /**
     **获取浏览器大小
     **/
    hiklyUitl.prototype.getPageSize = function () {
        var xScroll, yScroll;
        if (window.innerHeight && window.scrollMaxY) {
            xScroll = window.innerWidth + window.scrollMaxX;
            yScroll = window.innerHeight + window.scrollMaxY;
        } else {
            if (document.body.scrollHeight > document.body.offsetHeight) { // all but Explorer Mac    
                xScroll = document.body.scrollWidth;
                yScroll = document.body.scrollHeight;
            } else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari    
                xScroll = document.body.offsetWidth;
                yScroll = document.body.offsetHeight;
            }
        }
        var windowWidth, windowHeight;
        if (self.innerHeight) { // all except Explorer    
            if (document.documentElement.clientWidth) {
                windowWidth = document.documentElement.clientWidth;
            } else {
                windowWidth = self.innerWidth;
            }
            windowHeight = self.innerHeight;
        } else {
            if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode    
                windowWidth = document.documentElement.clientWidth;
                windowHeight = document.documentElement.clientHeight;
            } else {
                if (document.body) { // other Explorers    
                    windowWidth = document.body.clientWidth;
                    windowHeight = document.body.clientHeight;
                }
            }
        }
        // for small pages with total height less then height of the viewport    
        if (yScroll < windowHeight) {
            pageHeight = windowHeight;
        } else {
            pageHeight = yScroll;
        }
        // for small pages with total width less then width of the viewport    
        if (xScroll < windowWidth) {
            pageWidth = xScroll;
        } else {
            pageWidth = windowWidth;
        }
        var OBJPageSize = {
            pageWidth: pageWidth,
            pageHeight: pageHeight,
            windowWidth: windowWidth,
            windowHeight: windowHeight
        };
        return OBJPageSize;
    }



    hiklyUitl.prototype.fullHikHeight = function () {
        if ($('.hik-center').length > 0) {
            $('.hik-center').css("height", $(window).height() - $('.hik-center').offset().top);
        }
    }

    hiklyUitl.prototype.getHikHeight = function (num, topHeight) {
        return $(window).innerHeight() - (topHeight ? topHeight : 62) - num; //62为banner条的高度
    }


    /** 
     * 下面是一些基础函数，解决mouseover与mouserout事件不停切换的问题（问题不是由冒泡产生的） 
     */
    hiklyUitl.prototype.checkHover = function (e, target) {
        if (window.App.util.getEvent(e).type == "mouseover") {
            return !window.App.util.contains(target, window.App.util.getEvent(e).relatedTarget || window.App.util.getEvent(e).fromElement) && !((window.App.util.getEvent(e).relatedTarget || window.App.util.getEvent(e).fromElement) === target);
        } else {
            return !window.App.util.contains(target, window.App.util.getEvent(e).relatedTarget || window.App.util.getEvent(e).toElement) && !((window.App.util.getEvent(e).relatedTarget || window.App.util.getEvent(e).toElement) === target);
        }
    };

    hiklyUitl.prototype.contains = function (parentNode, childNode) {
        if (parentNode.contains) {
            return parentNode != childNode && parentNode.contains(childNode);
        } else {
            return !!(parentNode.compareDocumentPosition(childNode) & 16);
        }
    };
    //取得当前window对象的事件  
    hiklyUitl.prototype.getEvent = function (e) {
        return e || window.event;
    }



    hiklyLib.prototype.init = function (config) {
        //加载util工具类
        window.App.util = new hiklyUitl();
        //初始化路由
        var autoRouter = Backbone.Router.extend({
            routes: {
                //加载path路径下的JS 最后一层为js文件名
                'loadJs/*path': 'loadJS',
                //加载path路径下的html片段 最后一层为html文件名 
                'loadPartials/*path': 'loadPartials'
            },
            loadJS: function (path) {
                var pData = window.App.util.buildPath(path);
                window.App.util.loadJS(pData);
            },
            loadPartials: function (path) {
                var pData = window.App.util.buildPath(path);
                window.App.util.loadPartials(pData);
            }
        });
        window.App.Router["main"] = new autoRouter();

        if (config.baseViewPath) {
            require.async(config.baseViewPath, function (baseView) {
                window.App.Models.baseView = new baseView();
                Backbone.history.start();
            })
        } else {
            Backbone.history.start();
        }
        //初始化首页
    };


    /**
     * 观查者模式定义 全局事件订阅
     */
    var topics = {},
        subUid = -1,
        pubsubz = {};

    //发行
    pubsubz.publish = function (topic, args) {

        if (!topics[topic]) {
            return false;
        }

        setTimeout(function () {
            var subscribers = topics[topic],
                len = subscribers ? subscribers.length : 0;
            while (len--) {
                subscribers[len].func(topic, args);
            }
        }, 0);

        return true;

    };

    //订阅
    pubsubz.subscribe = function (topic, func) {

        if (!topics[topic]) {
            topics[topic] = [];
        }

        var token = (++subUid).toString();
        topics[topic].push({
            token: token,
            func: func
        });
        return token;
    };

    //取消订阅
    pubsubz.unsubscribe = function (token) {
        for (var m in topics) {
            if (topics[m]) {
                for (var i = 0, j = topics[m].length; i < j; i++) {
                    if (topics[m][i].token === token) {
                        topics[m].splice(i, 1);
                        return token;
                    }
                }
            }
        }
        return false;
    };


    //全局事件订阅
    window.PubSub = pubsubz;

    module.exports = hiklyLib;

});
