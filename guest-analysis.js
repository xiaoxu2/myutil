define(["LsCommon", "./guest-analysis/ga-left-store","./guest-analysis/ga-right-guest-analysis"], function(require, exports, module) {
    var guestAnalysisView = Backbone.View.extend({
        el: "#guest-analysis",
        initialize: function() {
            this.guestStatiscsInit();
            var LsCommon = require("LsCommon");
            var lsCommonInstance = new LsCommon();
            lsCommonInstance.init(this.initWindow);
            //左边的模块
            var gaLeftStore = require("./guest-analysis/ga-left-store");
            this.gaLeftStore = new gaLeftStore();
            //右边潜客分析模块
            var gaRightGuestAnalysis = require("./guest-analysis/ga-right-guest-analysis");
            this.gaRightGuestAnalysis = new gaRightGuestAnalysis();
            //发布事件
            var param={id:"-1",type:"",name:"所有门店"};
            window.PubSub.publish("guestLeftAddressClick",param);
            
            //滚动时隐藏弹出的时间控件
            $("#guest-analysis .ga-menu-center").off().on("scroll",function () {
                if($("div[lang='zh-cn']")){
                	$("div[lang='zh-cn']").hide();
                }
            });
        },
        /**
         * [guestStatiscsInit description]页面初始化
         * @author wanghaiyan
         * @date   2015-12-14
         * @return {[type]}   [description]
         */
        guestStatiscsInit: function() {
            //左边的高度自适应
            $(".ga-address-module").height($.getHikHeight(149));
            //图标定位
            $("#ga-flex-left,#ga-flex-right").css('top', Math.floor($.getHikHeight(66) / 2) + "px");
        },
        events: {
        	"click #ga-flex-right":"flexRight",
        	"click #ga-flex-left":"flexLeft"
        },
        initWindow: function() {
            $(window).off('resize').on("resize", function() {
                $(".hik-center").height($.getHikHeight(66));
                $(".ga-address-module").height($.getHikHeight(149));
                $("#ga-flex-left,#ga-flex-right").css('top', Math.floor($.getHikHeight(66) / 2) + "px");
            });
        },
        flexRight:function(){
        	$(".ga-menu-west").hide();
        	$("#ga-flex-left").show();
        	$(".ga-menu-wrap").width("100%");
        	$(".ga-fix-module").width("1280px");
        	this.gaRightGuestAnalysis.resize();
        },
        flexLeft:function(){
        	$(".ga-menu-west").show();
        	$("#ga-flex-left").hide();
        	$(".ga-menu-wrap").width("82%");
        	$(".ga-fix-module").width("1048px");
        	this.gaRightGuestAnalysis.resize();
        },
        remove: function(){
            //统一删除事件订阅
            var gaLeftStoreToken = this.gaLeftStore.token,gaRightGuestAnalysisToken = this.gaRightGuestAnalysis.token;
            if(gaLeftStoreToken && gaLeftStoreToken.length>0){
                $.each(gaLeftStoreToken,function(index, el) {
                    window.PubSub.unsubscribe(el);
                });
            }
            if(gaRightGuestAnalysisToken && gaRightGuestAnalysisToken.length>0){
                $.each(gaRightGuestAnalysisToken,function(index, el) {
                    window.PubSub.unsubscribe(el);
                });
            }
            //view删除
            this.gaLeftStore.remove();
            this.gaRightGuestAnalysis.remove();
            this.$el.remove();
            this.stopListening();
            return this;
        }
    });
    module.exports = guestAnalysisView;
});
