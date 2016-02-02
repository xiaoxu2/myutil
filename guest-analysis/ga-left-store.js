define(["/rmp/views/common/js/shop-address"], function(require, exports, module) {
    //地址类定义
    var shopAddress;
    var gaLeftStoreMode = Backbone.Model.extend({
        /**
         * [getLeftAddress description]左边的地址控件
         * @author wanghaiyan
         * @date   2015-12-14
         * @return {[type]}   [description]
         */
        getLeftAddress: function() {
            $.ajax({
                url: basePath + '/lsStore/getStoreCityListDto.action',
                type: 'POST',
                dataType: 'json',
                mask: false,
                success: function(data) {
                    var shopAddress = require("/rmp/views/common/js/shop-address");
                    var leftAddress = new shopAddress("#ga-address", data);
                    leftAddress.init();
                }
            });
        },
        /**
         * [getLeftShop description]左边的门店列表
         * @author wanghaiyan
         * @date   2015-12-15
         * @param  {[type]}   eventname [description]事件名称
         * @param  {[type]}   data [description]事件回调参数
         * @return {[type]}      [description]
         */
        getLeftShop: function(eventname,data) {
            //左边头部的门店名称更改
            if(data.name){
                $(".ga-jiantou-shop").html(data.name);
            }
            var searchKey = $("#ga-shop-serech").val();
            var id = data.id;
            $.ajax({
                type: "POST",
                url: basePath + '/lsStore/getStoreDTONoCityList.aciton',
                data: $.param({
                    controlOrRegionStr: id,
                    name: searchKey
                }, true),
                dataType: 'json',
                mask: false,
                success: function(data) {
                    window.PubSub.publish("guestLeftShopCallback", data);
                }
            });
        },
        getLeftShopCallback: function(eventname,data){
            $('.ga-address-module').empty();
            var addModuleArr = [];
            $.each(data, function(i, item) {
                var pinYin = item.pinYin;
                addModuleArr.push('<ul class="pa-city-' + pinYin + '">');
                $.each(item.data, function(j, index) {
                    if (j == 0) {
                        addModuleArr.push('<li title="' + index.name + '"  data-id="' + index.id + '" data-type="' + index.type + '" data-text="span"><span class="ga-py">' + index.pinYin + '</span><span name="storeName">' + index.name + '</span></li>')
                    } else {
                        addModuleArr.push('<li title="' + index.name + '"  data-id="' + index.id + '" data-type="' + index.type + '" data-text="span"><span class="ga-py"></span><span name="storeName">' + index.name + '</span></li>');
                    }
                });
                addModuleArr.push('</ul>');
            });
            $('.ga-address-module').html(addModuleArr.join(''));
        }
    });
    var gaLeftStoreView = Backbone.View.extend({
        el: "#ga-store-left",
        token: [],
        initialize: function() {
            this.module = new gaLeftStoreMode();
            this.module.getLeftAddress();
            //事件订阅
            var guestLeftAddressClick = window.PubSub.subscribe("guestLeftAddressClick", this.module.getLeftShop);
            var guestLeftShopCallback = window.PubSub.subscribe("guestLeftShopCallback", this.module.getLeftShopCallback);
            this.token.push(guestLeftAddressClick);
            this.token.push(guestLeftShopCallback);
        },
        events: {
            "click .ga-jiantou-shop": "gaAddressShow", //点击地址框出现
            "mouseleave .ga-dis-module": "gaAddressHide", //鼠标移开地址控件消失
            "click #ga-search-btn": "gaShopSearch",//门店过滤
            "click #ga-address li": "gaAddressChange", //点击地址的省市区
            "click .ga-address-module li": "gaShopChange", //点击门店
            "click .ga-jiantou-module": "gaAddressShowAll" //点击门店
        },
        gaAddressShow: function() {
            $("#ga-address").show();
        },
        gaAddressHide: function() {
            $("#ga-address").hide();
        },
        gaShopSearch: function(){
            var dataId = $(".ga-jiantou-shop").data("id");
            this.module.getLeftShop("",{id: dataId});
        },
        gaAddressChange: function(e) {
            //样式更改,id绑定
            var currentEl = $(e.currentTarget);
        	//发布事件
            var dataId = currentEl.data('id');
        	if(!dataId){
            	$.say("请选择地区");
            	return false;
            }
            var dataType = currentEl.data('type');
            var dataName = currentEl.find(".ls-add-pin-text").html();
            var param = {type: dataType,id: dataId,name: dataName};
        	$(".ga-jiantou-module").show();
            currentEl.addClass('active').siblings().removeClass('active');
            $(".ga-jiantou-shop").data('id', currentEl.data('id'));
            window.PubSub.publish("guestLeftAddressClick",param);
            $("#ga-address").hide();
        },
        gaShopChange: function(e) {
            //发布事件
            var param = {
                id: $(e.currentTarget).data("id"),
                type: $(e.currentTarget).data("type"),
                name: $(e.currentTarget).find("[name='storeName']").html()
            }
            
            $(".ga-jiantou-shop").html(param.name);
            $(".ga-jiantou-shop").data('id', param.id);
            $(".ga-jiantou-module").show();
            $(".ga-address-module li").removeClass('active');
            var currentEl = $(e.currentTarget);
            currentEl.addClass('active');
            
            window.PubSub.publish("gaLeftShopClick", param);
        },
        gaAddressShowAll: function(e) {
        	$(".ga-jiantou-module").hide();
        	 //发布事件
            var param={id:"-1",type:"",name:"所有门店"};
            $(".ga-jiantou-shop").data('id', -1);
            $(".ga-address-module li").removeClass('active');
            $("#ga-address li").removeClass('active');
            window.PubSub.publish("guestLeftAddressClick",param);
        }
    });
    module.exports = gaLeftStoreView;
});
