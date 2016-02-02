define(["../data-statis-common"], function(require, exports, module) {
    //会员报表公共逻辑
    var gaCommon = require("../data-statis-common");
    //chart定义
    var gaGuestAnalysisPiechart, gaGuestAnalysisBarchart;
    var paramObj={}
    var storeName;
    var rmpEcharts = App.echarts;
    //mode定义
    var gaRightGuestAnalysisMode = Backbone.Model.extend({
        getGuestAnalysisData: function(eventname, param) {
        	var statisticType =$("#ga-time-one .active").data("value");
        	var dateParamObj = gaCommon.getDateParamObj(statisticType,'ga',1);
        	if(statisticType=='custom'){
        		var isPass = checkDate(dateParamObj['startDate'],dateParamObj['endDate']);
        		if(!isPass){
        			return isPass;
        		}
        	}
            if(param){
            	paramObj={
            		areaType:param.type,
            		areaId:param.id.substring(param.id.indexOf('_')+1)
                };
            	storeName = param.name;
            	$("#ga-guest-tab .ga-li-title").html(storeName);
            }

        	paramObj['statisticType']=statisticType;
            paramObj['startDate'] = dateParamObj['startDate'];
            paramObj['endDate'] = dateParamObj['endDate'];
            paramObj['queryDate'] = dateParamObj['queryDate'];
            //ajax请求
            $.ajax({
                type: "POST",
                url: basePath + "/rmpGuestStatistic/getGuestGenderStatistic.action",
                data: JSON.stringify(paramObj),
                dataType: "json",
                contentType: 'application/json;charset=utf-8', //设置请求头信息  
                success: function(respData) {
                	App.Models["guest-analysis"]["gaRightGuestAnalysis"].module.getGuestAnalysisPieCallback(null,respData);
                    App.Models["guest-analysis"]["gaRightGuestAnalysis"].module.getGuestAnalysisBarCallback(null,respData);
                },
                failure:function(){
                	App.Models["guest-analysis"]["gaRightGuestAnalysis"].module.getGuestAnalysisPieCallback();
                    App.Models["guest-analysis"]["gaRightGuestAnalysis"].module.getGuestAnalysisBarCallback();
                }
            });
        },
        getGuestAnalysisPieCallback: function(eventname, paramData) {
            //生成chart表,男性比例
            var data = 50.00;
            if(paramData){
            	var femaleCount = 0;
            	var maleCount = 0;
            	//男性数量
            	$.each(paramData.lyAxis1,function(index,item){
            		maleCount +=item;
            	});
            	//女性数量
            	$.each(paramData.lyAxis2,function(index,item){
            		femaleCount +=item;
            	});
            	var total = femaleCount + maleCount;
            	if(total!=0){
            		data = (100*maleCount/total).toFixed(2);
            	}
            }
            var chartOption = {
                data: data,
                color: ["#fe7e7b","#00a0e8"]
            }
            var option = gaCommon.gaPieChartOption(chartOption,true);
            gaGuestAnalysisPiechart = window.App.util.creatCharts("ga-guest-left-pie", option, gaGuestAnalysisPiechart);
        },
        getGuestAnalysisBarCallback: function(eventname, paramData) {
            var chartOption = {};
            //生成chart表
            chartOption.data = {
                "sxAxis": ["婴幼儿","儿童","少年","青少年","青年","壮年","中年","中老年","老年"],
                "lyAxis1": [0, 0, 0, 0, 0, 0, 0, 0, 0],
                "lyAxis2": [0, 0, 0, 0, 0, 0, 0, 0, 0],
            };
            if(paramData){
            	chartOption.data.sxAxis = paramData.sxAxis;
            	//男性数量
            	chartOption.data.lyAxis1 = paramData.lyAxis1;
            	//女性数量
            	chartOption.data.lyAxis2 = paramData.lyAxis2;
            }
            chartOption.legend = {
                data: ['男性','女性'],
                textStyle: rmpEcharts.textStyle
            };
            chartOption.color = ["#00a0e8","#fe7e7b"];
            chartOption.yAxisFormatter = '{value}'
            chartOption.series = [{
                name: '男性',
                type: 'bar',
                stack: 'gender',
                barWidth: App.echarts.barWidth,
                data: chartOption.data.lyAxis1
            },{
                name: '女性',
                type: 'bar',
                stack: 'gender',
                barWidth: App.echarts.barWidth,
                data: chartOption.data.lyAxis2
            }];
            chartOption.trigger = 'axis';
            var option = gaCommon.msBarChartOption(chartOption);
            gaGuestAnalysisBarchart = window.App.util.creatCharts("ga-guest-right-bar", option, gaGuestAnalysisBarchart);
        }
    });
    var gaRightGuestAnalysisView = Backbone.View.extend({
        el: "#ga-guest-tab",
        token: [],
        initialize: function() {
            //时间控件初始化
            this.initTime();
            //模块初始化
            this.module = new gaRightGuestAnalysisMode();
            //事件订阅
            var guestLeftAddressClick = window.PubSub.subscribe("guestLeftAddressClick", this.module.getGuestAnalysisData);
            var gaLeftShopClick = window.PubSub.subscribe("gaLeftShopClick", this.module.getGuestAnalysisData);
            this.token.push(guestLeftAddressClick);
            this.token.push(gaLeftShopClick);
        },
        events: {
            "click #ga-time-one a": "gaTimeOneChange",
            "click #ga-guest-export":"gaGuestExport"
        },
        initTime: function() {
            var _this = this;
            $("#ga-report-type-day1 input").click(function() {
                WdatePicker({
                    maxDate: '%y-%M-%d',
                    isShowClear: false,
                    enableInputMask: false,
                    firstDayOfWeek: 1,
                    onpicked: _this.module.getGuestAnalysisData
                });
            });
            $("#ga-report-type-custom-start-day1 input").click(function() {
                WdatePicker({
                    maxDate: '%y-%M-%d',
                    isShowClear: false,
                    enableInputMask: false,
                    firstDayOfWeek: 1,
                    onpicked: _this.module.getGuestAnalysisData
                });
            });
            $("#ga-report-type-custom-end-day1 input").click(function() {
                WdatePicker({
                    maxDate: '%y-%M-%d',
                    isShowClear: false,
                    enableInputMask: false,
                    firstDayOfWeek: 1,
                    onpicked: _this.module.getGuestAnalysisData
                });
            });
            $("#ga-report-type-week1 input:text").click(function() {
                var $input = $(this);
                WdatePicker({
                    el: 'ga-report-type-week1-hidden',
                    firstDayOfWeek: 1,
                    isShowWeek: true,
                    maxDate: '%y-%M-%d',
                    isShowClear: false,
                    enableInputMask: false,
                    onpicked: function() {
                        gaCommon.weekChangeEvent($input, $('#ga-report-type-week1-hidden'));
                        _this.module.getGuestAnalysisData();
                    }
                });
            });
            $("#ga-report-type-month1 input").click(function() {
                WdatePicker({
                    firstDayOfWeek: 1,
                    isShowClear: false,
                    enableInputMask: false,
                    maxDate: '%y-%M-%d',
                    dateFmt: 'yyyy-MM',
                    onpicked: _this.module.getGuestAnalysisData
                });
            });
            $("#ga-report-type-year1 input").click(function() {
                WdatePicker({
                    firstDayOfWeek: 1,
                    maxDate: '%y-%M-%d',
                    isShowClear: false,
                    enableInputMask: false,
                    dateFmt: 'yyyy',
                    onpicked: _this.module.getGuestAnalysisData
                });
            });
            //时间控件赋值
            var day = window.App.util.dateToString($.now());
            var month = day.slice(0, 7);
            var year = day.slice(0, 4);
            //日赋值
            $("#ga-report-type-day1 input").val(day);
            $("#ga-report-type-custom-start-day1 input").val(day);
            $("#ga-report-type-custom-end-day1 input").val(day);
            //月赋值
            $("#ga-report-type-month1 input").val(month);
            //周赋值
            var weekDate = new Date();
            var weekTime = weekDate.getTime();
            var weekDay = weekDate.getDay() || 7;
            var beginWeekTime = window.App.util.dateToString(weekTime - 24 * 60 * 60 * 1000 * (weekDay - 1));
            var endWeekTime = window.App.util.dateToString(weekTime + 24 * 60 * 60 * 1000 * (7 - weekDay));
            $("#ga-report-type-week1 input:text").val(beginWeekTime + '至' + endWeekTime);
            $('#ga-report-type-week1-hidden').val(beginWeekTime);
            //年赋值
            $("#ga-report-type-year1 input").val(year);
        },
        gaTimeOneChange: function(e) {
            var eventEl = $(e.currentTarget);
            eventEl.addClass('active').siblings().removeClass('active');
            gaCommon.timeChange(eventEl.data("value"), 1, "ga");
            this.module.getGuestAnalysisData();
        },
        gaGuestExport:function(){
        	if(paramObj['statisticType']=='custom'){
        		var dateParamObj = gaCommon.getDateParamObj(paramObj['statisticType'],'ga',1);
        		var isPass = checkDate(dateParamObj['startDate'],dateParamObj['endDate']);
        		if(!isPass){
        			return isPass;
        		}
        	}
        	var params = {};
        	var placeNames=[];
    		for(var key in paramObj){
    			if(paramObj[key]){
    				params[key]=paramObj[key];
    			}
    		}
    		if(!storeName){
    			storeName = "所有门店";
    		}
    		placeNames.push(storeName);
    		params['placeNames'] = placeNames;
            var actionPart ="/rmpGuestStatistic/exportGuestStatisticReport.action?"+$.param(params,true);
        	var myForm = document.createElement("form");
            myForm.method = "post";
            myForm.action = basePath + actionPart;
            document.body.appendChild(myForm);
            myForm.submit();
            document.body.removeChild(myForm);
        
        },
        resize: function(){
        	if(gaGuestAnalysisBarchart){
        		gaGuestAnalysisBarchart.resize();
        	}
        },
        remove: function() {
            if (gaGuestAnalysisPiechart) {
                gaGuestAnalysisPiechart.clear();
                gaGuestAnalysisPiechart.dispose();
                gaGuestAnalysisPiechart = null;
            }
            if (gaGuestAnalysisBarchart) {
                gaGuestAnalysisBarchart.clear();
                gaGuestAnalysisBarchart.dispose();
                gaGuestAnalysisBarchart = null;
            }
            this.$el.remove();
            this.stopListening();
            return this;
        }
    });
    
    /**
     * 验证时间
     */
    function checkDate(startDate,endDate){
    	var interval = endDate.getTime() - startDate.getTime();
		if(interval<0){
			$.say('开始时间不能大于结束时间');
			return false;
		}
		if(interval>30*24*60*60*1000){
			$.say('最多支持30天');
			return false;
		}
		return true;
    }
    module.exports = gaRightGuestAnalysisView;
});
