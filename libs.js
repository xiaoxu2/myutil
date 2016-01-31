/**
 * cms2.0项目js包，暂时所用功能往里面放
 * @author xiangxiao
 * @date   2014-11-03
 */
(function($) {

    /**
     * 验证字符串是否符合长度
     * 注：中文算两个字符
     * @author chenguanbin
     * @date   2015-09-18
     * @param  {String}   str 传入的字符串
     * @param  {Number}   len 指定的长度
     * @return {Boolean}       验证是否通过
     */
    $.validStrLen = function(str, len){
        var chars, charsCn, charsLen;
        if(typeof str === 'string'){
            chars = str.match(/[^\u4e00-\u9fa5]/g) || [];
            charsCn = str.match(/[\u4e00-\u9fa5]/g) || [];
            charsLen = chars.length + charsCn.length * 2;
            if(charsLen <= len){
                return true;
            } else{
                return false;
            }
        }
        return false;
    };

    /**
     * 根据传入的天数和小时数计算日期
     * @author chenguanbin
     * @date   2015-11-16
     * @param  {int}   day  天数（可为负数，负数则计算过去的天数）
     * @param  {int}   hour  小时数（可为负数，负数则计算过去的小时）
     * @param  {string}   format  格式化字符串（可省略，省略则返回Date）
     * @return {string | date}      若传入格式化字符串，则返回格式化后的日期字符串，否则返回日期对象
     */
    $.getDate = function(day, hour, format){
        var now = new Date(),
            time = (day ? parseInt(day, 10) * 24 * 3600 * 1000 : 0) + (hour ? parseInt(hour, 10) * 3600 * 1000 : 0),
            date = new Date(now.getTime() + time);
        // 根据是否格式化返回日期
        if(format) {
            return date.format(format);
        } else{
            return date;
        }
    };

    /**
     * 生成随机id
     * @author chenguanbin
     * @date   2015-10-19
     * @return {Boolean}       随机生成的guid
     */
    $.newGuid =  function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
            function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            }).toUpperCase();
    };

    /**
     * cookie
     * @author xiangxiao
     * @date   2014-11-06
     * @param  {[type]}   name  [description]
     * @param  {[type]}   value [description]
     */
    $.setCookie = function(name, value) {
        //获取当前时间
        var date = new Date();
        var expiresDays = 3650;
        //将date设置为10天以后的时间
        date.setTime(date.getTime() + expiresDays * 24 * 3600 * 1000);
        //将userId和userName两个cookie设置为3650天后过期
        document.cookie = name + "=" + value + ";expires=" + date.toGMTString() + ";path=/";
    }
    $.getCookie = function(name) {
        //取出cookie
        var strCookie = document.cookie;
        //cookie的保存格式是 分号加空格 "; "
        var arrCookie = strCookie.split("; ");
        for (var i = 0; i < arrCookie.length; i++) {
            var arr = arrCookie[i].split("=");
            if (name == arr[0]) {
                return arr[1];
            }
        }
        return "";
    };
    /**
     * 消息机制，用于模块间解耦
     * @author xiangxiao
     * @date   2014-11-06
     * $.injection("name", fun)
     * $.injection("name", arguments)
     */
    var hik_temp_message = {};
    $.injection = function(name) {
            if (arguments.length === 2 && typeof arguments[1] === "function") {
                hik_temp_message[name] = arguments[1];
                return
            }
            var arr = [];
            if (hik_temp_message[name]) {
                for (var i = 1; i < arguments.length; i++) {
                    arr.push(arguments[i])
                }
                hik_temp_message[name].apply(null, arr);
            }
        }
        /**
         * resize flexigrid and other box
         * @author xiangxiao
         * @date   2014-11-03
         * @return {[type]}   [description]
         */
    $.getHikHeight = function(num, topHeight) {
        if(window.location.href.match("_cs")){
            return $(window).innerHeight() - (topHeight ? topHeight : 62) - num + 90; //根据cs端的页面做了控制
        }
        return $(window).innerHeight() - (topHeight ? topHeight : 62) - num; //62为banner条的高度
    }
    $.getCommonGridHeight = function() {
            return $.getHikHeight(80);
        }
        //所有class为hik-content的容器默认高度，有待改善 xx 20141109
    $(document).ready(function() {
        $(".hik-content").height($.getHikHeight(80)); //80 为center的工具栏底部到banner的高度
        $(".hik-center").height($.getHikHeight(44)); //44 为center到banner的高度
    })

    $(window).resize(function() {
        $(".hik-content").height($.getHikHeight(80));
        $(".hik-center").height($.getHikHeight(44));
        if ($(".hikFlexigrid").length > 0) {
            $(".hikFlexigrid").fixHeight($.getHikHeight(80));
        }
    });

    jQuery.getJSON = function(url, data, callback) {
        return jQuery.post(url, data, callback, "json");
    };

    /**
     * 原始的序列化方法
     * @author xx
     * @date    2014-12-24
     */
    $.fn._serialize = function() {
            return jQuery.param(this.serializeArray());
        }
        /**
         * 重写序列化方法
         * @author xx
         * @date   2014-12-08
         */
    $.fn.serialize = function(boo) {
        var r20 = /%20/g,
            rbracket = /\[\]$/,
            rCRLF = /\r?\n/g,
            rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
            rselectTextarea = /^(?:select|textarea)/i;

        var obj = {},
            arr = this.map(function() {
                return this.elements ? jQuery.makeArray(this.elements) : this;
            })
            .filter(function() {
                return this.name && !this.disabled &&
                    (this.checked || rselectTextarea.test(this.nodeName) ||
                        rinput.test(this.type));
            })
            .map(function(i, elem) {
                var val = jQuery(this).val();

                return val == null ? null : jQuery.isArray(val) ?
                    jQuery.map(val, function(val, i) {
                        return {
                            name: elem.name,
                            value: val.replace(rCRLF, "\r\n")
                        };
                    }) : {
                        name: elem.name,
                        value: val.replace(rCRLF, "\r\n")
                    };
            }).get();

        $.each(arr, function(n, index) {
            if (obj.hasOwnProperty(index.name)) {
                if (jQuery.isArray(obj[index.name])) {
                    obj[index.name].push(index.value);
                } else {
                    obj[index.name] = [obj[index.name], index.value];
                }
                //如果是checkbox必定返回是数组 xx 2014/12/15
            } else if (index.name.indexOf(".") == -1 && jQuery("[name=" + index.name + "]").attr("type") == "checkbox") {
                obj[index.name] = [index.value];
            } else {
                obj[index.name] = index.value;
            }
        })
        return obj;
    };
    $.fn.unserialize = function(obj) {
            var rinput = /^(?:select|color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
                rhtml = /^(?:label|span|div)$/i,
                rselectTextarea = /^(?:select|textarea)/i,
                that = this;
            if (!obj) {
                return false;
            }
            $.each(obj, function(key, value) { //待优化
                var el = $("[name=" + key + "]", $(that))[0];
                if (el && (rinput.test(el.type) || rselectTextarea.test(el.nodeName))) {
                    $(el).val(value);
                } else if (el && rhtml.test(el.nodeName)) {
                    $(el).html(value);
                    //checkbox 特殊处理
                } else if ($(el).attr("type") == "radio") {
                    $("[name=" + key + "][value=" + value + "]", $(that)).attr("checked", "checked");
                } else if ($(el).attr("type") == "checkbox") {
                    if (value === "true" || value == "1") {
                        $(el).attr("checked", "checked");
                    }
                }
            })
        }
        /**
         * 加载css 和 js 通用方法
         * @author xiangxiao
         * @date   2014-10-31
         * @return {[type]}   [description]
         */
    $.loadurl = function() {
            //is action url
            if (arguments && arguments.length == 1 && arguments[0].indexOf("action") > -1) {
                var arr = arguments[0].split("!");
                return "../" + arr[0] + "/" + arr[1];
            }
            //is other url
            var headElement = document.getElementsByTagName("head")[0];
            $.each(arguments, function(index, value) {
                if (value.indexOf(".css") > -1) {
                    var link = document.createElement('link');
                    link.href = value;
                    link.rel = 'stylesheet';
                    link.type = 'text/css';
                    headElement.appendChild(link);
                } else if (value.indexOf(".js") > -1) {
                    var script = document.createElement('script');
                    script.src = value;
                    script.type = 'text/javascript';
                    headElement.appendChild(script);
                }
            })
        }
        /**
         * 对比2个对象，
         * @author xx
         * @date   2014-11-29
         */
    $.objectEqual = function(a, b, boo) {
        for (var i in a) {
            if (a[i] != b[i]) {
                return false
            }
        }
        if (!boo) {
            for (var j in b) {
                if(j == "_status" || j == "flexigrid_index"){
                    continue;
                }
                if (b[j] != a[j]) {
                    return false
                }
            }
        }
        return true;
    }


    /**
     * 毫秒类型的时间转化对讲字符显示时间格式
     * @author chenkaixia
     * @date   2014-11-10
     * @return {[type]}   [String]
     */
    $.dateToString = function(v, type) {
        type = type || "yyyy-MM-dd";
        if (v == 0 || v == "" || v == null)
            return "";
        if (v.time != null)
            v = v.time;
        var date = new Date();
        if (typeof v == "string") {
            v = parseInt(v);
        }
        date.setTime(v);
        if ((v + "").length != 13) {
            v = v + "";
            date.setYear(parseInt(v.substr(0, 4)));
            date.setMonth(parseInt(v.substr(4, 2).replace(/^0*/, "")) - 1);
            date.setDate(parseInt(v.substr(6, 2).replace(/^0*/, "")));
            if (type.indexOf("HH:mm") > -1) {
                var tmpData = v.substr(8, 2).replace(/^0*/, "");
                date.setHours(tmpData == "" ? 0 : parseInt(tmpData));
                tmpData = v.substr(10, 2).replace(/^0*/, "");
                date.setMinutes(tmpData == "" ? 0 : parseInt(tmpData));
            }
        }
        return date.format(type);
    }

    $.getCenterHeight = function(_self, _centerEl) {
        if (_self == null || _self.length == 0) {
            //hik.libs.Alert({info:'自适应高度查询失败,自身未找到,请查看hik.util.getCenterHeight调用是否正确'});
            return 0;
        }
        if (_centerEl == null || (_centerEl.length == 0)) {
            _centerEl = $('body');
        }
        var _list, i, _tmpEl = _self.get(0),
            _height = _centerEl.innerHeight(),
            _p = _centerEl.get(0);
        /*  _height -=parseInt(_centerEl.css('padding-top'))-1;
            _height -=parseInt(_centerEl.css('padding-bottom'))-1;
            _height -=parseInt(_centerEl.css('margin-top'))-1;
            _height -=parseInt(_centerEl.css('margin-bottom'))-1;
            _height -=parseInt(_centerEl.css('border-top'))-1;
            _height -=parseInt(_centerEl.css('border-bottom'))-1;*/
        while (_tmpEl != $('body').get(0) && _tmpEl != _p) {
            _list = $(_tmpEl).parent().children();
            for (i = 0; i < _list.length; i++) {
                if (_list.get(i) == _tmpEl ||
                    $(_list.get(i)).css('position') == 'absolute' ||
                    $(_list.get(i)).is(':hidden') ||
                    $(_list.get(i)).css('display') == 'none'
                ) continue;
                _height -= $(_list[i]).outerHeight(true);
            }
            _tmpEl = $(_tmpEl).parent().get(0);
            if ($(_tmpEl).css('position') == 'absolute' ||
                $(_tmpEl).is(':hidden') ||
                $(_tmpEl).css('display') == 'none')
                break;
        }
        delete _tmpEl;
        delete _list;
        delete _self;
        delete _p;
        return _height;
    }
    $.arrayAttrJoin = function(_array, attr) {
        var tmpArr = [];
        $.each(_array, function(index, item) {
            tmpArr.push(item[attr]);
        });
        return tmpArr.join(',');
    }
    $.session = function(data) {
        var json = data;
        if (typeof data == "string") {
            if (data.indexOf('{') == 0) {
                json = jQuery.parseJSON(data);
            }
        }
        if (json != null && $.type(json) == "object") {
            if (json != null && json.success != null && json.success == false && json.msg != null && json.msg.indexOf('Session') > -1) {
                hik.libs.Alert({
                    info: hik.desc.SESSIONEXPIRE,
                    module: true,
                    singleBtn: true,
                    close: "确定",
                    cancelEvent: function() {
                        top.window.location.href = "/";
                    }
                });
                return true;
            }
        }
        return false;
    }
    $.createId = function() {
        if ($.createId.timer == null) {
            $.createId.timer = 0;
            window.setTimeout(function() {
                $.createId.timer = null
            }, 1000);
        }
        $.createId.timer++;
        return "global_" + new Date().getTime() + "_" + $.createId.timer;
    }
    $.fn.getElementId = function() {
        if (null == $(this).attr('id') || "" == $(this).attr('id')) {
            $(this).attr("id", $.createId());
        }
        return $(this).attr("id");
    }
    $.validateCardNum = function() {
            return [{
                way: "notNull",
                min: 1,
                max: 10
            }, {
                way: "regex",
                regExp: $.validRegex.cardNum
            }, {
                way: "func",
                fun: function(v, o, flag) {
                    return true;
                }
            }];
        }
        /**
         * 字符转化成xml
         */
    $.strToXML = function(strxml) {
        try {
            if (window.ActiveXObject) //若是IE浏览器
            {
                xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = false;
                xmlDoc.loadXML(strxml);
            } else if (document.implementation && document.implementation.createDocument) //若是其它浏览器
            {
                xmlDoc = document.implementation.createDocument('', '', null);
                xmlDoc.loadXML(strxml);
            } else {
                xmlDoc = null;
            }
        } catch (e) {
            var oParser = new DOMParser();
            xmlDoc = oParser.parseFromString(strxml, "text/xml");
        }
        return xmlDoc;
    }

    /**
     * 对象深度拷贝
     * @author xx
     * @date   2014-12-04
     */
    $.hikClone = function(sobj) {
        if (!sobj || typeof sobj !== "object") {
            return sobj;
        }

        var s = {};
        if (sobj.constructor == Array) {
            s = [];
        }

        for (var i in sobj) {
            s[i] = $.hikClone(sobj[i]);
        }
        return s;
    }

    $.checkEndTime = function(beginTime, endTime) {
        if ($.trim(beginTime).length == 0 || $.trim(endTime).length == 0) {
            return true;
        }
        var start = beginTime.replace(/\-/g, "");
        var end = endTime.replace(/\-/g, "");
        if (end < start) {
            $.say("开始日期不能大于结束日期", "error");
            return false;
        }
        return true;

    };
    /**
     * 生成组件的方法
     */
    $.fn.checkboxTree = function(options) {
        /**
         * 初始化的默认数据
         */
        var _defaultSetting = {
            initURL: "",
            searchURL: "",
            otherParam: {
                regionId: 0,
                unitId: 0
            },
            waitTip: "loading..."
        };
        var _el; //记录树的dom对象
        var _treeObj; //树对象
        var _superTreeObj; //原始的树对象
        var _searched = false; //搜索标志位
        var _autoParam = ["id=treeNodeId", "level", "checked"];
        var _otherParam = {
            "regionId": 0,
            "unitId": 0
        };
        /**
         * 树的配置
         */
        var _treeSetting = {
            treeId: "",
            treeObj: null,
            view: {
                selectedMulti: false,
                dblClickExpand: true,
                expandSpeed: "fast",
                nameIsHTML: true
            },
            async: {
                enable: true,
                url: "",
                type: "post",
                autoParam: _autoParam,
                otherParam: _otherParam
            },
            check: {
                enable: true,
                chkStyle: "checkbox",
                chkboxType: {
                    "Y": "ps",
                    "N": "ps"
                },
                autoCheckTrigger: true
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                onClick: function(event, treeId, treeNode) {

                },
                beforeExpand: function(treeId, treeNode) {

                },
                onExpand: function(event, treeId, treeNode) {

                },
                beforeCheck: function(treeId, treeNode) {

                },
                onCheck: function(event, treeId, treeNode) {

                },
                beforeAsync: function(treeId, treeNode) {
                    //加载前加上蒙板
                },
                onAsyncSuccess: function(event, treeId, treeNode, msg) {
                    //加载完毕去掉蒙板
                }
            }
        }

        /**
         * 该对象作为返回值，提供一系列操作树的接口
         */
        _treeObj = {
            getInitURL: function() {
                return _defaultSetting.initURL;
            },
            setInitURL: function(v) {
                _defaultSetting.initURL = v;
            },
            getSearchURL: function() {
                return _defaultSetting.searchURL;
            },
            setSearchURL: function(v) {
                _defaultSetting.searchURL = v;
            },
            /**
             * 根据查询关键字查所有监控点信息
             */
            search: function(searchKey) {
                _searched = true;
                /*              var _paramSearch = {
                                    searchKey : encodeURIComponent(searchKey)
                                }*/
                var _paramSearch = {
                    searchKey: searchKey
                }
                $.extend(_treeSetting.async.otherParam, _paramSearch);
                //_treeSetting.async.otherParam = _paramSearch;
                _treeSetting.async.url = _defaultSetting.searchURL;
                _superTreeObj = $.fn.zTree.init(_el, _treeSetting, []);
            },
            /**
             * 清除查询结果，恢复树为初始状态
             */
            clearSearch: function() {
                _searched = false;
                _treeSetting.async.autoParam = _autoParam;
                _treeSetting.async.otherParam = _otherParam;
                _treeSetting.async.url = _defaultSetting.initURL;
                _superTreeObj = $.fn.zTree.init(_el, _treeSetting, []);
            },
            checkAllNodes: function(checked) {
                _superTreeObj.checkAllNodes(checked);
            },
            /**
             * 获取所有选中的叶子节点
             */
            getLeafChecked: function(field) {
                var nodes = new Array();
                var checkedNodes = _superTreeObj.getCheckedNodes(true);
                $.each(checkedNodes, function(i, n) {
                    if (n.children == null || n.children.length == 0) {
                        field ? nodes.push(n[field]) : nodes.push(n.id);
                    }
                });
                return nodes;
            },
            getLeafCheckedNodes: function() {
                var nodes = new Array();
                var checkedNodes = _superTreeObj.getCheckedNodes(true);
                $.each(checkedNodes, function(i, n) {
                    if (n.children == null || n.children.length == 0) {
                        nodes.push(n);
                    }
                });
                return nodes;
            },
            getTree: function() {
                return _superTreeObj;
            }
        };
        //初始化参数赋值
        $.extend(_defaultSetting, options);
        $.extend(_treeSetting.callback, options.callback);
        //树的dom节点
        _el = $(this);
        _otherParam && $.extend(_otherParam, _defaultSetting.otherParam);
        _treeSetting.async.url = _defaultSetting.initURL;
        _treeSetting.async.autoParam = _autoParam;
        _treeSetting.async.otherParam = _otherParam;
        //调用原始树的api初始化树
        _superTreeObj = $.fn.zTree.init(_el, _treeSetting, []);
        return _treeObj;
    };

    $.fn.dropdownChange = function(callback) {
        return this.each(function() {
            var $this = $(this);
            var $toggle = $(".dropdown-toggle", $this);
            var $menu = $(".dropdown-menu", $this);
            var $text = $(".dropdown-text", $toggle);

            // $toggle.dropdown();

            $this.callback = callback;
            $toggle.attr({
                "role": "button",
                "data-toggle": "dropdown"
            });
            $menu.attr("role", "menu");

            $menu.css("top", "12px");

            // 给第一个节点添加当前状态
            $menu.find("li:first").addClass("current");

            $menu.on("click", "li", function() {
                var $current = $(this);

                if ($current.data("value") !== $this.data("value")) {
                    $text.text($current.text());
                    $this.data("value", $(this).data("value"));
                    $this.callback();
                }

                // 添加当前状态
                $current.addClass("current").siblings("li").removeClass("current");

            })

            $("li:first", $menu).click();

        })
    };
})(jQuery);

+ function($) {
    'use strict';

    // TAB CLASS DEFINITION
    // ====================

    var SearchTool = function(element) {
        this.element = $(element)
    }

    SearchTool.VERSION = '1.0.0'

    SearchTool.prototype.show = function() {
        var $this = this.element;

        if ($this.find('i').length == 0 && ($.browser.version != "10.0" && $.browser.version != "11.0")) {
            // Code
            $this.append('<i class="data-base-red-small-close" style="display: none;"></i>');
        }
        if ($this.find('i').length != 0 && ($.browser.version == "10.0" || $.browser.version == "11.0")) {
            // Code
            $(".data-base-red-small-close").remove();
        }
        $('i.data-base-red-small-close', $this).die('click').live('click', function() {
            $(this).prevAll('input:first').val("").trigger("blur");
            $(this).hide();
            //  $(this).prevAll('button:first').trigger('click');
        });
        $('input', $this).die('focus').live('focus', function(e) {
            if (this.inited) return;
            $(this).on('keyup', function(e) {
                var _value = $(this).val(),
                    placeholderText = $(this).attr("placeholder");
                if ($.trim(_value) != "" && _value != placeholderText) {
                    $(this).nextAll('i:first').css('display', 'inline-block');
                } else {
                    $(this).nextAll('i:first').hide();
                }
            });
            $(this).on('keydown', function(e) {
                if (e.keyCode == 13) {
                    $(this).val($.trim($(this).val()));
                    $(this).next().trigger('click');
                    return;
                }
            });
            $(this).blur(function() {
                if (this.blured !== true) {
                    this.blured = true;
                    $(this).trigger('keyup');
                    if ($.trim($(this).val()) == "") {
                        $(this).trigger('blur');
                    }
                }
            });
            $(this).next().mousedown(function() {
                var input = $(this).prev();
                input.val($.trim(input.val()));
                if (input.val() != "") {
                    input.nextAll('i:first').css('display', 'inline-block');
                } else {
                    input.nextAll('i:first').hide();
                }
            });
            this.inited = true;
        });
    }


    // TAB PLUGIN DEFINITION
    // =====================

    function Plugin(option) {
        return this.each(function() {
            var $this = $(this)
            var data = $this.data('bs.hik-search')

            if (!data) $this.data('bs.hik-search', (data = new SearchTool(this)))
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.searchTool

    $.fn.searchTool = Plugin
    $.fn.searchTool.Constructor = SearchTool


    // TAB NO CONFLICT
    // ===============

    $.fn.searchTool.noConflict = function() {
        $.fn.searchTool = old
        return this
    }


    // TAB DATA-API
    // ============

    // edit by chenguanbin
    // 将$(window).on('load')方法改为$(document).ready，在IE8下有时候onload方法不会调用
    $(document).ready(function() {
        $('[data-toggle="searchTool"]').each(function() {
            Plugin.call($(this), "show");
        });
        //为了兼容以前的组件，待优化 xx 2015/2/28
        $('.data-search').each(function() {
            Plugin.call($(this), "show");
        });
    });

}(jQuery);
/**
 * 重写了accordion组件
 * @author xiangxiao
 * @date   2014-11-20
 */
+ function($) {
    var Accordion = function(element, options) {

        this.$element = $(element)
        this.options = $.extend({}, Accordion.DEFAULTS, options);
        this.init();
    }
    Accordion.DEFAULTS = {
        show: false,
        hide: false
    }
    Accordion.prototype.getActPanel = function() {
        return this.$element.find('div.active');
    }
    Accordion.prototype.overShow = function(p, newP) {
        var that = this;
        if (null != that.options.onOneAccordionHide) {
            that.options.onOneAccordionHide(p == null ? "" : p.attr('name'), newP
                .attr('name'));
        }
    }
    Accordion.prototype.showActPanel = function(p, oldP) {
        var that = this,
            isShow = oldP.parent().next().is(":visible");

        if (p.parent().next().html() != null) {
            p.parent().next().show('fast', function() {
                that.overShow(oldP, p);
            });
        }
        if (oldP.parent().next().html() != null && isShow) {
            oldP.parent().next().hide();
        }
    }

    Accordion.prototype.init = function() {
        var that = this;
        that.$element.find('div.panel-title').on('click', function() {
            var oldP = that.getActPanel();
            var actP = $(this);

            that.showActPanel($(this), oldP);
            oldP.removeClass('active');
            $(this).addClass('active')

            if (that.options.onAccordionChange != null) {
                that.options.onAccordionChange(oldP.attr('name'), $(this).attr('name'));
            }
        });
    };

    function Plugin(option) {
        return this.each(function() {
            var $this = $(this)
            var data = $this.data('accordion')
            var options = $.extend({}, Accordion.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('accordion', (data = new Accordion(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.accordion

    $.fn.accordion = Plugin
    $.fn.accordion.Constructor = Accordion

    $.fn.accordion.noConflict = function() {
        $.fn.accordion = old
        return this
    }
}(jQuery);

/**
 * @author dingrongyf
 */
//汉字拼音首字母列表 本列表包含了20902个汉字,用于配合 ToChineseSpell
//函数使用,本表收录的字符的Unicode编码范围为19968至40869, XDesigner 整理
var strChineseFirstPY = "YDYQSXMWZSSXJBYMGCCZQPSSQBYCDSCDQLDYLYBSSJGYZZJJFKCCLZDHWDWZJLJPFYYNWJJTMYHZWZHFLZPPQHGSCYYYNJQYXXGJHHSDSJNKKTMOMLCRXYPSNQSECCQZGGLLYJLMYZZSECYKYYHQWJSSGGYXYZYJWWKDJHYCHMYXJTLXJYQBYXZLDWRDJRWYSRLDZJPCBZJJBRCFTLECZSTZFXXZHTRQHYBDLYCZSSYMMRFMYQZPWWJJYFCRWFDFZQPYDDWYXKYJAWJFFXYPSFTZYHHYZYSWCJYXSCLCXXWZZXNBGNNXBXLZSZSBSGPYSYZDHMDZBQBZCWDZZYYTZHBTSYYBZGNTNXQYWQSKBPHHLXGYBFMJEBJHHGQTJCYSXSTKZHLYCKGLYSMZXYALMELDCCXGZYRJXSDLTYZCQKCNNJWHJTZZCQLJSTSTBNXBTYXCEQXGKWJYFLZQLYHYXSPSFXLMPBYSXXXYDJCZYLLLSJXFHJXPJBTFFYABYXBHZZBJYZLWLCZGGBTSSMDTJZXPTHYQTGLJSCQFZKJZJQNLZWLSLHDZBWJNCJZYZSQQYCQYRZCJJWYBRTWPYFTWEXCSKDZCTBZHYZZYYJXZCFFZZMJYXXSDZZOTTBZLQWFCKSZSXFYRLNYJMBDTHJXSQQCCSBXYYTSYFBXDZTGBCNSLCYZZPSAZYZZSCJCSHZQYDXLBPJLLMQXTYDZXSQJTZPXLCGLQTZWJBHCTSYJSFXYEJJTLBGXSXJMYJQQPFZASYJNTYDJXKJCDJSZCBARTDCLYJQMWNQNCLLLKBYBZZSYHQQLTWLCCXTXLLZNTYLNEWYZYXCZXXGRKRMTCNDNJTSYYSSDQDGHSDBJGHRWRQLYBGLXHLGTGXBQJDZPYJSJYJCTMRNYMGRZJCZGJMZMGXMPRYXKJNYMSGMZJYMKMFXMLDTGFBHCJHKYLPFMDXLQJJSMTQGZSJLQDLDGJYCALCMZCSDJLLNXDJFFFFJCZFMZFFPFKHKGDPSXKTACJDHHZDDCRRCFQYJKQCCWJDXHWJLYLLZGCFCQDSMLZPBJJPLSBCJGGDCKKDEZSQCCKJGCGKDJTJDLZYCXKLQSCGJCLTFPCQCZGWPJDQYZJJBYJHSJDZWGFSJGZKQCCZLLPSPKJGQJHZZLJPLGJGJJTHJJYJZCZMLZLYQBGJWMLJKXZDZNJQSYZMLJLLJKYWXMKJLHSKJGBMCLYYMKXJQLBMLLKMDXXKWYXYSLMLPSJQQJQXYXFJTJDXMXXLLCXQBSYJBGWYMBGGBCYXPJYGPEPFGDJGBHBNSQJYZJKJKHXQFGQZKFHYGKHDKLLSDJQXPQYKYBNQSXQNSZSWHBSXWHXWBZZXDMNSJBSBKBBZKLYLXGWXDRWYQZMYWSJQLCJXXJXKJEQXSCYETLZHLYYYSDZPAQYZCMTLSHTZCFYZYXYLJSDCJQAGYSLCQLYYYSHMRQQKLDXZSCSSSYDYCJYSFSJBFRSSZQSBXXPXJYSDRCKGJLGDKZJZBDKTCSYQPYHSTCLDJDHMXMCGXYZHJDDTMHLTXZXYLYMOHYJCLTYFBQQXPFBDFHHTKSQHZYYWCNXXCRWHOWGYJLEGWDQCWGFJYCSNTMYTOLBYGWQWESJPWNMLRYDZSZTXYQPZGCWXHNGPYXSHMYQJXZTDPPBFYHZHTJYFDZWKGKZBLDNTSXHQEEGZZYLZMMZYJZGXZXKHKSTXNXXWYLYAPSTHXDWHZYMPXAGKYDXBHNHXKDPJNMYHYLPMGOCSLNZHKXXLPZZLBMLSFBHHGYGYYGGBHSCYAQTYWLXTZQCEZYDQDQMMHTKLLSZHLSJZWFYHQSWSCWLQAZYNYTLSXTHAZNKZZSZZLAXXZWWCTGQQTDDYZTCCHYQZFLXPSLZYGPZSZNGLNDQTBDLXGTCTAJDKYWNSYZLJHHZZCWNYYZYWMHYCHHYXHJKZWSXHZYXLYSKQYSPSLYZWMYPPKBYGLKZHTYXAXQSYSHXASMCHKDSCRSWJPWXSGZJLWWSCHSJHSQNHCSEGNDAQTBAALZZMSSTDQJCJKTSCJAXPLGGXHHGXXZCXPDMMHLDGTYBYSJMXHMRCPXXJZCKZXSHMLQXXTTHXWZFKHCCZDYTCJYXQHLXDHYPJQXYLSYYDZOZJNYXQEZYSQYAYXWYPDGXDDXSPPYZNDLTWRHXYDXZZJHTCXMCZLHPYYYYMHZLLHNXMYLLLMDCPPXHMXDKYCYRDLTXJCHHZZXZLCCLYLNZSHZJZZLNNRLWHYQSNJHXYNTTTKYJPYCHHYEGKCTTWLGQRLGGTGTYGYHPYHYLQYQGCWYQKPYYYTTTTLHYHLLTYTTSPLKYZXGZWGPYDSSZZDQXSKCQNMJJZZBXYQMJRTFFBTKHZKBXLJJKDXJTLBWFZPPTKQTZTGPDGNTPJYFALQMKGXBDCLZFHZCLLLLADPMXDJHLCCLGYHDZFGYDDGCYYFGYDXKSSEBDHYKDKDKHNAXXYBPBYYHXZQGAFFQYJXDMLJCSQZLLPCHBSXGJYNDYBYQSPZWJLZKSDDTACTBXZDYZYPJZQSJNKKTKNJDJGYYPGTLFYQKASDNTCYHBLWDZHBBYDWJRYGKZYHEYYFJMSDTYFZJJHGCXPLXHLDWXXJKYTCYKSSSMTWCTTQZLPBSZDZWZXGZAGYKTYWXLHLSPBCLLOQMMZSSLCMBJCSZZKYDCZJGQQDSMCYTZQQLWZQZXSSFPTTFQMDDZDSHDTDWFHTDYZJYQJQKYPBDJYYXTLJHDRQXXXHAYDHRJLKLYTWHLLRLLRCXYLBWSRSZZSYMKZZHHKYHXKSMDSYDYCJPBZBSQLFCXXXNXKXWYWSDZYQOGGQMMYHCDZTTFJYYBGSTTTYBYKJDHKYXBELHTYPJQNFXFDYKZHQKZBYJTZBXHFDXKDASWTAWAJLDYJSFHBLDNNTNQJTJNCHXFJSRFWHZFMDRYJYJWZPDJKZYJYMPCYZNYNXFBYTFYFWYGDBNZZZDNYTXZEMMQBSQEHXFZMBMFLZZSRXYMJGSXWZJSPRYDJSJGXHJJGLJJYNZZJXHGXKYMLPYYYCXYTWQZSWHWLYRJLPXSLSXMFSWWKLCTNXNYNPSJSZHDZEPTXMYYWXYYSYWLXJQZQXZDCLEEELMCPJPCLWBXSQHFWWTFFJTNQJHJQDXHWLBYZNFJLALKYYJLDXHHYCSTYYWNRJYXYWTRMDRQHWQCMFJDYZMHMYYXJWMYZQZXTLMRSPWWCHAQBXYGZYPXYYRRCLMPYMGKSJSZYSRMYJSNXTPLNBAPPYPYLXYYZKYNLDZYJZCZNNLMZHHARQMPGWQTZMXXMLLHGDZXYHXKYXYCJMFFYYHJFSBSSQLXXNDYCANNMTCJCYPRRNYTYQNYYMBMSXNDLYLYSLJRLXYSXQMLLYZLZJJJKYZZCSFBZXXMSTBJGNXYZHLXNMCWSCYZYFZLXBRNNNYLBNRTGZQYSATSWRYHYJZMZDHZGZDWYBSSCSKXSYHYTXXGCQGXZZSHYXJSCRHMKKBXCZJYJYMKQHZJFNBHMQHYSNJNZYBKNQMCLGQHWLZNZSWXKHLJHYYBQLBFCDSXDLDSPFZPSKJYZWZXZDDXJSMMEGJSCSSMGCLXXKYYYLNYPWWWGYDKZJGGGZGGSYCKNJWNJPCXBJJTQTJWDSSPJXZXNZXUMELPXFSXTLLXCLJXJJLJZXCTPSWXLYDHLYQRWHSYCSQYYBYAYWJJJQFWQCQQCJQGXALDBZZYJGKGXPLTZYFXJLTPADKYQHPMATLCPDCKBMTXYBHKLENXDLEEGQDYMSAWHZMLJTWYGXLYQZLJEEYYBQQFFNLYXRDSCTGJGXYYNKLLYQKCCTLHJLQMKKZGCYYGLLLJDZGYDHZWXPYSJBZKDZGYZZHYWYFQYTYZSZYEZZLYMHJJHTSMQWYZLKYYWZCSRKQYTLTDXWCTYJKLWSQZWBDCQYNCJSRSZJLKCDCDTLZZZACQQZZDDXYPLXZBQJYLZLLLQDDZQJYJYJZYXNYYYNYJXKXDAZWYRDLJYYYRJLXLLDYXJCYWYWNQCCLDDNYYYNYCKCZHXXCCLGZQJGKWPPCQQJYSBZZXYJSQPXJPZBSBDSFNSFPZXHDWZTDWPPTFLZZBZDMYYPQJRSDZSQZSQXBDGCPZSWDWCSQZGMDHZXMWWFYBPDGPHTMJTHZSMMBGZMBZJCFZWFZBBZMQCFMBDMCJXLGPNJBBXGYHYYJGPTZGZMQBQTCGYXJXLWZKYDPDYMGCFTPFXYZTZXDZXTGKMTYBBCLBJASKYTSSQYYMSZXFJEWLXLLSZBQJJJAKLYLXLYCCTSXMCWFKKKBSXLLLLJYXTYLTJYYTDPJHNHNNKBYQNFQYYZBYYESSESSGDYHFHWTCJBSDZZTFDMXHCNJZYMQWSRYJDZJQPDQBBSTJGGFBKJBXTGQHNGWJXJGDLLTHZHHYYYYYYSXWTYYYCCBDBPYPZYCCZYJPZYWCBDLFWZCWJDXXHYHLHWZZXJTCZLCDPXUJCZZZLYXJJTXPHFXWPYWXZPTDZZBDZCYHJHMLXBQXSBYLRDTGJRRCTTTHYTCZWMXFYTWWZCWJWXJYWCSKYBZSCCTZQNHXNWXXKHKFHTSWOCCJYBCMPZZYKBNNZPBZHHZDLSYDDYTYFJPXYNGFXBYQXCBHXCPSXTYZDMKYSNXSXLHKMZXLYHDHKWHXXSSKQYHHCJYXGLHZXCSNHEKDTGZXQYPKDHEXTYKCNYMYYYPKQYYYKXZLTHJQTBYQHXBMYHSQCKWWYLLHCYYLNNEQXQWMCFBDCCMLJGGXDQKTLXKGNQCDGZJWYJJLYHHQTTTNWCHMXCXWHWSZJYDJCCDBQCDGDNYXZTHCQRXCBHZTQCBXWGQWYYBXHMBYMYQTYEXMQKYAQYRGYZSLFYKKQHYSSQYSHJGJCNXKZYCXSBXYXHYYLSTYCXQTHYSMGSCPMMGCCCCCMTZTASMGQZJHKLOSQYLSWTMXSYQKDZLJQQYPLSYCZTCQQPBBQJZCLPKHQZYYXXDTDDTSJCXFFLLCHQXMJLWCJCXTSPYCXNDTJSHJWXDQQJSKXYAMYLSJHMLALYKXCYYDMNMDQMXMCZNNCYBZKKYFLMCHCMLHXRCJJHSYLNMTJZGZGYWJXSRXCWJGJQHQZDQJDCJJZKJKGDZQGJJYJYLXZXXCDQHHHEYTMHLFSBDJSYYSHFYSTCZQLPBDRFRZTZYKYWHSZYQKWDQZRKMSYNBCRXQBJYFAZPZZEDZCJYWBCJWHYJBQSZYWRYSZPTDKZPFPBNZTKLQYHBBZPNPPTYZZYBQNYDCPJMMCYCQMCYFZZDCMNLFPBPLNGQJTBTTNJZPZBBZNJKLJQYLNBZQHKSJZNGGQSZZKYXSHPZSNBCGZKDDZQANZHJKDRTLZLSWJLJZLYWTJNDJZJHXYAYNCBGTZCSSQMNJPJYTYSWXZFKWJQTKHTZPLBHSNJZSYZBWZZZZLSYLSBJHDWWQPSLMMFBJDWAQYZTCJTBNNWZXQXCDSLQGDSDPDZHJTQQPSWLYYJZLGYXYZLCTCBJTKTYCZJTQKBSJLGMGZDMCSGPYNJZYQYYKNXRPWSZXMTNCSZZYXYBYHYZAXYWQCJTLLCKJJTJHGDXDXYQYZZBYWDLWQCGLZGJGQRQZCZSSBCRPCSKYDZNXJSQGXSSJMYDNSTZTPBDLTKZWXQWQTZEXNQCZGWEZKSSBYBRTSSSLCCGBPSZQSZLCCGLLLZXHZQTHCZMQGYZQZNMCOCSZJMMZSQPJYGQLJYJPPLDXRGZYXCCSXHSHGTZNLZWZKJCXTCFCJXLBMQBCZZWPQDNHXLJCTHYZLGYLNLSZZPCXDSCQQHJQKSXZPBAJYEMSMJTZDXLCJYRYYNWJBNGZZTMJXLTBSLYRZPYLSSCNXPHLLHYLLQQZQLXYMRSYCXZLMMCZLTZSDWTJJLLNZGGQXPFSKYGYGHBFZPDKMWGHCXMSGDXJMCJZDYCABXJDLNBCDQYGSKYDQTXDJJYXMSZQAZDZFSLQXYJSJZYLBTXXWXQQZBJZUFBBLYLWDSLJHXJYZJWTDJCZFQZQZZDZSXZZQLZCDZFJHYSPYMPQZMLPPLFFXJJNZZYLSJEYQZFPFZKSYWJJJHRDJZZXTXXGLGHYDXCSKYSWMMZCWYBAZBJKSHFHJCXMHFQHYXXYZFTSJYZFXYXPZLCHMZMBXHZZSXYFYMNCWDABAZLXKTCSHHXKXJJZJSTHYGXSXYYHHHJWXKZXSSBZZWHHHCWTZZZPJXSNXQQJGZYZYWLLCWXZFXXYXYHXMKYYSWSQMNLNAYCYSPMJKHWCQHYLAJJMZXHMMCNZHBHXCLXTJPLTXYJHDYYLTTXFSZHYXXSJBJYAYRSMXYPLCKDUYHLXRLNLLSTYZYYQYGYHHSCCSMZCTZQXKYQFPYYRPFFLKQUNTSZLLZMWWTCQQYZWTLLMLMPWMBZSSTZRBPDDTLQJJBXZCSRZQQYGWCSXFWZLXCCRSZDZMCYGGDZQSGTJSWLJMYMMZYHFBJDGYXCCPSHXNZCSBSJYJGJMPPWAFFYFNXHYZXZYLREMZGZCYZSSZDLLJCSQFNXZKPTXZGXJJGFMYYYSNBTYLBNLHPFZDCYFBMGQRRSSSZXYSGTZRNYDZZCDGPJAFJFZKNZBLCZSZPSGCYCJSZLMLRSZBZZLDLSLLYSXSQZQLYXZLSKKBRXBRBZCYCXZZZEEYFGKLZLYYHGZSGZLFJHGTGWKRAAJYZKZQTSSHJJXDCYZUYJLZYRZDQQHGJZXSSZBYKJPBFRTJXLLFQWJHYLQTYMBLPZDXTZYGBDHZZRBGXHWNJTJXLKSCFSMWLSDQYSJTXKZSCFWJLBXFTZLLJZLLQBLSQMQQCGCZFPBPHZCZJLPYYGGDTGWDCFCZQYYYQYSSCLXZSKLZZZGFFCQNWGLHQYZJJCZLQZZYJPJZZBPDCCMHJGXDQDGDLZQMFGPSYTSDYFWWDJZJYSXYYCZCYHZWPBYKXRYLYBHKJKSFXTZJMMCKHLLTNYYMSYXYZPYJQYCSYCWMTJJKQYRHLLQXPSGTLYYCLJSCPXJYZFNMLRGJJTYZBXYZMSJYJHHFZQMSYXRSZCWTLRTQZSSTKXGQKGSPTGCZNJSJCQCXHMXGGZTQYDJKZDLBZSXJLHYQGGGTHQSZPYHJHHGYYGKGGCWJZZYLCZLXQSFTGZSLLLMLJSKCTBLLZZSZMMNYTPZSXQHJCJYQXYZXZQZCPSHKZZYSXCDFGMWQRLLQXRFZTLYSTCTMJCXJJXHJNXTNRZTZFQYHQGLLGCXSZSJDJLJCYDSJTLNYXHSZXCGJZYQPYLFHDJSBPCCZHJJJQZJQDYBSSLLCMYTTMQTBHJQNNYGKYRQYQMZGCJKPDCGMYZHQLLSLLCLMHOLZGDYYFZSLJCQZLYLZQJESHNYLLJXGJXLYSYYYXNBZLJSSZCQQCJYLLZLTJYLLZLLBNYLGQCHXYYXOXCXQKYJXXXYKLXSXXYQXCYKQXQCSGYXXYQXYGYTQOHXHXPYXXXULCYEYCHZZCBWQBBWJQZSCSZSSLZYLKDESJZWMYMCYTSDSXXSCJPQQSQYLYYZYCMDJDZYWCBTJSYDJKCYDDJLBDJJSODZYSYXQQYXDHHGQQYQHDYXWGMMMAJDYBBBPPBCMUUPLJZSMTXERXJMHQNUTPJDCBSSMSSSTKJTSSMMTRCPLZSZMLQDSDMJMQPNQDXCFYNBFSDQXYXHYAYKQYDDLQYYYSSZBYDSLNTFQTZQPZMCHDHCZCWFDXTMYQSPHQYYXSRGJCWTJTZZQMGWJJTJHTQJBBHWZPXXHYQFXXQYWYYHYSCDYDHHQMNMTMWCPBSZPPZZGLMZFOLLCFWHMMSJZTTDHZZYFFYTZZGZYSKYJXQYJZQBHMBZZLYGHGFMSHPZFZSNCLPBQSNJXZSLXXFPMTYJYGBXLLDLXPZJYZJYHHZCYWHJYLSJEXFSZZYWXKZJLUYDTMLYMQJPWXYHXSKTQJEZRPXXZHHMHWQPWQLYJJQJJZSZCPHJLCHHNXJLQWZJHBMZYXBDHHYPZLHLHLGFWLCHYYTLHJXCJMSCPXSTKPNHQXSRTYXXTESYJCTLSSLSTDLLLWWYHDHRJZSFGXTSYCZYNYHTDHWJSLHTZDQDJZXXQHGYLTZPHCSQFCLNJTCLZPFSTPDYNYLGMJLLYCQHYSSHCHYLHQYQTMZYPBYWRFQYKQSYSLZDQJMPXYYSSRHZJNYWTQDFZBWWTWWRXCWHGYHXMKMYYYQMSMZHNGCEPMLQQMTCWCTMMPXJPJJHFXYYZSXZHTYBMSTSYJTTQQQYYLHYNPYQZLCYZHZWSMYLKFJXLWGXYPJYTYSYXYMZCKTTWLKSMZSYLMPWLZWXWQZSSAQSYXYRHSSNTSRAPXCPWCMGDXHXZDZYFJHGZTTSBJHGYZSZYSMYCLLLXBTYXHBBZJKSSDMALXHYCFYGMQYPJYCQXJLLLJGSLZGQLYCJCCZOTYXMTMTTLLWTGPXYMZMKLPSZZZXHKQYSXCTYJZYHXSHYXZKXLZWPSQPYHJWPJPWXQQYLXSDHMRSLZZYZWTTCYXYSZZSHBSCCSTPLWSSCJCHNLCGCHSSPHYLHFHHXJSXYLLNYLSZDHZXYLSXLWZYKCLDYAXZCMDDYSPJTQJZLNWQPSSSWCTSTSZLBLNXSMNYYMJQBQHRZWTYYDCHQLXKPZWBGQYBKFCMZWPZLLYYLSZYDWHXPSBCMLJBSCGBHXLQHYRLJXYSWXWXZSLDFHLSLYNJLZYFLYJYCDRJLFSYZFSLLCQYQFGJYHYXZLYLMSTDJCYHBZLLNWLXXYGYYHSMGDHXXHHLZZJZXCZZZCYQZFNGWPYLCPKPYYPMCLQKDGXZGGWQBDXZZKZFBXXLZXJTPJPTTBYTSZZDWSLCHZHSLTYXHQLHYXXXYYZYSWTXZKHLXZXZPYHGCHKCFSYHUTJRLXFJXPTZTWHPLYXFCRHXSHXKYXXYHZQDXQWULHYHMJTBFLKHTXCWHJFWJCFPQRYQXCYYYQYGRPYWSGSUNGWCHKZDXYFLXXHJJBYZWTSXXNCYJJYMSWZJQRMHXZWFQSYLZJZGBHYNSLBGTTCSYBYXXWXYHXYYXNSQYXMQYWRGYQLXBBZLJSYLPSYTJZYHYZAWLRORJMKSCZJXXXYXCHDYXRYXXJDTSQFXLYLTSFFYXLMTYJMJUYYYXLTZCSXQZQHZXLYYXZHDNBRXXXJCTYHLBRLMBRLLAXKYLLLJLYXXLYCRYLCJTGJCMTLZLLCYZZPZPCYAWHJJFYBDYYZSMPCKZDQYQPBPCJPDCYZMDPBCYYDYCNNPLMTMLRMFMMGWYZBSJGYGSMZQQQZTXMKQWGXLLPJGZBQCDJJJFPKJKCXBLJMSWMDTQJXLDLPPBXCWRCQFBFQJCZAHZGMYKPHYYHZYKNDKZMBPJYXPXYHLFPNYYGXJDBKXNXHJMZJXSTRSTLDXSKZYSYBZXJLXYSLBZYSLHXJPFXPQNBYLLJQKYGZMCYZZYMCCSLCLHZFWFWYXZMWSXTYNXJHPYYMCYSPMHYSMYDYSHQYZCHMJJMZCAAGCFJBBHPLYZYLXXSDJGXDHKXXTXXNBHRMLYJSLTXMRHNLXQJXYZLLYSWQGDLBJHDCGJYQYCMHWFMJYBMBYJYJWYMDPWHXQLDYGPDFXXBCGJSPCKRSSYZJMSLBZZJFLJJJLGXZGYXYXLSZQYXBEXYXHGCXBPLDYHWETTWWCJMBTXCHXYQXLLXFLYXLLJLSSFWDPZSMYJCLMWYTCZPCHQEKCQBWLCQYDPLQPPQZQFJQDJHYMMCXTXDRMJWRHXCJZYLQXDYYNHYYHRSLSRSYWWZJYMTLTLLGTQCJZYABTCKZCJYCCQLJZQXALMZYHYWLWDXZXQDLLQSHGPJFJLJHJABCQZDJGTKHSSTCYJLPSWZLXZXRWGLDLZRLZXTGSLLLLZLYXXWGDZYGBDPHZPBRLWSXQBPFDWOFMWHLYPCBJCCLDMBZPBZZLCYQXLDOMZBLZWPDWYYGDSTTHCSQSCCRSSSYSLFYBFNTYJSZDFNDPDHDZZMBBLSLCMYFFGTJJQWFTMTPJWFNLBZCMMJTGBDZLQLPYFHYYMJYLSDCHDZJWJCCTLJCLDTLJJCPDDSQDSSZYBNDBJLGGJZXSXNLYCYBJXQYCBYLZCFZPPGKCXZDZFZTJJFJSJXZBNZYJQTTYJYHTYCZHYMDJXTTMPXSPLZCDWSLSHXYPZGTFMLCJTYCBPMGDKWYCYZCDSZZYHFLYCTYGWHKJYYLSJCXGYWJCBLLCSNDDBTZBSCLYZCZZSSQDLLMQYYHFSLQLLXFTYHABXGWNYWYYPLLSDLDLLBJCYXJZMLHLJDXYYQYTDLLLBUGBFDFBBQJZZMDPJHGCLGMJJPGAEHHBWCQXAXHHHZCHXYPHJAXHLPHJPGPZJQCQZGJJZZUZDMQYYBZZPHYHYBWHAZYJHYKFGDPFQSDLZMLJXKXGALXZDAGLMDGXMWZQYXXDXXPFDMMSSYMPFMDMMKXKSYZYSHDZKXSYSMMZZZMSYDNZZCZXFPLSTMZDNMXCKJMZTYYMZMZZMSXHHDCZJEMXXKLJSTLWLSQLYJZLLZJSSDPPMHNLZJCZYHMXXHGZCJMDHXTKGRMXFWMCGMWKDTKSXQMMMFZZYDKMSCLCMPCGMHSPXQPZDSSLCXKYXTWLWJYAHZJGZQMCSNXYYMMPMLKJXMHLMLQMXCTKZMJQYSZJSYSZHSYJZJCDAJZYBSDQJZGWZQQXFKDMSDJLFWEHKZQKJPEYPZYSZCDWYJFFMZZYLTTDZZEFMZLBNPPLPLPEPSZALLTYLKCKQZKGENQLWAGYXYDPXLHSXQQWQCQXQCLHYXXMLYCCWLYMQYSKGCHLCJNSZKPYZKCQZQLJPDMDZHLASXLBYDWQLWDNBQCRYDDZTJYBKBWSZDXDTNPJDTCTQDFXQQMGNXECLTTBKPWSLCTYQLPWYZZKLPYGZCQQPLLKCCYLPQMZCZQCLJSLQZDJXLDDHPZQDLJJXZQDXYZQKZLJCYQDYJPPYPQYKJYRMPCBYMCXKLLZLLFQPYLLLMBSGLCYSSLRSYSQTMXYXZQZFDZUYSYZTFFMZZSMZQHZSSCCMLYXWTPZGXZJGZGSJSGKDDHTQGGZLLBJDZLCBCHYXYZHZFYWXYZYMSDBZZYJGTSMTFXQYXQSTDGSLNXDLRYZZLRYYLXQHTXSRTZNGZXBNQQZFMYKMZJBZYMKBPNLYZPBLMCNQYZZZSJZHJCTZKHYZZJRDYZHNPXGLFZTLKGJTCTSSYLLGZRZBBQZZKLPKLCZYSSUYXBJFPNJZZXCDWXZYJXZZDJJKGGRSRJKMSMZJLSJYWQSKYHQJSXPJZZZLSNSHRNYPZTWCHKLPSRZLZXYJQXQKYSJYCZTLQZYBBYBWZPQDWWYZCYTJCJXCKCWDKKZXSGKDZXWWYYJQYYTCYTDLLXWKCZKKLCCLZCQQDZLQLCSFQCHQHSFSMQZZLNBJJZBSJHTSZDYSJQJPDLZCDCWJKJZZLPYCGMZWDJJBSJQZSYZYHHXJPBJYDSSXDZNCGLQMBTSFSBPDZDLZNFGFJGFSMPXJQLMBLGQCYYXBQKDJJQYRFKZTJDHCZKLBSDZCFJTPLLJGXHYXZCSSZZXSTJYGKGCKGYOQXJPLZPBPGTGYJZGHZQZZLBJLSQFZGKQQJZGYCZBZQTLDXRJXBSXXPZXHYZYCLWDXJJHXMFDZPFZHQHQMQGKSLYHTYCGFRZGNQXCLPDLBZCSCZQLLJBLHBZCYPZZPPDYMZZSGYHCKCPZJGSLJLNSCDSLDLXBMSTLDDFJMKDJDHZLZXLSZQPQPGJLLYBDSZGQLBZLSLKYYHZTTNTJYQTZZPSZQZTLLJTYYLLQLLQYZQLBDZLSLYYZYMDFSZSNHLXZNCZQZPBWSKRFBSYZMTHBLGJPMCZZLSTLXSHTCSYZLZBLFEQHLXFLCJLYLJQCBZLZJHHSSTBRMHXZHJZCLXFNBGXGTQJCZTMSFZKJMSSNXLJKBHSJXNTNLZDNTLMSJXGZJYJCZXYJYJWRWWQNZTNFJSZPZSHZJFYRDJSFSZJZBJFZQZZHZLXFYSBZQLZSGYFTZDCSZXZJBQMSZKJRHYJZCKMJKHCHGTXKXQGLXPXFXTRTYLXJXHDTSJXHJZJXZWZLCQSBTXWXGXTXXHXFTSDKFJHZYJFJXRZSDLLLTQSQQZQWZXSYQTWGWBZCGZLLYZBCLMQQTZHZXZXLJFRMYZFLXYSQXXJKXRMQDZDMMYYBSQBHGZMWFWXGMXLZPYYTGZYCCDXYZXYWGSYJYZNBHPZJSQSYXSXRTFYZGRHZTXSZZTHCBFCLSYXZLZQMZLMPLMXZJXSFLBYZMYQHXJSXRXSQZZZSSLYFRCZJRCRXHHZXQYDYHXSJJHZCXZBTYNSYSXJBQLPXZQPYMLXZKYXLXCJLCYSXXZZLXDLLLJJYHZXGYJWKJRWYHCPSGNRZLFZWFZZNSXGXFLZSXZZZBFCSYJDBRJKRDHHGXJLJJTGXJXXSTJTJXLYXQFCSGSWMSBCTLQZZWLZZKXJMLTMJYHSDDBXGZHDLBMYJFRZFSGCLYJBPMLYSMSXLSZJQQHJZFXGFQFQBPXZGYYQXGZTCQWYLTLGWSGWHRLFSFGZJMGMGBGTJFSYZZGZYZAFLSSPMLPFLCWBJZCLJJMZLPJJLYMQDMYYYFBGYGYZMLYZDXQYXRQQQHSYYYQXYLJTYXFSFSLLGNQCYHYCWFHCCCFXPYLYPLLZYXXXXXKQHHXSHJZCFZSCZJXCPZWHHHHHAPYLQALPQAFYHXDYLUKMZQGGGDDESRNNZLTZGCHYPPYSQJJHCLLJTOLNJPZLJLHYMHEYDYDSQYCDDHGZUNDZCLZYZLLZNTNYZGSLHSLPJJBDGWXPCDUTJCKLKCLWKLLCASSTKZZDNQNTTLYYZSSYSSZZRYLJQKCQDHHCRXRZYDGRGCWCGZQFFFPPJFZYNAKRGYWYQPQXXFKJTSZZXSWZDDFBBXTBGTZKZNPZZPZXZPJSZBMQHKCYXYLDKLJNYPKYGHGDZJXXEAHPNZKZTZCMXCXMMJXNKSZQNMNLWBWWXJKYHCPSTMCSQTZJYXTPCTPDTNNPGLLLZSJLSPBLPLQHDTNJNLYYRSZFFJFQWDPHZDWMRZCCLODAXNSSNYZRESTYJWJYJDBCFXNMWTTBYLWSTSZGYBLJPXGLBOCLHPCBJLTMXZLJYLZXCLTPNCLCKXTPZJSWCYXSFYSZDKNTLBYJCYJLLSTGQCBXRYZXBXKLYLHZLQZLNZCXWJZLJZJNCJHXMNZZGJZZXTZJXYCYYCXXJYYXJJXSSSJSTSSTTPPGQTCSXWZDCSYFPTFBFHFBBLZJCLZZDBXGCXLQPXKFZFLSYLTUWBMQJHSZBMDDBCYSCCLDXYCDDQLYJJWMQLLCSGLJJSYFPYYCCYLTJANTJJPWYCMMGQYYSXDXQMZHSZXPFTWWZQSWQRFKJLZJQQYFBRXJHHFWJJZYQAZMYFRHCYYBYQWLPEXCCZSTYRLTTDMQLYKMBBGMYYJPRKZNPBSXYXBHYZDJDNGHPMFSGMWFZMFQMMBCMZZCJJLCNUXYQLMLRYGQZCYXZLWJGCJCGGMCJNFYZZJHYCPRRCMTZQZXHFQGTJXCCJEAQCRJYHPLQLSZDJRBCQHQDYRHYLYXJSYMHZYDWLDFRYHBPYDTSSCNWBXGLPZMLZZTQSSCPJMXXYCSJYTYCGHYCJWYRXXLFEMWJNMKLLSWTXHYYYNCMMCWJDQDJZGLLJWJRKHPZGGFLCCSCZMCBLTBHBQJXQDSPDJZZGKGLFQYWBZYZJLTSTDHQHCTCBCHFLQMPWDSHYYTQWCNZZJTLBYMBPDYYYXSQKXWYYFLXXNCWCXYPMAELYKKJMZZZBRXYYQJFLJPFHHHYTZZXSGQQMHSPGDZQWBWPJHZJDYSCQWZKTXXSQLZYYMYSDZGRXCKKUJLWPYSYSCSYZLRMLQSYLJXBCXTLWDQZPCYCYKPPPNSXFYZJJRCEMHSZMSXLXGLRWGCSTLRSXBZGBZGZTCPLUJLSLYLYMTXMTZPALZXPXJTJWTCYYZLBLXBZLQMYLXPGHDSLSSDMXMBDZZSXWHAMLCZCPJMCNHJYSNSYGCHSKQMZZQDLLKABLWJXSFMOCDXJRRLYQZKJMYBYQLYHETFJZFRFKSRYXFJTWDSXXSYSQJYSLYXWJHSNLXYYXHBHAWHHJZXWMYLJCSSLKYDZTXBZSYFDXGXZJKHSXXYBSSXDPYNZWRPTQZCZENYGCXQFJYKJBZMLJCMQQXUOXSLYXXLYLLJDZBTYMHPFSTTQQWLHOKYBLZZALZXQLHZWRRQHLSTMYPYXJJXMQSJFNBXYXYJXXYQYLTHYLQYFMLKLJTMLLHSZWKZHLJMLHLJKLJSTLQXYLMBHHLNLZXQJHXCFXXLHYHJJGBYZZKBXSCQDJQDSUJZYYHZHHMGSXCSYMXFEBCQWWRBPYYJQTYZCYQYQQZYHMWFFHGZFRJFCDPXNTQYZPDYKHJLFRZXPPXZDBBGZQSTLGDGYLCQMLCHHMFYWLZYXKJLYPQHSYWMQQGQZMLZJNSQXJQSYJYCBEHSXFSZPXZWFLLBCYYJDYTDTHWZSFJMQQYJLMQXXLLDTTKHHYBFPWTYYSQQWNQWLGWDEBZWCMYGCULKJXTMXMYJSXHYBRWFYMWFRXYQMXYSZTZZTFYKMLDHQDXWYYNLCRYJBLPSXCXYWLSPRRJWXHQYPHTYDNXHHMMYWYTZCSQMTSSCCDALWZTCPQPYJLLQZYJSWXMZZMMYLMXCLMXCZMXMZSQTZPPQQBLPGXQZHFLJJHYTJSRXWZXSCCDLXTYJDCQJXSLQYCLZXLZZXMXQRJMHRHZJBHMFLJLMLCLQNLDXZLLLPYPSYJYSXCQQDCMQJZZXHNPNXZMEKMXHYKYQLXSXTXJYYHWDCWDZHQYYBGYBCYSCFGPSJNZDYZZJZXRZRQJJYMCANYRJTLDPPYZBSTJKXXZYPFDWFGZZRPYMTNGXZQBYXNBUFNQKRJQZMJEGRZGYCLKXZDSKKNSXKCLJSPJYYZLQQJYBZSSQLLLKJXTBKTYLCCDDBLSPPFYLGYDTZJYQGGKQTTFZXBDKTYYHYBBFYTYYBCLPDYTGDHRYRNJSPTCSNYJQHKLLLZSLYDXXWBCJQSPXBPJZJCJDZFFXXBRMLAZHCSNDLBJDSZBLPRZTSWSBXBCLLXXLZDJZSJPYLYXXYFTFFFBHJJXGBYXJPMMMPSSJZJMTLYZJXSWXTYLEDQPJMYGQZJGDJLQJWJQLLSJGJGYGMSCLJJXDTYGJQJQJCJZCJGDZZSXQGSJGGCXHQXSNQLZZBXHSGZXCXYLJXYXYYDFQQJHJFXDHCTXJYRXYSQTJXYEFYYSSYYJXNCYZXFXMSYSZXYYSCHSHXZZZGZZZGFJDLTYLNPZGYJYZYYQZPBXQBDZTZCZYXXYHHSQXSHDHGQHJHGYWSZTMZMLHYXGEBTYLZKQWYTJZRCLEKYSTDBCYKQQSAYXCJXWWGSBHJYZYDHCSJKQCXSWXFLTYNYZPZCCZJQTZWJQDZZZQZLJJXLSBHPYXXPSXSHHEZTXFPTLQYZZXHYTXNCFZYYHXGNXMYWXTZSJPTHHGYMXMXQZXTSBCZYJYXXTYYZYPCQLMMSZMJZZLLZXGXZAAJZYXJMZXWDXZSXZDZXLEYJJZQBHZWZZZQTZPSXZTDSXJJJZNYAZPHXYYSRNQDTHZHYYKYJHDZXZLSWCLYBZYECWCYCRYLCXNHZYDZYDYJDFRJJHTRSQTXYXJRJHOJYNXELXSFSFJZGHPZSXZSZDZCQZBYYKLSGSJHCZSHDGQGXYZGXCHXZJWYQWGYHKSSEQZZNDZFKWYSSTCLZSTSYMCDHJXXYWEYXCZAYDMPXMDSXYBSQMJMZJMTZQLPJYQZCGQHXJHHLXXHLHDLDJQCLDWBSXFZZYYSCHTYTYYBHECXHYKGJPXHHYZJFXHWHBDZFYZBCAPNPGNYDMSXHMMMMAMYNBYJTMPXYYMCTHJBZYFCGTYHWPHFTWZZEZSBZEGPFMTSKFTYCMHFLLHGPZJXZJGZJYXZSBBQSCZZLZCCSTPGXMJSFTCCZJZDJXCYBZLFCJSYZFGSZLYBCWZZBYZDZYPSWYJZXZBDSYUXLZZBZFYGCZXBZHZFTPBGZGEJBSTGKDMFHYZZJHZLLZZGJQZLSFDJSSCBZGPDLFZFZSZYZYZSYGCXSNXXCHCZXTZZLJFZGQSQYXZJQDCCZTQCDXZJYQJQCHXZTDLGSCXZSYQJQTZWLQDQZTQCHQQJZYEZZZPBWKDJFCJPZTYPQYQTTYNLMBDKTJZPQZQZZFPZSBNJLGYJDXJDZZKZGQKXDLPZJTCJDQBXDJQJSTCKNXBXZMSLYJCQMTJQWWCJQNJNLLLHJCWQTBZQYDZCZPZZDZYDDCYZZZCCJTTJFZDPRRTZTJDCQTQZDTJNPLZBCLLCTZSXKJZQZPZLBZRBTJDCXFCZDBCCJJLTQQPLDCGZDBBZJCQDCJWYNLLZYZCCDWLLXWZLXRXNTQQCZXKQLSGDFQTDDGLRLAJJTKUYMKQLLTZYTDYYCZGJWYXDXFRSKSTQTENQMRKQZHHQKDLDAZFKYPBGGPZREBZZYKZZSPEGJXGYKQZZZSLYSYYYZWFQZYLZZLZHWCHKYPQGNPGBLPLRRJYXCCSYYHSFZFYBZYYTGZXYLXCZWXXZJZBLFFLGSKHYJZEYJHLPLLLLCZGXDRZELRHGKLZZYHZLYQSZZJZQLJZFLNBHGWLCZCFJYSPYXZLZLXGCCPZBLLCYBBBBUBBCBPCRNNZCZYRBFSRLDCGQYYQXYGMQZWTZYTYJXYFWTEHZZJYWLCCNTZYJJZDEDPZDZTSYQJHDYMBJNYJZLXTSSTPHNDJXXBYXQTZQDDTJTDYYTGWSCSZQFLSHLGLBCZPHDLYZJYCKWTYTYLBNYTSDSYCCTYSZYYEBHEXHQDTWNYGYCLXTSZYSTQMYGZAZCCSZZDSLZCLZRQXYYELJSBYMXSXZTEMBBLLYYLLYTDQYSHYMRQWKFKBFXNXSBYCHXBWJYHTQBPBSBWDZYLKGZSKYHXQZJXHXJXGNLJKZLYYCDXLFYFGHLJGJYBXQLYBXQPQGZTZPLNCYPXDJYQYDYMRBESJYYHKXXSTMXRCZZYWXYQYBMCLLYZHQYZWQXDBXBZWZMSLPDMYSKFMZKLZCYQYCZLQXFZZYDQZPZYGYJYZMZXDZFYFYTTQTZHGSPCZMLCCYTZXJCYTJMKSLPZHYSNZLLYTPZCTZZCKTXDHXXTQCYFKSMQCCYYAZHTJPCYLZLYJBJXTPNYLJYYNRXSYLMMNXJSMYBCSYSYLZYLXJJQYLDZLPQBFZZBLFNDXQKCZFYWHGQMRDSXYCYTXNQQJZYYPFZXDYZFPRXEJDGYQBXRCNFYYQPGHYJDYZXGRHTKYLNWDZNTSMPKLBTHBPYSZBZTJZSZZJTYYXZPHSSZZBZCZPTQFZMYFLYPYBBJQXZMXXDJMTSYSKKBJZXHJCKLPSMKYJZCXTMLJYXRZZQSLXXQPYZXMKYXXXJCLJPRMYYGADYSKQLSNDHYZKQXZYZTCGHZTLMLWZYBWSYCTBHJHJFCWZTXWYTKZLXQSHLYJZJXTMPLPYCGLTBZZTLZJCYJGDTCLKLPLLQPJMZPAPXYZLKKTKDZCZZBNZDYDYQZJYJGMCTXLTGXSZLMLHBGLKFWNWZHDXUHLFMKYSLGXDTWWFRJEJZTZHYDXYKSHWFZCQSHKTMQQHTZHYMJDJSKHXZJZBZZXYMPAGQMSTPXLSKLZYNWRTSQLSZBPSPSGZWYHTLKSSSWHZZLYYTNXJGMJSZSUFWNLSOZTXGXLSAMMLBWLDSZYLAKQCQCTMYCFJBSLXCLZZCLXXKSBZQCLHJPSQPLSXXCKSLNHPSFQQYTXYJZLQLDXZQJZDYYDJNZPTUZDSKJFSLJHYLZSQZLBTXYDGTQFDBYAZXDZHZJNHHQBYKNXJJQCZMLLJZKSPLDYCLBBLXKLELXJLBQYCXJXGCNLCQPLZLZYJTZLJGYZDZPLTQCSXFDMNYCXGBTJDCZNBGBQYQJWGKFHTNPYQZQGBKPBBYZMTJDYTBLSQMPSXTBNPDXKLEMYYCJYNZCTLDYKZZXDDXHQSHDGMZSJYCCTAYRZLPYLTLKXSLZCGGEXCLFXLKJRTLQJAQZNCMBYDKKCXGLCZJZXJHPTDJJMZQYKQSECQZDSHHADMLZFMMZBGNTJNNLGBYJBRBTMLBYJDZXLCJLPLDLPCQDHLXZLYCBLCXZZJADJLNZMMSSSMYBHBSQKBHRSXXJMXSDZNZPXLGBRHWGGFCXGMSKLLTSJYYCQLTSKYWYYHYWXBXQYWPYWYKQLSQPTNTKHQCWDQKTWPXXHCPTHTWUMSSYHBWCRWXHJMKMZNGWTMLKFGHKJYLSYYCXWHYECLQHKQHTTQKHFZLDXQWYZYYDESBPKYRZPJFYYZJCEQDZZDLATZBBFJLLCXDLMJSSXEGYGSJQXCWBXSSZPDYZCXDNYXPPZYDLYJCZPLTXLSXYZYRXCYYYDYLWWNZSAHJSYQYHGYWWAXTJZDAXYSRLTDPSSYYFNEJDXYZHLXLLLZQZSJNYQYQQXYJGHZGZCYJCHZLYCDSHWSHJZYJXCLLNXZJJYYXNFXMWFPYLCYLLABWDDHWDXJMCXZTZPMLQZHSFHZYNZTLLDYWLSLXHYMMYLMBWWKYXYADTXYLLDJPYBPWUXJMWMLLSAFDLLYFLBHHHBQQLTZJCQJLDJTFFKMMMBYTHYGDCQRDDWRQJXNBYSNWZDBYYTBJHPYBYTTJXAAHGQDQTMYSTQXKBTZPKJLZRBEQQSSMJJBDJOTGTBXPGBKTLHQXJJJCTHXQDWJLWRFWQGWSHCKRYSWGFTGYGBXSDWDWRFHWYTJJXXXJYZYSLPYYYPAYXHYDQKXSHXYXGSKQHYWFDDDPPLCJLQQEEWXKSYYKDYPLTJTHKJLTCYYHHJTTPLTZZCDLTHQKZXQYSTEEYWYYZYXXYYSTTJKLLPZMCYHQGXYHSRMBXPLLNQYDQHXSXXWGDQBSHYLLPJJJTHYJKYPPTHYYKTYEZYENMDSHLCRPQFDGFXZPSFTLJXXJBSWYYSKSFLXLPPLBBBLBSFXFYZBSJSSYLPBBFFFFSSCJDSTZSXZRYYSYFFSYZYZBJTBCTSBSDHRTJJBYTCXYJEYLXCBNEBJDSYXYKGSJZBXBYTFZWGENYHHTHZHHXFWGCSTBGXKLSXYWMTMBYXJSTZSCDYQRCYTWXZFHMYMCXLZNSDJTTTXRYCFYJSBSDYERXJLJXBBDEYNJGHXGCKGSCYMBLXJMSZNSKGXFBNBPTHFJAAFXYXFPXMYPQDTZCXZZPXRSYWZDLYBBKTYQPQJPZYPZJZNJPZJLZZFYSBTTSLMPTZRTDXQSJEHBZYLZDHLJSQMLHTXTJECXSLZZSPKTLZKQQYFSYGYWPCPQFHQHYTQXZKRSGTTSQCZLPTXCDYYZXSQZSLXLZMYCPCQBZYXHBSXLZDLTCDXTYLZJYYZPZYZLTXJSJXHLPMYTXCQRBLZSSFJZZTNJYTXMYJHLHPPLCYXQJQQKZZSCPZKSWALQSBLCCZJSXGWWWYGYKTJBBZTDKHXHKGTGPBKQYSLPXPJCKBMLLXDZSTBKLGGQKQLSBKKTFXRMDKBFTPZFRTBBRFERQGXYJPZSSTLBZTPSZQZSJDHLJQLZBPMSMMSXLQQNHKNBLRDDNXXDHDDJCYYGYLXGZLXSYGMQQGKHBPMXYXLYTQWLWGCPBMQXCYZYDRJBHTDJYHQSHTMJSBYPLWHLZFFNYPMHXXHPLTBQPFBJWQDBYGPNZTPFZJGSDDTQSHZEAWZZYLLTYYBWJKXXGHLFKXDJTMSZSQYNZGGSWQSPHTLSSKMCLZXYSZQZXNCJDQGZDLFNYKLJCJLLZLMZZNHYDSSHTHZZLZZBBHQZWWYCRZHLYQQJBEYFXXXWHSRXWQHWPSLMSSKZTTYGYQQWRSLALHMJTQJSMXQBJJZJXZYZKXBYQXBJXSHZTSFJLXMXZXFGHKZSZGGYLCLSARJYHSLLLMZXELGLXYDJYTLFBHBPNLYZFBBHPTGJKWETZHKJJXZXXGLLJLSTGSHJJYQLQZFKCGNNDJSSZFDBCTWWSEQFHQJBSAQTGYPQLBXBMMYWXGSLZHGLZGQYFLZBYFZJFRYSFMBYZHQGFWZSYFYJJPHZBYYZFFWODGRLMFTWLBZGYCQXCDJYGZYYYYTYTYDWEGAZYHXJLZYYHLRMGRXXZCLHNELJJTJTPWJYBJJBXJJTJTEEKHWSLJPLPSFYZPQQBDLQJJTYYQLYZKDKSQJYYQZLDQTGJQYZJSUCMRYQTHTEJMFCTYHYPKMHYZWJDQFHYYXWSHCTXRLJHQXHCCYYYJLTKTTYTMXGTCJTZAYYOCZLYLBSZYWJYTSJYHBYSHFJLYGJXXTMZYYLTXXYPZLXYJZYZYYPNHMYMDYYLBLHLSYYQQLLNJJYMSOYQBZGDLYXYLCQYXTSZEGXHZGLHWBLJHEYXTWQMAKBPQCGYSHHEGQCMWYYWLJYJHYYZLLJJYLHZYHMGSLJLJXCJJYCLYCJPCPZJZJMMYLCQLNQLJQJSXYJMLSZLJQLYCMMHCFMMFPQQMFYLQMCFFQMMMMHMZNFHHJGTTHHKHSLNCHHYQDXTMMQDCYZYXYQMYQYLTDCYYYZAZZCYMZYDLZFFFMMYCQZWZZMABTBYZTDMNZZGGDFTYPCGQYTTSSFFWFDTZQSSYSTWXJHXYTSXXYLBYQHWWKXHZXWZNNZZJZJJQJCCCHYYXBZXZCYZTLLCQXYNJYCYYCYNZZQYYYEWYCZDCJYCCHYJLBTZYYCQWMPWPYMLGKDLDLGKQQBGYCHJXY";
//此处收录了375个多音字
var oMultiDiff = {
    "19969": "DZ",
    "19975": "WM",
    "19988": "QJ",
    "20048": "YL",
    "20056": "SC",
    "20060": "NM",
    "20094": "QG",
    "20127": "QJ",
    "20167": "QC",
    "20193": "YG",
    "20250": "KH",
    "20256": "ZC",
    "20282": "SC",
    "20285": "QJG",
    "20291": "TD",
    "20314": "YD",
    "20340": "NE",
    "20375": "TD",
    "20389": "YJ",
    "20391": "CZ",
    "20415": "PB",
    "20446": "YS",
    "20447": "SQ",
    "20504": "TC",
    "20608": "KG",
    "20854": "QJ",
    "20857": "ZC",
    "20911": "PF",
    "20504": "TC",
    "20608": "KG",
    "20854": "QJ",
    "20857": "ZC",
    "20911": "PF",
    "20985": "AW",
    "21032": "PB",
    "21048": "XQ",
    "21049": "SC",
    "21089": "YS",
    "21119": "JC",
    "21242": "SB",
    "21273": "SC",
    "21305": "YP",
    "21306": "QO",
    "21330": "ZC",
    "21333": "SDC",
    "21345": "QK",
    "21378": "CA",
    "21397": "SC",
    "21414": "XS",
    "21442": "SC",
    "21477": "JG",
    "21480": "TD",
    "21484": "ZS",
    "21494": "YX",
    "21505": "YX",
    "21512": "HG",
    "21523": "XH",
    "21537": "PB",
    "21542": "PF",
    "21549": "KH",
    "21571": "E",
    "21574": "DA",
    "21588": "TD",
    "21589": "O",
    "21618": "ZC",
    "21621": "KHA",
    "21632": "ZJ",
    "21654": "KG",
    "21679": "LKG",
    "21683": "KH",
    "21710": "A",
    "21719": "YH",
    "21734": "WOE",
    "21769": "A",
    "21780": "WN",
    "21804": "XH",
    "21834": "A",
    "21899": "ZD",
    "21903": "RN",
    "21908": "WO",
    "21939": "ZC",
    "21956": "SA",
    "21964": "YA",
    "21970": "TD",
    "22003": "A",
    "22031": "JG",
    "22040": "XS",
    "22060": "ZC",
    "22066": "ZC",
    "22079": "MH",
    "22129": "XJ",
    "22179": "XA",
    "22237": "NJ",
    "22244": "TD",
    "22280": "JQ",
    "22300": "YH",
    "22313": "XW",
    "22331": "YQ",
    "22343": "YJ",
    "22351": "PH",
    "22395": "DC",
    "22412": "TD",
    "22484": "PB",
    "22500": "PB",
    "22534": "ZD",
    "22549": "DH",
    "22561": "PB",
    "22612": "TD",
    "22771": "KQ",
    "22831": "HB",
    "22841": "JG",
    "22855": "QJ",
    "22865": "XQ",
    "23013": "ML",
    "23081": "WM",
    "23487": "SX",
    "23558": "QJ",
    "23561": "YW",
    "23586": "YW",
    "23614": "YW",
    "23615": "SN",
    "23631": "PB",
    "23646": "ZS",
    "23663": "ZT",
    "23673": "YG",
    "23762": "TD",
    "23769": "ZS",
    "23780": "QJ",
    "23884": "QK",
    "24055": "XH",
    "24113": "DC",
    "24162": "ZC",
    "24191": "GA",
    "24273": "QJ",
    "24324": "NL",
    "24377": "TD",
    "24378": "QJ",
    "24439": "PF",
    "24554": "ZS",
    "24683": "TD",
    "24694": "WE",
    "24733": "LK",
    "24925": "TN",
    "25094": "ZG",
    "25100": "XQ",
    "25103": "XH",
    "25153": "PB",
    "25170": "PB",
    "25179": "KG",
    "25203": "PB",
    "25240": "ZS",
    "25282": "FB",
    "25303": "NA",
    "25324": "KG",
    "25341": "ZY",
    "25373": "WZ",
    "25375": "XJ",
    "25384": "A",
    "25457": "A",
    "25528": "SD",
    "25530": "SC",
    "25552": "TD",
    "25774": "ZC",
    "25874": "ZC",
    "26044": "YW",
    "26080": "WM",
    "26292": "PB",
    "26333": "PB",
    "26355": "ZY",
    "26366": "CZ",
    "26397": "ZC",
    "26399": "QJ",
    "26415": "ZS",
    "26451": "SB",
    "26526": "ZC",
    "26552": "JG",
    "26561": "TD",
    "26588": "JG",
    "26597": "CZ",
    "26629": "ZS",
    "26638": "YL",
    "26646": "XQ",
    "26653": "KG",
    "26657": "XJ",
    "26727": "HG",
    "26894": "ZC",
    "26937": "ZS",
    "26946": "ZC",
    "26999": "KJ",
    "27099": "KJ",
    "27449": "YQ",
    "27481": "XS",
    "27542": "ZS",
    "27663": "ZS",
    "27748": "TS",
    "27784": "SC",
    "27788": "ZD",
    "27795": "TD",
    "27812": "O",
    "27850": "PB",
    "27852": "MB",
    "27895": "SL",
    "27898": "PL",
    "27973": "QJ",
    "27981": "KH",
    "27986": "HX",
    "27994": "XJ",
    "28044": "YC",
    "28065": "WG",
    "28177": "SM",
    "28267": "QJ",
    "28291": "KH",
    "28337": "ZQ",
    "28463": "TL",
    "28548": "DC",
    "28601": "TD",
    "28689": "PB",
    "28805": "JG",
    "28820": "QG",
    "28846": "PB",
    "28952": "TD",
    "28975": "ZC",
    "29100": "A",
    "29325": "QJ",
    "29575": "SL",
    "29602": "FB",
    "30010": "TD",
    "30044": "CX",
    "30058": "PF",
    "30091": "YSP",
    "30111": "YN",
    "30229": "XJ",
    "30427": "SC",
    "30465": "SX",
    "30631": "YQ",
    "30655": "QJ",
    "30684": "QJG",
    "30707": "SD",
    "30729": "XH",
    "30796": "LG",
    "30917": "PB",
    "31074": "NM",
    "31085": "JZ",
    "31109": "SC",
    "31181": "ZC",
    "31192": "MLB",
    "31293": "JQ",
    "31400": "YX",
    "31584": "YJ",
    "31896": "ZN",
    "31909": "ZY",
    "31995": "XJ",
    "32321": "PF",
    "32327": "ZY",
    "32418": "HG",
    "32420": "XQ",
    "32421": "HG",
    "32438": "LG",
    "32473": "GJ",
    "32488": "TD",
    "32521": "QJ",
    "32527": "PB",
    "32562": "ZSQ",
    "32564": "JZ",
    "32735": "ZD",
    "32793": "PB",
    "33071": "PF",
    "33098": "XL",
    "33100": "YA",
    "33152": "PB",
    "33261": "CX",
    "33324": "BP",
    "33333": "TD",
    "33406": "YA",
    "33426": "WM",
    "33432": "PB",
    "33445": "JG",
    "33486": "ZN",
    "33493": "TS",
    "33507": "QJ",
    "33540": "QJ",
    "33544": "ZC",
    "33564": "XQ",
    "33617": "YT",
    "33632": "QJ",
    "33636": "XH",
    "33637": "YX",
    "33694": "WG",
    "33705": "PF",
    "33728": "YW",
    "33882": "SR",
    "34067": "WM",
    "34074": "YW",
    "34121": "QJ",
    "34255": "ZC",
    "34259": "XL",
    "34425": "JH",
    "34430": "XH",
    "34485": "KH",
    "34503": "YS",
    "34532": "HG",
    "34552": "XS",
    "34558": "YE",
    "34593": "ZL",
    "34660": "YQ",
    "34892": "XH",
    "34928": "SC",
    "34999": "QJ",
    "35048": "PB",
    "35059": "SC",
    "35098": "ZC",
    "35203": "TQ",
    "35265": "JX",
    "35299": "JX",
    "35782": "SZ",
    "35828": "YS",
    "35830": "E",
    "35843": "TD",
    "35895": "YG",
    "35977": "MH",
    "36158": "JG",
    "36228": "QJ",
    "36426": "XQ",
    "36466": "DC",
    "36710": "JC",
    "36711": "ZYG",
    "36767": "PB",
    "36866": "SK",
    "36951": "YW",
    "37034": "YX",
    "37063": "XH",
    "37218": "ZC",
    "37325": "ZC",
    "38063": "PB",
    "38079": "TD",
    "38085": "QY",
    "38107": "DC",
    "38116": "TD",
    "38123": "YD",
    "38224": "HG",
    "38241": "XTC",
    "38271": "ZC",
    "38415": "YE",
    "38426": "KH",
    "38461": "YD",
    "38463": "AE",
    "38466": "PB",
    "38477": "XJ",
    "38518": "YT",
    "38551": "WK",
    "38585": "ZC",
    "38704": "XS",
    "38739": "LJ",
    "38761": "GJ",
    "38808": "SQ",
    "39048": "JG",
    "39049": "XJ",
    "39052": "HG",
    "39076": "CZ",
    "39271": "XT",
    "39534": "TD",
    "39552": "TD",
    "39584": "PB",
    "39647": "SB",
    "39730": "LG",
    "39748": "TPB",
    "40109": "ZQ",
    "40479": "ND",
    "40516": "HG",
    "40536": "HG",
    "40583": "QJ",
    "40765": "YQ",
    "40784": "QJ",
    "40840": "YK",
    "40863": "QJG"
};

//返回值:拼音首字母串数组
String.prototype.getFirstChar = function() {
    var arrResult = new Array(); //保存中间结果的数组
    for (var i = 0, len = this.length; i < len; i++) {
        //获得unicode码
        var ch = this.charAt(i);
        //检查该unicode码是否在处理范围之内,在则返回该码对映汉字的拼音首字母,不在则调用其它函数处理
        arrResult.push(checkCh(ch));
    }
    //处理arrResult,返回所有可能的拼音首字母串数组
    return mkRslt(arrResult);

    function checkCh(ch) {
        var uni = ch.charCodeAt(0);
        //如果不在汉字处理范围之内,返回原字符,也可以调用自己的处理函数
        if (uni > 40869 || uni < 19968)
            return ch; //dealWithOthers(ch);
        //检查是否是多音字,是按多音字处理,不是就直接在strChineseFirstPY字符串中找对应的首字母
        return (oMultiDiff[uni] ? oMultiDiff[uni] : (strChineseFirstPY.charAt(uni - 19968)));
    }

    function mkRslt(arr) {
        var arrRslt = [""];
        for (var i = 0, len = arr.length; i < len; i++) {
            var str = arr[i];
            var strlen = str.length;
            if (strlen == 1) {
                for (var k = 0; k < arrRslt.length; k++) {
                    arrRslt[k] += str;
                }
            } else {
                var tmpArr = arrRslt.slice(0);
                arrRslt = [];
                for (k = 0; k < strlen; k++) {
                    //复制一个相同的arrRslt
                    var tmp = tmpArr.slice(0);
                    //把当前字符str[k]添加到每个元素末尾
                    for (var j = 0; j < tmp.length; j++) {
                        tmp[j] += str.charAt(k);
                    }
                    //把复制并修改后的数组连接到arrRslt上
                    arrRslt = arrRslt.concat(tmp);
                }
            }
        }
        return arrRslt;
    }
}

Date.prototype.format = function(fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};

if ($.browser.msie && window.console == null) {
    window.console = {
        log: function() {},
        info: function() {},
        debug: function() {}
    };
}

//用JavaScript解决Placeholder的IE8兼容问题
function isPlaceholder() {
    var input = document.createElement('input');
    return 'placeholder' in input;
}
var funPlaceholder = function(element) {
    //检测是否需要模拟placeholder
    var placeholder = '';
    if (element && !("placeholder" in document.createElement("input")) && (placeholder = element.getAttribute("placeholder"))) {
        if ($(element).prev('label').hasClass('hik-placeholder')) {
            return false;
        }
        //当前文本控件是否有id, 没有则创建
        var idLabel = element.id;
        if (!idLabel) {
            idLabel = "placeholder_" + Math.round(Math.random()*100000000000);
            element.id = idLabel;
        }
        //创建label元素
        var eleLabel = document.createElement("label");
        eleLabel.htmlFor = idLabel;
        eleLabel.style.position = "absolute";
        //根据文本框实际尺寸修改这里的margin值
        eleLabel.style.margin = "2px 0 0 10px";
        eleLabel.style.lineHeight = $(element).height() + "px";
        eleLabel.style.color = "graytext";
        eleLabel.style.cursor = "text";
        eleLabel.style.fontWeight = "normal";
        eleLabel.className = "hik-placeholder";
        eleLabel.style.width = $(element).width() + "px";
        eleLabel.style.height = $(element).height() + "px";
        eleLabel.style.overflow = "hidden";
        //插入创建的label元素节点
        element.parentNode.insertBefore(eleLabel, element);
        //事件
        $(element).on("focus", function() {
            eleLabel.innerHTML = "";
        });
        $(element).on("blur", function() {
            if (this.value === "") {
                eleLabel.innerHTML = this.getAttribute("placeholder");
            }
            //checkValue(this);
        });

        //样式初始化
        if (element.value === "") {
            eleLabel.innerHTML = placeholder;
        }
    }
};
var setPlaceholder = function() {
        $("input").each(function(index, el) {
            if ($(el).width() > 0) {
                funPlaceholder(this);
            }
        });
    }
    // 不支持placeholder 用jquery来完成
if (!isPlaceholder()) {
    $(document).ready(function() {
        if (!isPlaceholder()) {
            //把input绑定事件 排除password框
            setPlaceholder();
        }
    });
}

//by wangqin 动态绑定，实现IE8的maxlength
$('body').delegate('textarea[maxlength]', 'keyup', function() {
    var area = $(this);
    var max = parseInt(area.attr("maxlength"), 10); //获取maxlength的值
    if (max > 0) {
        if (area.val().length > max) { //textarea的文本长度大于maxlength
            area.val(area.val().substr(0, max)); //截断textarea的文本重新赋值
        }
    }
})


/**
 * 防止用户过时操作
 * @author xiangxiao
 * @date   2015-05-14
 */
$.clearTimeOut = function(num) {
    var time = num ? num : 600000; //默认10分钟
    setInterval(function() {
        if (basePath == "") {
            $.ajax({
                url: basePath + "/sysConfig/showVersionInfo",
                type: "GET",
                mask:false,
                complete: function(){
                    $.fn.unmask;
                }
            });
        } else {
            $.ajax({
                url: debugurl + "/sysConfig/showVersionInfo",
                type: "GET",
                mask:false,
                complete: function(){
                    $.fn.unmask;
                }
            });
        }
    }, time);

}
