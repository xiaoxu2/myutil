/**
 * [模块加载基础类]
 * @author Lisanchuan
 * @date2015-08-06
 */
define(["hiklyui", "libs"], function (require, exports, module) {
    var heart = null;
    var PemsRouter = Backbone.Router.extend({
        routes: {
            '': 'home',
            'pemsLoad/:mod(/:subMod)(/:cs)': 'onPemsLoad'
        },
        home: function () {
            window.App.Router.pemsRouter.navigate("pemsLoad/baseConfig", {
                trigger: true
            });
        },
        onPemsLoad: function (mod, subMod, cs) {
            if (cs || subMod === "cs") {
                $("#tempHead").hide();
                $("#north-bottom").hide();
                if (heart == null) {
                    heart = window.setInterval(function () {
                        $.ajax({
                            url: '/pems/heart.action',
                            type: 'POST'
                        })
                    }, 60000);
                }
            } else {
                $("#tempHead").show();
                $("#north-bottom").show();
                if($(".nav-" + mod+":visible").length==0){
                	window.App.Router.pemsRouter.navigate($("ul.nav > li[code]:visible a").attr('href').replace(/#/g,""), {
                        trigger: true
                    });
                	return;
                }
                $(".nav-" + mod).addClass('active').siblings().removeClass('active');
            };

            var modBasePath = window.basePath + "/views/home/" + mod + "/",
                jsPathData = {
                    path: modBasePath + mod,
                    key: mod,
                    cnd: subMod
                },
                htmlPath = modBasePath + mod + ".html",
                cssPath = modBasePath + mod + ".css";
            window.App.util.loadModForPath("#pems-container", cssPath, htmlPath, jsPathData);

        }
    });


    window.App.Router.pemsRouter = new PemsRouter();
    window.pemsFunctionCodes = [20975936, 20975936, 20976000, 20975680, 20975744, 20975808, 20976064, 20975872];
    var BaseView = Backbone.View.extend({
        el: $('body'),
        initialize: function () {
        	var baseCofigNum=0;
            for (var i = 0, l = pemsFunctionCodes.length; i < l; i++) {
                var code = pemsFunctionCodes[i];
                var functionCodes = eval("[" + sysParam.functionCodes + "]");
                if ($.inArray(code, functionCodes) === -1) {
                	if($.inArray(code,[20975680,20975744,20975808,20976064,20975872])>-1){
                		baseCofigNum++;
                	}
                    $("[code=" + code + "]").hide();
                } else {
                    $("[code=" + code + "]").show();
                }
            };
            if(baseCofigNum==5){
            	$("[code=pemsLoad-baseConfig]").hide();
            }
            this.loadHead();
            //重置掉平台对应的所有resize事件
            $(window).off('resize');
            $(document.body).height($(window).height()).css('overflow', 'hidden');
            var resizeTimer = null;
            window.location.href.replace(/^[\s\S]+#/g, "")
                //头部高度
            var headHeight = new RegExp("/cs$").test(window.location.href.replace(/^[\s\S]+#/g, "")) ? 0 : $('#tempHead').height();
            //菜单高度
            var menuHeight = headHeight == 0 ? 0 : $('#north-bottom').height();
            var topMargin = menuHeight == 0 ? 0 : 10;
            var windowResize = function () {
                //重置掉前端的问题
                if (resizeTimer != null) {
                    clearTimeout(resizeTimer);
                }
                resizeTimer = setTimeout(function () {
                    var windowHeight = $(window).height();
                    $('#pems-container').height(windowHeight - topMargin - headHeight - menuHeight);
                    $('#pems-container').trigger('autoResize', $('#pems-container').height());
                    resizeTimer = null;
                }, 100);
            }
            $(window).on('resize', windowResize);
            $('#pems-container').height($(window).height() - topMargin - headHeight - menuHeight).css('margin-top', topMargin + 'px');
        },
        loadHead: function () {
            var url = "/views/home/js/head_data";
            if ($("#tempHead div").length === 0) {
                require.async(url, function (HeadData) {
                    var h = new HeadData();
                    h.init();
                });
            }
        },
        loadMainNav: function () {

        }
    });

    module.exports = BaseView;
});
