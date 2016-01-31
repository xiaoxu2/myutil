define(["hiklylib", "hiklyui", "rmpUtil"], function(require, exports, module) {
    var rmpUtil = require("rmpUtil");
    var rmpRouter = Backbone.Router.extend({
        routes: {
            '': "home",
            'load/*path': 'bespokeLoad'
        },
        home: function(){
            var afterHead = function() {
                var firstEl = $(".main-menu li:visible").eq(0).find('a').attr('href');
                var firstType = firstEl.split("/")[1];
                var baseView = window.location.href.split("#load/")[1] || firstType;
                baseView = "load/" + baseView;
                window.App.Router.rmpRouter.navigate(baseView, {
                    trigger: true
                });
            };
            if ($("#tempHead div").length === 0) {
                require.async("head", function(HeadData) {
                    var h = new HeadData();
                    h.init(afterHead);
                });
            }
        },
        loadRMPLoad: function(pathData) {
            var path = pathData.path,
                key = pathData.key;
            pathData.cnd = pathData.childPath;
            var contentId = "#load-container" //默认加载容器
            var htmlPath = basePath + "/views/" + path + "/" + key + ".jsp";
            var cssPath = "";
            var jsPath = basePath + "/views/" + path + "/js/" + key;
            pathData.path = jsPath;
            $(".father-js-" + key).addClass('active').siblings().removeClass('active');
            window.App.util.loadModForPath(contentId, cssPath, htmlPath, pathData);
        },
        besChildLoad: function(pathData) {
            var path = pathData.path,
                key = pathData.key,
                pathArr = path.split("/");
            pathData.cnd = pathData.childPath;
            var contentId = "#" + pathArr[pathArr.length - 2] + "-content" //默认加载容器
            var htmlPath = basePath + "/views/" + pathArr[0] + "/html/" + key + ".jsp";
            var cssPath = "";
            var jsPath = basePath + "/views/" + pathArr[0] + "/js/" + key;
            pathData.path = jsPath;
            $(".child-js-" + key).addClass('active').siblings().removeClass('active');
            window.App.util.loadModForPath(contentId, cssPath, htmlPath, pathData);
        },
        bespokeLoad: function(path) {
            var afterHead = function() {
                var firstEl = $(".main-menu li:visible").eq(0).find('a').attr('href');
                var firstType = firstEl.split("/")[1];
                var baseView = window.location.href.split("#load/")[1] || firstType;
                window.App.Router.rmpRouter.rmpApp(baseView)
            };
            if ($("#tempHead div").length === 0) {
                require.async("head", function(HeadData) {
                    var h = new HeadData();
                    h.init(afterHead);
                });
            } else {
                window.App.Router.rmpRouter.rmpApp(path)
            }

        },
        rmpApp: function(path) {
            //页面切换，将模块相关的dialog移除掉,头部的dialog保留
            if ($(".ui-hikly-dialog ")) {
                $.each($(".ui-hikly-dialog "), function(index, el) {
                    if (!($(this).has("#showCurrentUser").length > 0 ||
                            $(this).has("#ls-tips-dialog").length > 0 ||
                            $(this).has("#version").length > 0)) {
                        $(this).remove();
                    }
                });
            }
            //再将object移除到body下面
            $("body").append($("#ocxModule").addClass('hide'));

            //TODO 页面切换销毁控件
            var previewPatrolocx = document.getElementById("previewPatrolocx");
            var playbackPatrolocx = document.getElementById("playbackPatrolocx");
            var gisPreviewocx = document.getElementById("gisPreviewocx");
            if (previewPatrolocx) {
                try {
                    previewPatrolocx.PVX_StopPreview();
                } catch (error) {
                    console.log("实时巡店控件未定义");
                }
            }
            if (playbackPatrolocx) {
                try {
                    playbackPatrolocx.PBX_StopPlayALl();
                } catch (error) {}
                console.log("录像巡店控件未定义");
            }
            if (gisPreviewocx) {
                try {
                    gisPreviewocx.PVX_StopPreview();
                } catch (error) {
                    console.log("数据概览控件未定义");
                }

            }
            //路由处理
            var pathArr = path.split("/");
            var pathLength = pathArr.length;
            switch (pathLength) {
                case 1:
                    var pData = window.App.util.buildPath(path);
                    window.App.Router.rmpRouter.loadRMPLoad(pData);
                    break;
                case 2:
                    var pDataOne = window.App.util.buildPath(pathArr[0]);
                    var pDataTwo = window.App.util.buildPath(path);
                    pDataOne.childPath = pDataTwo;
                    if (!$('[modid="' + pathArr[0] + '"]').is(":visible")) {
                        window.App.Router.rmpRouter.loadRMPLoad(pDataOne);
                    } else {
                        window.App.Router.rmpRouter.besChildLoad(pDataTwo);
                    }
                    break;
                case 3:
                    var pDataOne = window.App.util.buildPath(pathArr[0]);
                    var pDataTwo = window.App.util.buildPath(pathArr[0] + "/" + pathArr[1]);
                    var pDataThree = window.App.util.buildPath(path);
                    pDataTwo.childPath = pDataThree;
                    pDataOne.childPath = pDataTwo;
                    if (!$('[modid="' + pathArr[0] + '"]').is(":visible")) {
                        window.App.Router.rmpRouter.loadRMPLoad(pDataOne);
                    } else {
                        if (!$('[modid="' + pathArr[1] + '"]').is(":visible")) {
                            window.App.Router.rmpRouter.besChildLoad(pDataTwo);
                        } else {
                            window.App.Router.rmpRouter.besChildLoad(pDataThree);
                        }
                    }
                    break;
            }
        }
    });
    window.App.Router.rmpRouter = new rmpRouter();
    var baseView = Backbone.View.extend({
        initialize: function() {
        }
    });
    module.exports = baseView;
})
