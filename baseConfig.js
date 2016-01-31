define(["libs"], function (require, exports, module) {

    var baseConfig = Backbone.View.extend({
        el: $('body'),
        initialize: function (subMod) {
            this.refsh(subMod);

        },
        switchType:"hide",
        refsh: function (subMod) {
            $("#baseConfig-tree").show();
            if (typeof (subMod) !== "string") {
                return window.App.Router.pemsRouter.navigate("pemsLoad/baseConfig/manageCfg", {
                    trigger: true
                });
            };
             for (var i = 0, l = pemsFunctionCodes.length; i < l; i++) {
                 var code = pemsFunctionCodes[i];
                 var functionCodes = eval("[" + sysParam.functionCodes + "]");
                 if ($.inArray(code, functionCodes) === -1) {
                     $("[code=" + code + "]").hide();
                 } else {
                     $("[code=" + code + "]").show();
                 }
             };
            this.loadSubMod(subMod);
            window.App.util.fullHikHeight();
        },
        loadSubMod: function (subMod) {
            $("#baseConfig-tree").empty();

            $(".js-baseConfig .panel-title").removeClass('active');
            $(".js-baseConfig [data-type='" + subMod + "']").addClass('active');


            var modBasePath = window.basePath + "/views/home/baseConfig/" + subMod + "/",
                jsPathData = {
                    path: modBasePath + subMod,
                    key: subMod
                },
                htmlPath = modBasePath + subMod + ".html",
                cssPath = modBasePath + subMod + ".css";
            window.App.util.loadModForPath("#baseConfig-center", cssPath, htmlPath, jsPathData);
        }
    });

    module.exports = baseConfig;
});
