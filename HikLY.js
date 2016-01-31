
(function( jQuery, undefined ){
	// By default, Underscore uses ERB-style template delimiters, change the
    // following template settings to use alternative delimiters.
    $.templateSettings = {
      evaluate    : /<%([\s\S]+?)%>/g,
      interpolate : /<%=([\s\S]+?)%>/g,
      escape      : /<%-([\s\S]+?)%>/g
    };
    /**
     * use in jsp xiangxiao 2014/8/16
     * @type {Object}
     */
    $.templateSettings = {  
      evaluate    : /<&([\s\S]+?)&>/g,  
      interpolate : /<&=([\s\S]+?)&>/g,  
      escape      : /<&-([\s\S]+?)&>/g  
    };  

    // When customizing `templateSettings`, if you don't want to define an
    // interpolation, evaluation or escaping regex, we need one that is
    // guaranteed not to match.
    var noMatch = /(.)^/;

    // Certain characters need to be escaped so that they can be put into a
    // string literal.
    var escapes = {
      "'":      "'",
      '\\':     '\\',
      '\r':     'r',
      '\n':     'n',
      '\t':     't',
      '\u2028': 'u2028',
      '\u2029': 'u2029'
    };

    var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

    // JavaScript micro-templating, similar to John Resig's implementation.
    // Underscore templating handles arbitrary delimiters, preserves whitespace,
    // and correctly escapes quotes within interpolated code.
    $.template = function(text, data, settings) {
      var render;
      settings = $.extend({}, settings, $.templateSettings);

      // Combine delimiters into one regular expression via alternation.
      var matcher = new RegExp([
        (settings.escape || noMatch).source,
        (settings.interpolate || noMatch).source,
        (settings.evaluate || noMatch).source
      ].join('|') + '|$', 'g');

      // Compile the template source, escaping string literals appropriately.
      var index = 0;
      var source = "__p+='";

      text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
        source += text.slice(index, offset)
          .replace(escaper, function(match) { return '\\' + escapes[match]; });

        if (escape) {
          source += "'+\n((__t=(" + escape + "))==null?'':$.escape(__t))+\n'";
        }
        if (interpolate) {
          source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
        }
        if (evaluate) {
          source += "';\n" + evaluate + "\n__p+='";
        }
        index = offset + match.length;
        return match;
      });
      source += "';\n";

      // If a variable is not specified, place data values in local scope.
      if (!settings.variable){
        source = 'with(obj||{}){\n' + source + '}\n';
      } 

      source = "var __t,__p='',__j=Array.prototype.join," +
        "print=function(){__p+=__j.call(arguments,'');};\n" +
        source + "return __p;\n";

      try {
        render = new Function(settings.variable || 'obj', '$', source);
      } catch (e) {
        e.source = source;
        throw e;
      }

      if (data){
        return render(data, $);
      } 
      var template = function(data) {
        return render.call(this, data, $);
      };

      // Provide the compiled function source as a convenience for precompilation.
      template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

      return template;
    };
})(jQuery);
/**
 * tip
 * @author xiangxiao
 * @date   2014-11-07
 */
(function($){
	'use strict';

	var HTip = function (element, options) {
		this.options = options;
	};

    function Plugin(option) {
		return this.each(function() {
			if($(this).nextAll('span.tip').length > 0){				
				var _placement = 'top';
				var tipEl = $(this).nextAll('span.tip');
				if(tipEl.hasClass('hTip-right')){
					_placement = 'right';
				}else if(tipEl.hasClass('hTip-bottom')){
					_placement = 'bottom';
				}else if(tipEl.hasClass('hTip-left')){
					_placement = 'left';
				}
				
				$(this).tooltip({
					html:true,
					placement:_placement,
					title:tipEl,
					trigger:(option && option.trigger) ? option.trigger : 'hover'	
				});
			}
		});
	}

	var old = $.fn.hTip;

	$.fn.hTip             = Plugin;
	$.fn.hTip.Constructor = HTip;


	// CAROUSEL NO CONFLICT
	// ====================

	$.fn.hTip.noConflict = function () {
		$.fn.hTip = old;
			return this;
	};

	$(window).on('load', function () {
		$('[data-spy="hTip"]').each(function () {
			var $spy = $(this);
			var data = $spy.data();

			Plugin.call($spy, data);
		});
	});

})(jQuery);
/**
 * Mask 遮罩
 * @author xiangxiao
 * @date   2014-08-19
 * require jquery 
 */

(function($){
	'use strict';

	$.fn.mask = function(num){
		var that = this;
		var zIndex = num ? num : this.css('z-index') - 1;

		$(".hik-overlay").each(function(){
			if($(this).is(":visible")){
				zIndex ++;
				$(that).css({
					zIndex	:  (zIndex + 1)
				});
			}
		});

		this.maskui = $('<div class="hik-overlay"></div>')
			.appendTo(document.body)
			.css({
				zIndex	: zIndex,
				width  : "100%",
	            height : "100%",
				display: "block"
			});
	};
	
	$.fn.unmask = function(num){
		if(this.maskui){
			this.maskui.hide();
			this.maskui.remove();
		}	
	};

	$.mask = function(opt){
		var overlayLoad, settings={
	            zIndex  : 3000,
	            width  : "100%",
	            height : "100%",
	            display: "block",
	            loading:false,
	            msg : "正在加载，请稍候！",
	            transparent:false
	        };
	    settings = $.extend({}, settings, opt);
	    //是否重绘
    	if($(".hik-body-overlay").length === 0){

    		var overlay = $('<div class="hik-body-overlay"></div>');
	    	overlay.appendTo(document.body);

    		if(settings.loading && !settings.transparent){
    			overlayLoad = $('<div style="z-index:'+(settings.zIndex+1)+';" class="loading-mask-img">'+settings.msg+'</div>');
	    		overlayLoad.appendTo(document.body);
	    	}

    	}else{
    		if(settings.loading && $(".loading-mask-img").length === 0){
    			overlayLoad = $('<div style="z-index:'+(settings.zIndex+1)+';" class="loading-mask-img">'+settings.msg+'</div>');
	    		overlayLoad.appendTo(document.body);
    		}else if(!!settings.loading){
    			$('.loading-mask-img').show();
    		}else{
    			$('.loading-mask-img').hide();
    		}

    		$(".hik-body-overlay").show();
    	}
    	
    	//样式
	    $(".hik-body-overlay").css({
	        	zIndex  : 	settings.zIndex,
        		width   : 	settings.width,
        		height  : 	settings.width,
        		display : 	settings.display
        });

	    //透明
		if(settings.transparent){
			$(".hik-body-overlay").css({opacity:'0'});
			$(".hik-body-overlay").css({filter:'alpha(opacity=0)'});
		}else{
			$(".hik-body-overlay").css({
			  	opacity: 0.3,
  				filter:'alpha(opacity=30)'
  			});
		}
	};

	$.unmask = function(num){
	    $(".hik-body-overlay").hide();
	    $(".loading-mask-img").hide();
	};

})(jQuery);
/**
 * popUp 弹出框
 * @author xiangxiao
 * @date   2014-08-19
 * require jquery 
 */

(function($){
	'use strict';

	var PopUp = function (element, options) {
		this.options = options;
		this.$el = $(element);
	};

	PopUp.DEFAULTS = {
		html: null,
		x	: null,
		y	: null,
		model	: false,
		width	: 100,
		height	: 100,
		zindex	: 1002,
		isCenter : true,
		open	: function(){},
		close : function(){},
		tagName : 'popUp',
		isBlur : false//是否点击外面失去焦点
	};
    
    PopUp.tagName = 'popUp';

    PopUp.prototype = {
    	open : function(opt){
			var frame,that = this,
				options = opt ? opt : that.options;

			if(options.html){
				that.$el = $(options.html);
			}

			if(that.$el.is(":visible")) {
				return ;
			}

			frame = that.$el.addClass('hik-popUp')
				.appendTo(document.body)
				.attr("tabindex","0")
				.css({
					width : options.width,
					height : options.height,
					zIndex : options.zindex,
					outline: "none",
					display: "block"
				});
			if(that.options.x !== null && that.options.y !== null){
				frame.css({
					left	: that.options.x,
					top		: that.options.y,
					position: "absolute"
				});
			}else{
				frame.css({
					left	: document.body.scrollLeft + (document.documentElement.clientWidth - options.width) / 2,
					top		: document.body.scrollTop + (document.documentElement.clientHeight - options.height) / 2
				});
			}

			if(options.model){
				that.$el.mask();
			}

			frame.focus();
			if(options.isBlur){
				$(document).mousedown(function(event){
					if(frame.find($(event.target)).length < 1 && frame.is(':visible')){//如果点击元素在弹框层内，默认不关闭
						that.close();
					}
				});
			}

			that.options.open();
		},

		close : function(){
			var that = this,
				options = that.options;

			if(that.$el.is(":visible")) {
				that.$el.hide();
				if(options.model){
					that.$el.unmask();
				}
				if(options.close){
					options.close();
				}
			}
		}
    };

    function Plugin(option, _relatedTarget) {
		return this.each(function() {
			var $this   = $(this);
			var data    = $this.data('bs.popUp');
			var options = $.extend({}, PopUp.DEFAULTS, $this.data(), typeof option === 'object' && option);

			if (!data){
				$this.data('bs.popUp', (data = new PopUp(this, options)));
			} else if(data && typeof option === 'object'){
				data.options = options;
			}

			if (typeof option === 'string'){
				data[option](_relatedTarget);
			} 
		});
	}

	var old = $.fn.popUp;

	$.fn.popUp             = Plugin;
	$.fn.popUp.Constructor = PopUp;


	// CAROUSEL NO CONFLICT
	// ====================

	$.fn.popUp.noConflict = function () {
		$.fn.popUp = old;
			return this;
	};

})(jQuery);

/**
 * popUp 提醒框
 * @author xiangxiao
 * @date   2014-08-19
 * require jquery 
 */
(function($){
	'use strict';

	var Alert = function (options) {
		this.options = options;
		this.render(options);
	};

	Alert.DEFAULTS = {
		html: null,
        title : '', 
        x: null,
        y: null,
        model: true,
        width: 300,
        height: 160,
        zindex: 1002,
        isCenter: true,
        open: function() {},
        close: function() {},
        closeEvent: function() {}, 
        okEvent: function() {},
        info: "",
        category: 'alert',
        closeBtn: _pop_close,
        sureBtn: _pop_sure,
        isShowClose: true,
        isBlur: false, //是否点击外面失去焦点
        isSay : false
	};
    
    Alert.tagName = 'alert';

    Alert.dialogClassName = 'Hik_Alert';

    Alert.SayTemplate = '<div class="ui-hikly-dialog" name="hik_libs_alertDialog">'+
    	'<div class="ui-hikly-dialog-titlebar ui-hikly-widget-header ui-hikly-corner-all ui-hikly-helper-clearfix">'+
			'<span class="ui-hikly-dialog-title"><&= title &></span>'+
			'<& if(isShowClose){ &>'+
			'<a href="javascript:void(0)" class="ui-hikly-dialog-titlebar-close ui-hikly-corner-all" role="button">'+
				'<span class="ui-hikly-icon ui-hikly-icon-closethick">close</span>'+
			'</a>'+
			'<& } &>'+
		'</div>'+
		'<div class="ui-hikly-dialog-content alert-content">' +
        '<span class="say-icon say-icon-<&= category &>"></span>'+
        '<span class="alert-say-tip-css content" style="width:<&= width-120 &>px;padding-top:<&= (height-90)/2 &>px;"><&= info &></span>' +
        '</div>'+
		'<div class="alert-buttons-css">'+
		'<& if(closeBtn){ &>'+
		'<button class="btn hikly-btn-minor" name="close-btn" data-dismiss="modal" aria-hidden="true" style="float:right;margin:10px;"><&= closeBtn &></button>'+
		'<& } &>'+
		'<& if(sureBtn){ &>'+
		'<button class="btn hikly-btn-primary <&= singleClass &>" name="sure-btn" style="float:right;margin-top:10px;"><&= sureBtn &></button>'+
		'<& } &>'+
		'</div>'+
		'</div>	';

    Alert.dialogTemplate = '<div class="ui-hikly-dialog" name="hik_libs_alertDialog">'+
    	'<div class="ui-hikly-dialog-titlebar ui-hikly-widget-header ui-hikly-corner-all ui-hikly-helper-clearfix">'+
			'<span class="ui-hikly-dialog-title"><&= title &></span>'+
			'<& if(isShowClose){ &>'+
			'<a href="javascript:void(0)" class="ui-hikly-dialog-titlebar-close ui-hikly-corner-all" role="button">'+
				'<span class="ui-hikly-icon ui-hikly-icon-closethick">close</span>'+
			'</a>'+
			'<& } &>'+
		'</div>'+
		'<div class="ui-hikly-dialog-content"><div class="alert-content">'+
		'<p><&= info &></p>'+
		'</div></div>'+
		'<div class="alert-buttons-css">'+
		'<& if(closeBtn){ &>'+
		'<button class="btn hikly-btn-minor" name="close-btn" data-dismiss="modal" aria-hidden="true" style="float:right;margin:10px;"><&= closeBtn &></button>'+
		'<& } &>'+
		'<& if(sureBtn){ &>'+
		'<button class="btn hikly-btn-primary <&= singleClass &>" name="sure-btn" style="float:right;margin-top:10px;"><&= sureBtn &></button>'+
		'<& } &>'+
		'</div>'+
		'</div>	';

	Alert.prototype = {
		render : function(options){
			var that = this,
				dialog,
				dialogAlert;

		  	// if($('div[name=hik_libs_alertDialog'+config.id+']',$('body')).length>0)return;
		  	
		  	options = $.extend({}, Alert.DEFAULTS, options);
			options.singleClass = options.singleBtn ? 'hide':'';

		  	if($("." + Alert.dialogClassName).length){
		  		$("." + Alert.dialogClassName).empty();
		  		that._render($("."+Alert.dialogClassName), options);
				return ;
		  	}

			dialogAlert = $("<div class='Hik_Alert'></div>");

			dialogAlert.appendTo($('body'));
			
			that._render(dialogAlert, options);
		},
		_render : function(dialogAlert, options){
			var dialogSelect = options.isSay ? Alert.SayTemplate: Alert.dialogTemplate;
            dialogAlert.append($($.template(dialogSelect, options)))
				.find('button[name=close-btn]').on('click',function(){
					if(options.closeEvent !== null){

				  		options.closeEvent.call(dialogAlert);
				  	}
					dialogAlert.popUp("close");
				});
				//解发外部cancel事件
			dialogAlert.find('button[name=sure-btn]').on('click',function(){
					if(options.okEvent !== null){

				  		options.okEvent.call(dialogAlert);
				  	}
					dialogAlert.sureEvent = true;
					dialogAlert.popUp("close");
				});

			dialogAlert.find(".ui-hikly-dialog-titlebar-close").on({
				mouseenter: function( event ) {
					$( event.currentTarget ).addClass( "ui-hikly-state-hover" );
				},
				mouseleave: function( event ) {
					$( event.currentTarget ).removeClass( "ui-hikly-state-hover" );
					$( event.currentTarget ).removeClass( "ui-hikly-state-click" );
				},
				mousedown: function( event ) {
					$( event.currentTarget ).addClass( "ui-hikly-state-click" );
				},
				mouseup: function( event ) {
					$( event.currentTarget ).removeClass( "ui-hikly-state-click" );
				},
				click: function(event){
					dialogAlert.popUp("close");
				}
			});
			dialogAlert.find(".alert-content").height(options.height - 96);
			$("." + Alert.dialogClassName).hide()
				.popUp(options)
				.popUp("open", options);
		}
	};

    function Plugin(option, _relatedTarget) {
			var options = $.extend({}, Alert.DEFAULTS,typeof option === 'object' && option);
			new Alert(options);
	}

	var old = $.alert;

	$.alert = Plugin;


	// CAROUSEL NO CONFLICT
	// ====================

	$.alert.noConflict = function () {
		$.alert = old;
		return this;
	};

})(jQuery);


/**
 * popUp 警告框，定时自动消失
 * @author xiangxiao
 * @date   2014-10-22
 * require jquery 
 */
(function($){
	'use strict';

	var sayTimer = null;

	var Say = function (info, category) {
		this.render(info, category);
	};

	Say.DEFAULTS = {
		model	: false,
		width	: 320,
		height	: 150,
		zindex	: 3000
	};
    
    Say.tagName = 'say';

    Say.dialogClassName = 'Hik_Say';

    Say.dialogTemplate = '<div class="say-container-css"><span class="say-icon say-icon-<&= category &>">'+
    '</span><div class="say-tip-css"><div class="content"><&= info &></div></div></div>';

	Say.prototype = {
		render : function(info, category){
			var that = this,
				dialog,
				dialogSay;
		  	
		  	var options = $.extend({}, Say.DEFAULTS,{
		  		info : info,
		  		category : category ? category : "error"
		  	});

			//如果存在就将原来的替换 xx
		  	if($("." + Say.dialogClassName).length){
		  		$("." + Say.dialogClassName).empty();
		  		that._render($("."+Say.dialogClassName), options);
				return ;
		  	}

		  	//不存在就新建一个 xx
			dialogSay = $("<div class='" + Say.dialogClassName + "'></div>");

			dialogSay.appendTo($('body'));
			
			that._render(dialogSay, options);
		},
		_render : function(dialogSay, options){
			var hideTime = options.category === "success" ? 1000 : 2000;

			dialogSay.append($($.template(Say.dialogTemplate,options)));

			dialogSay.hide()
				.popUp(options)
				.popUp("open");

			dialogSay.on("click", function() {
				//by wangqin 避免IE8 faseout失效的问题
				// dialogSay.fadeOut("fast", function() {
				// 	dialogSay.popUp("close");
				// });
				dialogSay.popUp("close");
			});

			if (sayTimer) {
				// 清除之前的定时器
				clearTimeout(sayTimer);
			}

			sayTimer = window.setTimeout(function() {
				//by wangqin 避免IE8 faseout失效的问题
				// dialogSay.fadeOut("fast", function() {
				// 	dialogSay.popUp("close");
				// 	clearTimeout(sayTimer);
				// });
				dialogSay.popUp("close");
			}, hideTime);
		}
	};

    function Plugin(info, category) {
		new Say(info, category);
	}

	var old = $.say;

	$.say = Plugin;

	// CAROUSEL NO CONFLICT
	// ====================

	$.alert.noConflict = function () {
		$.say = old;
		return this;
	};

})(jQuery);
/**
 * 弹出dialog
 * @author xiangxiao
 * @date   2014-08-19
 * require jquery PopUp
 */

(function($) {
    'use strict';

    var Dialog = function(element, options) {
        this.options = options;
        this.$el = $(element);
    };

    Dialog.VERSION = '1.0.0';

    Dialog.tagName = 'dialog';

    Dialog.DEFAULTS = {
        html: null,
        title: "",
        x: null,
        y: null,
        model: true,
        move: true,
        width: 100,
        height: 100,
        zindex: 1002,
        isCenter: true,
        afterHide: function() {},
        open: function() {},
        close: function() {},
        btnPosition: '', //按钮位置
        template: '', //自定义模板
        buttons: [],
        buttonFlag: true //ny wangqin 显示buttons的标志
    };

    Dialog.dialogTemplate = '<div class="ui-hikly-dialog "></div>';

    Dialog.titleTemplate =
        '<div class="ui-hikly-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix">' +
        '<span class="ui-hikly-dialog-title"><&= title &></span>' +
        '</div>';

    Dialog.hoverTemplate =
        '<a href="javascript:void(0)" class="ui-hikly-dialog-titlebar-close ui-corner-all" role="button">' +
        '<span class="ui-hikly-icon ui-hikly-icon-closethick">close</span>' +
        '</a>';

    Dialog.dialogToolBarTemplate =
        '<div class="ui-hikly-dialog-buttonpane ui-widget-content ui-helper-clearfix"><div class="ui-hikly-dialog-buttonset">' +
        '</div></div>';

    Dialog.toolbarButtonTemplate = '<button type="button" id="<&= id &>" class="btn <&= icon &>"><&= text &></button>';

    Dialog.prototype = {
        render: function(obj) {
            var that = this,
                options = $.extend(that.options, obj);


            if (!that.dialog) {
                that.dialog = $(Dialog.dialogTemplate);
                $("body").append(that.dialog);

                that.hover = $(Dialog.hoverTemplate);
                that.title = $($.template(Dialog.titleTemplate, {
                    title: options.title
                })).append(that.hover);

                if (options.html) {
                    that.content = $(options.html);
                    options.html = null;
                } else {
                    that.content = that.$el;
                }
                //存在问题
                that.dialog.append(that.title);
                that.dialog.append(that.content);
                //增加了template参数
                if (that.options.template) {
                    that.dialog.append(that.options.template);
                } else {
                    that.renderToolbar();
                    if (that.toolbar) {
                        that.dialog.append(that.toolbar);
                        //增加了按钮位置的选项
                        if (options.btnPosition) {
                            that.toolbar.find('.ui-hikly-dialog-buttonset').css('textAlign', options.btnPosition);
                        }
                    }
                }
            } else {
                that.title.find(".ui-hikly-dialog-title").html(options.title);
            }

            that.content.css({
                width: options.width - 2,
                height: options.height - (options.buttonFlag ? 84 : 34) //by wangqin 判断buttons，调整高度
            }).addClass("ui-hikly-dialog-content");


            that.addEvent();
            that.dialog.hide();

            var dragging = false;
            var iX, iY, ileft, itop;
            that.title.mousedown(function(e) {
                dragging = true;
                iX = e.clientX - this.offsetLeft;
                iY = e.clientY - this.offsetTop;
                ileft = that.dialog.offset().left;
                itop = that.dialog.offset().top;

                return false;
            });
            $(document).mousemove(function(e) {
                if (dragging) {
                    e = e || window.event;
                    var oX = (e.clientX - iX + ileft) > 0 ? (e.clientX - iX + ileft) : 0;
                    var oY = e.clientY - iY + itop > 0 ? (e.clientY - iY + itop) : 0;
                    that.dialog.css({
                        "left": oX + "px",
                        "top": oY + "px"
                    });
                    return false;
                }
            });
            $(document).mouseup(function(e) {
                dragging = false;
                e.cancelBubble = true;
            });
        },

        renderToolbar: function() {
            var that = this,
                options = that.options;

            if (options.buttons.length === 0) {
                return;
            }
            that.toolbar = $(Dialog.dialogToolBarTemplate);
            $.each(options.buttons, function(n, value) {
                //by wangqin 新增dialog的按钮id，为空时则用class
                var btn_with_name = that.content.attr("name") ? that.content.attr("name").split(" ") : [];
                var btn_with_class = that.content.attr("class") ? that.content.attr("class").split(" ") : [];
                var btn_with_id = that.content.attr("id") ? that.content.attr("id") : btn_with_class.join("_");
                btn_with_id = btn_with_id ? btn_with_id : btn_with_name.join("_");
                btn_with_id = btn_with_id + "_btn" + (n + 1);
                value = $.extend({}, {
                    text: "",
                    id: btn_with_id,
                    icon: ""
                }, value);
                var button = $($.template(Dialog.toolbarButtonTemplate, value));
                button.on('click', function(event) {
                    value.click.apply(that.$el, [event]);
                });
                that.toolbar.children().first().append(button);
            });

        },

        addEvent: function() {
            var that = this;

            that.hover.on({
                mouseenter: function(event) {
                    $(event.currentTarget).addClass("ui-hikly-state-hover");
                },
                mouseleave: function(event) {
                    $(event.currentTarget).removeClass("ui-hikly-state-hover");
                },
                mousedown: function(event) {
                    $(event.currentTarget).addClass("ui-hikly-state-click");
                },
                mouseup: function(event) {
                    $(event.currentTarget).removeClass("ui-hikly-state-click");
                },
                click: function(evnet) {
                    that.close();
                }
            });
        },
        //需要改进，和pop方法合并在一起
        open: function() {
            var frame, that = this,
                options = that.options;

            if (options.html) {
                that.dialog = $(options.html);
            }

            if (that.dialog.is(":visible")) {
                return;
            }

            frame = that.dialog.addClass('hik-popUp')
                /*by wangqin start 2015-3-19 防止重新添加到body，防止移位*/
                // .appendTo(document.body)
                /*by wangqin end*/
                .attr("tabindex", "0")
                .css({
                    width: options.width,
                    height: options.height,
                    zIndex: options.zindex,
                    outline: "none",
                    display: "block"
                });
            var left, top;
            if (that.options.x !== null && that.options.y !== null) {
                left = that.options.x;
                top = that.options.y;
            } else {
                left = document.body.scrollLeft + (document.documentElement.clientWidth - options.width) / 2;
                top = document.body.scrollTop + (document.documentElement.clientHeight - options.height) / 2;
            }
            frame.css({
                position: "absolute",
                left: left > 0 ? left : 0,
                top: top > 0 ? top : 0
            });

            if (options.model) {
                that.dialog.mask();
            }

            frame.focus();
            if (options.isBlur) {
                $(document).mousedown(function(event) {
                    if (frame.find($(event.target)).length < 1 && frame.is(':visible')) { //如果点击元素在弹框层内，默认不关闭
                        that.close();
                    }
                });
            }

            that.options.open();
        },
        close: function() {
            var that = this,
                options = that.options;

            if (that.dialog.is(":visible")) {
                that.dialog.hide();
                if (options.model) {
                    that.dialog.unmask();
                }
                //时间控件是否有 by wangqin
                if ($('.hikly-datepicker').length > 0) {
                    $('.hikly-datepicker').popUp("close");
                }
                options.close();
            }
        },
        option: function(con) {
            var that = this;
            that.render(con);
            if (con.openOption) {
                that.dialog.unmask();
                that.open();
            }
        }
    };

    function Plugin(option, _relatedTarget, _relatedTarget1) {
        return this.each(function() {
            var $this = $(this),
                data = $this.data('bs.dialog'),
                options = $.extend({}, Dialog.DEFAULTS, $this.data(), typeof option === 'object' && option);

            if (!$.data(this, "bs.dialog")) {
                $.data(this, "bs.dialog", (data = new Dialog(this, options)));

                data.render();
            }
            if (typeof option === 'string') {
                data[option](_relatedTarget, _relatedTarget1);
            }
        });
    }

    var old = $.fn.dialog;

    $.fn.dialog = Plugin;
    $.fn.dialog.Constructor = Dialog;


    // CAROUSEL NO CONFLICT
    // ====================

    $.fn.dialog.noConflict = function() {
        $.fn.dialog = old;
        return this;
    };

})(jQuery);

/**
 * [Datepicker description]
 * @type {[type]}
 * 样式资源目录 Z:\系统业务管理中心\共享软件开发及管理部\外部文件\用户体验组\个人共享\刘仕龙\可复用控件\资源\日历
 */

(function($) {
    'use strict';

    var Datepicker = function(element, options) {
        this.options = options;
        this.$el = $(element);
        this.render();
    };

    Datepicker.VERSION = '1.0.0';

    Datepicker.DEFAULTS = {
        value: null,
        dateFM: "yyyy-MM-dd",
        cls: "",
        markDates: [],
        pickMore: false,
        isSunFirst: true, //是否是星期天是第一位
        onChange: function() {},
        onTodayClick: function() {},
        _buttonState: "",
        _value: null,
        _aliveDate: ""
    };

    Datepicker._titleTemplate =
        '<div class="yypicker"></div>' +
        '<div class="MMpicker"></div>' +
        '<div class="hikly-datepick-mouth-left"><a></a></div>' +
        '<div class="tym"><input type="text" class="tyear" value="<&= year &>" maxlength="4"></input><div> 年</div>' +
        '<input type="text" class="tmonth" value="<&= month &>" maxlength="2"></input><div> 月</div></div>' +
        '<div class="hikly-datepick-mouth-right"><a></a></div>';

    Datepicker._yearTemplate =
        '<table><tr>' +
        '<td rowspan="2"><div class="hikly-datepick-year-left"><a></a></div></td>' +
        '<& for(var i=0,tl = trs.length,xx;i < tl;i++){ &>' +
        '<& xx = trs[i]; &>' +
        '<td class="pick-year hikly-datepick-top-pick <&= xx.cls &>"><&= xx.name &></td></td>' +
        '<& if(i == 4){ &>' +
        '<td rowspan="2"><div class="hikly-datepick-year-right"><a></a></div></td>' +
        '</tr>' +
        '<& } &>' +
        '<& } &></tr></table>';

    Datepicker._monthTemplate =
        '<table><tr>' +
        '<& for(var i=0,tl = trs.length,xx;i < tl;i++){ &>' +
        '<& xx = trs[i]; &>' +
        '<td class="pick-month hikly-datepick-top-pick <&= xx.cls &>"><&= xx.name &></td></td>' +
        '<& if(i == 5){ &>' +
        '</tr>' +
        '<& } &>' +
        '<& } &></tr></table>';

    Datepicker._dpCenterTemplate =
        '<table>' +
        '<& for(var i=0,tl = trs.length,xx;i < tl;i++){ &>' +
        '<& if(i%7 == 0){ &>' +
        '<tr>' +
        '<& } &>' +
        '<& xx = trs[i]; &>' +
        '<td class="<&= xx.cls &>"><&= xx.name &></td>' +
        '<& if((i+1)%7 == 0){ &>' +
        '</tr>' +
        '<& } &>' +
        '<& } &></table>';

    Datepicker.tagName = 'datepicker';

    Datepicker._width = 245;

    Datepicker._height = 318;

    Datepicker.prototype = {
        render: function() {
            var that = this,
                _dpTitle, _dpCenter,
                options = that.options;

            that.$el.data("value", that.getValue());
            options._value = [that._getDate()];
            options._aliveDate = that._getDate();

            that.$el.empty();

            _dpTitle = $('<div class="hikly-datepicker-title"></div>');
            _dpCenter = $('<div class="hikly-datepicker-center"></div>');

            that.$el.append(_dpTitle);
            that.$el.append(_dpCenter);

            that._showTitle();
            that._showMonth();
            that._showDateBar();


            that.$el.css({
                width: Datepicker._width,
                height: Datepicker._height
            }).addClass("hikly-datepicker");
        },

        _getDate: function() {
            var that = this,
                options = that.options,
                reg = new RegExp(options.dateFM.substr(4, 1), "gi");

            if (options.pickMore && $.isArray(that.getValue())) {
                return new Date(this.getValue()[0].replace(reg, "/"));
            }

            return new Date(that.getValue().replace(reg, "/"));
        },

        setValue: function(str) {
            var that = this,
                options = that.options,
                reg = new RegExp(options.dateFM.substr(4, 1), "g");

            if (!str || str === "") {
                return;
            }

            if (!$.isArray(str) && options.pickMore) {
                options.value = [str];
            } else {
                options.value = str;
            }

            that.$el.data("value", options.value);
            options.onChange.apply(that.$el);
        },

        getValue: function() {
            var that = this,
                options = that.options;

            if (options.value instanceof Date) {
                options.value = options.value.format(options.dateFM);
            }
            if (options.pickMore) {
                if (!options.value) {
                    return [new Date().format(options.dateFM).split(" ")[0]];
                } else if ($.isArray(options.value)) {
                    $.map(options.value, function(value) {
                        return value.split(" ")[0];
                    });
                    return options.value;
                } else {
                    return [options.value.split(" ")[0]];
                }

            }
            if (!options.value) {
                return new Date().format(options.dateFM).split(" ")[0];
            }
            if (typeof options.value === "string") {
                return options.value.split(" ")[0];
            }

            return options.value[0].split(" ")[0];
        },

        //内部选择导致时间改变
        _changeValue: function() {
            var that = this,
                date,
                arr = [],
                options = that.options;
            options._value = [];

            if (options.pickMore && that.$el.find(".checked").length > 1) {
                that.$el.find(".checked").each(function() {
                    date = new Date(that.$el.find(".tyear").val(), that.$el.find(".tmonth").val() - 1, $(this).html());
                    arr.push(date.format(that.options.dateFM));
                    options._value.push(date);
                });
                that.setValue(arr);
            } else {
                date = new Date(that.$el.find(".tyear").val(), that.$el.find(".tmonth").val() - 1, that.$el.find(".checked").html());
                options._value.push(date);
                that.setValue(date.format(that.options.dateFM));
            }

        },

        _showTitle: function() {
            var that = this,
                yearPickArr = [],
                options = that.options,
                _dpTitle = that.$el.find(".hikly-datepicker-title");

            _dpTitle.empty();

            var str = $.template(Datepicker._titleTemplate, {
                year: options._aliveDate.getFullYear(),
                month: options._aliveDate.getMonth() + 1
            });

            _dpTitle.append($($.template(Datepicker._titleTemplate, {
                year: options._aliveDate.getFullYear(),
                month: options._aliveDate.getMonth() + 1
            })));

            //绑定表头月份左右按钮
            _dpTitle.find(".hikly-datepick-mouth-left").click(function() {
                options._aliveDate.setMonth(options._aliveDate.getMonth() - 1);
                that._showTitle();
                that._showMonth();
            });

            _dpTitle.find(".hikly-datepick-mouth-right").click(function() {
                options._aliveDate.setMonth(options._aliveDate.getMonth() + 1);
                that._showTitle();
                that._showMonth();
            });

            //月和年的输入框
            _dpTitle.find("input").keydown(function() {
                if (!((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)) && event.keyCode !== 8) {
                    event.returnValue = false;
                }
            });

            //添加年选择框及事件
            var tyear = _dpTitle.find(".tyear");
            tyear.blur(function(event) {
                that._showTitle();
                that._showMonth();
            });
            tyear.mousedown(function() {
                var year = options._aliveDate.getFullYear() - 2,
                    yearPickArr = [],
                    yypicker = _dpTitle.find(".yypicker");

                _dpTitle.removeClass("MM-time").addClass("yy-time");
                for (var i = 0; i < 10; i++) {
                    yearPickArr.push({
                        name: year,
                        cls: year === options._aliveDate.getFullYear() ? "pickedYear" : ""
                    });
                    year++;
                }
                yypicker.empty();
                yypicker.show();

                yypicker.append($($.template(Datepicker._yearTemplate, {
                    trs: yearPickArr
                })));

                yypicker.find(".hikly-datepick-year-left").mousedown(function(event) {
                    options._aliveDate.setFullYear(options._aliveDate.getFullYear() - 10);
                    tyear.mousedown();
                    return false; //阻止事件冒泡以免关闭弹出框
                });

                yypicker.find(".hikly-datepick-year-right").mousedown(function(event) {
                    options._aliveDate.setFullYear(options._aliveDate.getFullYear() + 10);
                    tyear.mousedown();
                    return false;
                });

                yypicker.find(".pick-year").mousedown(function(event) {
                    options._aliveDate.setYear(event.target.innerHTML);
                });
            });

            //添加月份选择框及事件
            var tmonth = _dpTitle.find(".tmonth");
            tmonth.blur(function(event) {
                that._showTitle();
                that._showMonth();
            });
            tmonth.click(function() {
                var month = options._aliveDate.getMonth(),
                    monthPickArr = [],
                    MMpicker = _dpTitle.find(".MMpicker");

                _dpTitle.removeClass("yy-time").addClass("MM-time");
                for (var i = 0; i < 12; i++) {
                    monthPickArr.push({
                        name: i + 1,
                        cls: i === month ? "pickedMonth" : ""
                    });
                }
                MMpicker.empty();
                MMpicker.show();

                MMpicker.append($($.template(Datepicker._monthTemplate, {
                    trs: monthPickArr
                })));

                MMpicker.find(".pick-month").mousedown(function(event) {
                    options._aliveDate.setMonth((event.target.innerHTML - 1) > 11 ? 11 : (event.target.innerHTML - 1));
                });
            });
        },

        _showMonth: function() {
            var that = this,
                targetEl,
                options = that.options,
                _dpCenter = that.$el.find(".hikly-datepicker-center");

            _dpCenter.empty();
            _dpCenter.append($($.template(Datepicker._dpCenterTemplate, {
                trs: that._getMonthDates(options._aliveDate)
            })));

            _dpCenter.find(".hikly-datepicker-able").mousedown(function(event) {
                _dpCenter.find(".pickarea").removeClass("checked");
                $(event.target).addClass("checked");
                if (!options.pickMore) {
                    that._changeValue();
                }
                targetEl = $(event.target);
            });

            if (options.pickMore) {
                _dpCenter.find(".hikly-datepicker-able").mousemove(function(event) {
                    var start, end;
                    if (targetEl) {
                        _dpCenter.find(".pickarea").removeClass("checked");
                        if (Number($(event.target).html()) > Number(targetEl.html())) {
                            end = Number($(event.target).html());
                            start = Number(targetEl.html());
                        } else {
                            end = Number(targetEl.html());
                            start = Number($(event.target).html());
                        }
                        for (var i = end; i >= start; i--) {
                            _dpCenter.find(".days" + i).addClass("checked");
                        }
                    }
                });

                _dpCenter.find(".hikly-datepicker-able").mouseup(function(event) {
                    targetEl = null;

                    that._changeValue();
                });
            }
        },
        /**
         * 获取要显示月份的所有数据
         * @author xiangxiao
         * @date    2014-08-26
         */
        _getMonthDates: function(date) {
            var that = this,
                firstDay,
                options = that.options,
                arr = [],
                year = date.getFullYear(),
                month = date.getMonth(),
                weekArr = options.isSunFirst ? _datepicker_weeker_sunday_first : _datepicker_weeker_monday_first;

            firstDay = new Date(year, month, 1);

            for (var i = 0; i < 7; i++) {
                arr.push({
                    name: weekArr[i],
                    cls: "hikly-datepicker-header"
                });
            }

            i = 0;

            while (i < 7) {
                if ((options.isSunFirst && firstDay.getDay() === 0) || (!options.isSunFirst && firstDay.getDay() === 1)) {
                    break;
                }

                firstDay.setDate(firstDay.getDate() - 1);
                i++;
            }

            var setCheck = function(checkDate) {
                $.each(options._value, function(n, date) {
                    if (firstDay.format(options.dateFM) === date.format(options.dateFM)) {
                        cls += "checked";
                    }
                });
            };
            var markDateCheck = function(checkDate) {
                $.each(options.markDates, function(n, date) {
                    if (checkDate.format(options.dateFM).split(" ")[0] === date.date) {
                        cls += " " + date.cls;
                    }
                });
            };
            for (i = 0; i < 42; i++) {
                var cls = "";

                setCheck(firstDay);

                markDateCheck(firstDay);

                if (new Date().format(options.dateFM) === firstDay.format(options.dateFM)) {
                    cls += " today";
                }

                cls += date.getMonth() === firstDay.getMonth() ? " pickarea hikly-datepicker-able" : " pickarea hikly-datepicker-disable";

                if (date.getMonth() === firstDay.getMonth()) {
                    cls += (" days" + firstDay.getDate());
                }

                if ((i + 1) % 7 === 0) {
                    cls += " td-last";
                }

                if (i > 34) {
                    cls += " td-bottom";
                }

                arr.push({
                    name: firstDay.getDate(),
                    cls: cls
                });

                firstDay.setDate(firstDay.getDate() + 1);
            }

            return arr;
        },
        _showDateBar: function() {
            var that = this,
                options = that.options,
                reg = new RegExp(options.dateFM.substr(4, 1), "g");

            that.$el.append(
                '<div class="hikly-datepicker-toolbar"><button type="button" class="btn hikly-datepicker-today">' + _datepicker_today + '</button></div>');

            that.$el.find(".hikly-datepicker-today").click(function() {
                that.setValue(new Date().format(options.dateFM));
                options.onTodayClick();
                that.render();
            });
        }
    };

    function Plugin(option, value) {
        return this.each(function() {
            var $this = $(this),
                data = $this.data('bs.datepicker'),
                options = $.extend({}, Datepicker.DEFAULTS, $this.data(), typeof option === 'object' && option);

            if (!data) {
                $this.data('bs.datepicker', (data = new Datepicker(this, options)));
            }
            if (typeof option === 'string') {
                data[option](value);
            }
        });
    }

    var old = $.fn.datepicker;

    $.fn.datepicker = Plugin;
    $.fn.datepicker.Constructor = Datepicker;


    // CAROUSEL NO CONFLICT
    // ====================

    $.fn.datepicker.noConflict = function() {
        $.fn.datepicker = old;
        return this;
    };

})(jQuery);


(function($) {
    'use strict';

    var Timepicker = function(element, options) {
        this.options = options;
        this.$el = $(element);

        this.render();
    };

    Timepicker.VERSION = '1.0.0';

    Timepicker.DEFAULTS = {
        dateFM: "yyyy-MM-dd HH:mm:ss",
        maxhLimit: true, //by wangqin 是否限制最大小时，true 最大23：59:59
        onChange: function() {},
        showSS: true, //隐藏秒
        enChange: true,
        value: null
    };

    Timepicker._dpTimeTemplate =
        '<div class="hikly-timepicker">' +
        '<div class="hhpicker bottom-picker"></div>' +
        '<div class="mmpicker bottom-picker"></div>' +
        '<div class="sspicker bottom-picker"></div>' +
        '<table><tbody><tr><td rowspan="2">' +
        '<input type="text" class="tE thour" maxlength="2" onkeyup="this.value=this.value.replace(/\\D/g,\'\')"  onafterpaste="this.value=this.value.replace(/\\D/g,\'\')" value="<&= hour &>" <& if(!enChange){ &>readonly<& } &> >' +
        '<input value=":" class="tm" readonly="" value="<&= hour &>">' +
        '<input type="text" class="tE tminute" maxlength="2" onkeyup="this.value=this.value.replace(/\\D/g,\'\')"  onafterpaste="this.value=this.value.replace(/\\D/g,\'\')" value="<&= minute &>" <& if(!enChange){ &>readonly<& } &> >' +
        '<input value=":" class="tm" readonly="">' +
        '<input type="text" class="tE tsecond" maxlength="2" onkeyup="this.value=this.value.replace(/\\D/g,\'\')"  onafterpaste="this.value=this.value.replace(/\\D/g,\'\')" value="<&= second &>"  <& if(!enChange){ &>readonly<& } &> ></td>' +
        '<& if(enChange){ &><td><button class="dpTimeUp"></button></td></tr><tr><td><button class="dpTimedown"></button></td><& } &></tr></tbody></table></div>';

    Timepicker._bottomPickTemplate =
        '<table>' +
        '<& for(var i=0,tl = trs.length,xx;i < tl;i++){ &>' +
        '<& xx = trs[i]; &>' +
        '<& if(i%7 == 0){ &>' +
        '<tr>' +
        '<& } &>' +
        '<td class="hikly-datepick-bottom-pick <&= xx.cls &>"><&= xx.name &></td>' +
        '<& if((i+1)%7 == 0){&>' +
        '</tr>' +
        '<& } &>' +
        '<& } &></table>';

    Timepicker._config = {
        _buttonState: "hour"
    };

    Timepicker.tagName = 'timepicker';

    Timepicker.prototype = {
        render: function() {
            var that = this,
                options = that.options,
                values = that.getValue().split(options.dateFM.substr(13, 1));

            that.$el.data("value", that.getValue());

            that.$el.empty();
            that.$el.append($($.template(Timepicker._dpTimeTemplate, {
                hour: that._numToStr(values[0]),
                minute: that._numToStr(values[1]),
                second: that._numToStr(values[2]),
                enChange: options.enChange
            })));

            if (options.enChange) {
                that._addEvent();
            }
            if (!options.showSS) {
                $(".tsecond", that.$el).hide();
                $(".tm", that.$el).eq(1).hide();
            }
        },

        getValue: function() {
            var that = this,
                options = that.options;

            if (options.value) {
                if (options.value.indexOf(" ") > -1) {
                    options.value = options.value.split(" ")[1];
                }
                return options.value;
            }
            return new Date().format(options.dateFM).split(" ")[1];
        },

        setValue: function(str, changeins) {
            var that = this,
                options = that.options,
                values;

            if (str instanceof Date) {
                options.value = new Date().format(options.dateFM).split(" ")[1];
            } else {
                options.value = str;
            }

            that.$el.data("value", options.value);
            options.onChange.apply(that.$el);

            if (changeins) {
                return;
            }

            values = options.value.split(options.dateFM.substr(13, 1));

            that.$el.find(".thour").val(that._numToStr(values[0]));
            that.$el.find(".tminute").val(that._numToStr(values[1]));
            that.$el.find(".tsecond").val(that._numToStr(values[2]));
        },

        _changeValue: function() {
            var that = this,
                options = that.options;

            that.setValue([that.$el.find(".thour").val(), that.$el.find(".tminute").val(), that.$el.find(".tsecond").val()].join(
                options.dateFM.substr(13, 1)), true);
        },

        _addEvent: function() {
            var that = this,
                options = that.options,
                _buttonState = Timepicker._buttonState;

            // by wangqin 对秒也进行了disabled
            if (that._judgeNumber(that._numToStr(that.$el.find(".thour").val()), "hour") === "24") {
                that.$el.find(".tminute").val("00");
                that.$el.find(".tminute").attr('disabled', 'true');
                that.$el.find(".tsecond").val("00");
                that.$el.find(".tsecond").attr('disabled', 'true');
            }

            //添加小时选择框及事件 by wangqin 对秒也进行了disabled
            that.$el.find(".thour").blur(function() {
                if (that._judgeNumber(that._numToStr(that.$el.find(".thour").val()), "hour") === "24") {
                    that.$el.find(".tminute").val("00");
                    that.$el.find(".tminute").attr('disabled', 'true');
                    that.$el.find(".tsecond").val("00");
                    that.$el.find(".tsecond").attr('disabled', 'true');
                } else {
                    that.$el.find(".tminute").removeAttr('disabled');
                    that.$el.find(".tsecond").removeAttr('disabled');
                }
                that.$el.find(".thour").val(that._judgeNumber(that._numToStr(that.$el.find(".thour").val()), "hour"));
                that.$el.find(".hhpicker").hide();
                that._changeValue();
            });
            that.$el.find(".thour").click(function() {
                var hour = that.getValue().split(options.dateFM.substr(13, 1))[0],
                    hhpicker = that.$el.find(".hhpicker"),
                    hhpickerArr = [];
                _buttonState = "hour";
                //by wangqin
                var maxHour = 25;
                if (options.maxhLimit) {
                    maxHour = 24;
                }
                for (var i = 0; i < maxHour; i++) {
                    var cls = "";

                    if (i === Number(hour)) {
                        cls += "checked";
                    }

                    hhpickerArr.push({
                        name: that._numToStr(i),
                        cls: cls + " hour-picker"
                    });
                }
                hhpicker.empty();
                hhpicker.show();

                hhpicker.append($($.template(Timepicker._bottomPickTemplate, {
                    trs: hhpickerArr
                })));
                // by wangqin 对秒也进行了disabled
                hhpicker.find(".hour-picker").mousedown(function(event) {
                    that.$el.find(".thour").val(event.target.innerHTML);
                    if (that._judgeNumber(that._numToStr(that.$el.find(".thour").val()), "hour") === "24") {
                        that.$el.find(".tminute").val("00");
                        that.$el.find(".tminute").attr('disabled', 'true');
                        that.$el.find(".tsecond").val("00");
                        that.$el.find(".tsecond").attr('disabled', 'true');
                    } else {
                        that.$el.find(".tminute").removeAttr('disabled');
                        that.$el.find(".tsecond").removeAttr('disabled');
                    }
                    that.$el.find(".hhpicker").hide();
                });
            });

            //添加分钟选择框及事件
            that.$el.find(".tminute").blur(function() {
                that.$el.find(".tminute").val(that._judgeNumber(that._numToStr(that.$el.find(".tminute").val())));
                that.$el.find(".mmpicker").hide();
                that._changeValue();
            });
            that.$el.find(".tminute").click(function() {
                var minute = that.getValue().split(options.dateFM.substr(13, 1))[1],
                    mmpicker = that.$el.find(".mmpicker"),
                    mmpickerArr = [];
                _buttonState = "minute";

                for (var i = 0; i < 12; i++) {
                    var cls = "";

                    if (i * 5 === Number(minute)) {
                        cls += "checked";
                    }

                    mmpickerArr.push({
                        name: that._numToStr(i * 5),
                        cls: cls + " minute-picker"
                    });
                }
                mmpicker.empty();
                mmpicker.show();

                mmpicker.append($($.template(Timepicker._bottomPickTemplate, {
                    trs: mmpickerArr
                })));

                mmpicker.find(".minute-picker").mousedown(function(event) {
                    that.$el.find(".tminute").val(event.target.innerHTML);
                    that.$el.find(".mmpicker").hide();
                });
            });

            //添加秒选择框及事件
            that.$el.find(".tsecond").blur(function() {
                that.$el.find(".tsecond").val(that._judgeNumber(that._numToStr(that.$el.find(".tsecond").val())));
                that.$el.find(".sspicker").hide();
                that._changeValue();
            });
            that.$el.find(".tsecond").click(function() {
                var second = that.getValue().split(options.dateFM.substr(13, 1))[2],
                    sspicker = that.$el.find(".sspicker"),
                    sspickerArr = [];
                _buttonState = "second";

                for (var i = 0; i < 12; i++) {
                    var cls = "";

                    if (i * 5 === Number(second)) {
                        cls += "checked";
                    }

                    sspickerArr.push({
                        name: that._numToStr(i * 5),
                        cls: cls + " second-picker"
                    });
                }
                sspicker.empty();
                sspicker.show();

                sspicker.append($($.template(Timepicker._bottomPickTemplate, {
                    trs: sspickerArr
                })));

                sspicker.find(".second-picker").mousedown(function(event) {
                    that.$el.find(".tsecond").val(event.target.innerHTML);
                    that.$el.find(".sspicker").hide();
                });
            });

            // by wangqin 对秒上下箭头间隔设置了1s
            that.$el.find(".dpTimeUp").mousedown(function(event) {

                switch (_buttonState) {
                    case "hour":
                        // by wangqin
                        if (options.maxhLimit) {
                            if (Number(that.$el.find(".thour").val()) === 23) {
                                that.$el.find(".thour").blur();
                                return false;
                            }
                        }
                        that.$el.find(".thour").val(that._numToStr(Number(that.$el.find(".thour").val()) + 1));
                        that.$el.find(".thour").blur();
                        break;
                    case "minute":
                        that.$el.find(".tminute").val(that._numToStr(Number(that.$el.find(".tminute").val()) + 1));
                        that.$el.find(".tminute").blur();
                        break;
                    case "second":
                        that.$el.find(".tsecond").val(that._numToStr(Number(that.$el.find(".tsecond").val()) + 1));
                        that.$el.find(".tsecond").blur();
                        break;
                }
                return false;
            });

            // by wangqin 对秒上下箭头间隔设置了1s
            that.$el.find(".dpTimedown").mousedown(function(event) {
                switch (_buttonState) {
                    case "hour":
                        that.$el.find(".thour").val(that._numToStr(Number(that.$el.find(".thour").val()) - 1));
                        that.$el.find(".thour").blur();
                        break;
                    case "minute":
                        that.$el.find(".tminute").val(that._numToStr(Number(that.$el.find(".tminute").val()) - 1));
                        that.$el.find(".tminute").blur();
                        break;
                    case "second":
                        that.$el.find(".tsecond").val(that._numToStr(Number(that.$el.find(".tsecond").val()) - 1));
                        that.$el.find(".tsecond").blur();
                        break;
                }
                return false;
            });
        },
        //时间工具方法
        _judgeNumber: function(num, type) {
            switch (type) {
                case "hour":
                    if (num > 24) {
                        return "24";
                    } else if (num < 0) {
                        return 0;
                    } else {
                        return num;
                    }
                    break;
                default:
                    if (num > 59) {
                        return 59;
                    } else if (num < 0) {
                        return 0;
                    } else {
                        return num;
                    }
                    break;
            }
        },
        _numToStr: function(num) {
            if (num < 0) {
                return "00";
            }
            if (num.toString().length < 2) {
                return "0" + num;
            }
            return num;
        }
    };

    function Plugin(option, value) {
        return this.each(function() {
            var $this = $(this),
                data = $this.data('bs.timepicker'),
                options = $.extend({}, Timepicker.DEFAULTS, $this.data(), typeof option === 'object' && option);

            if (!data) {
                $this.data('bs.timepicker', (data = new Timepicker(this, options)));
            }

            if (typeof option === 'string') {
                data[option](value);
            }
        });
    }

    var old = $.fn.timepicker;

    $.fn.timepicker = Plugin;
    $.fn.timepicker.Constructor = Timepicker;


    // CAROUSEL NO CONFLICT
    // ====================

    $.fn.timepicker.noConflict = function() {
        $.fn.timepicker = old;
        return this;
    };
})(jQuery);


(function($) {
    'use strict';

    var DpCombo = function(element, options) {
        this.options = options;
        this.$el = $(element);

        this._config = {
            isModify: true,
            _needFrash: true,
            dialog: null,
            _datepicker: null,
            _timepicker: null
        };

        this.cid = "dpCombo" + (++DpCombo.idCounter);
        this.render();
    };

    DpCombo.VERSION = '1.0.0';

    DpCombo._dpTControlTemplate =
        '<button type="button" class="btn dp-dqsj"><&= _datepicker_dqsj &></button>' +
        '<button type="button" class="btn dp-ok"><&= _datepicker_ok &></button>';

    DpCombo.DEFAULTS = {
        width: 200,
        height: 24,
        iconWidth: 24, //by wangqin 添加了iconWidth属性，时间控件右边的图标宽度
        maxhLimit: true, //by wangqin 是否限制最大小时，true最大23：59:59
        emptyFlag: true, //by wangqin 是否可以为空
        value: null,
        dateFM: "yyyy-MM-dd HH:mm:ss",
        cls: "",
        single: false, //默认为只选日期
        markDates: [],
        isSunFirst: true, //是否是星期天是第一位
        offset: { // 偏移量
            x: 0,
            y: -1
        },
        onChange: function() {},
        icon: "dateBox",
        onClear: function() {}
    };

    DpCombo.idCounter = 0;

    DpCombo.tagName = 'dpCombo';

    DpCombo._width = 245;

    DpCombo._height = 318;

    DpCombo.prototype = {
        render: function() {
            var that = this,
                dialog,
                options = that.options,
                _config = that._config;

            that.$el.css({
                height: options.height,
                width: options.width
            });
            if ((options.value) instanceof Date) {
                options.value = options.value.format(options.dateFM);
            }
            that.$el.data("value", options.value);
            that.$el.empty();

            that.$el.addClass("hikly-datepickerCombo");
            that.$el.append($('<input type="text" name="' + that.$el.attr("id") + '" style="width:' + (options.width - options.iconWidth) + 'px;height:' + (options.height - 2) +
                'px;" class="hikly-datepicker-input" readOnly><div class="dpCombo-icon ' + options.icon + '"><a></a></div>'));

            $("body").append($('<div id="' + that.cid + '_dialog" class="hikly-datepicker-dialog"></div>'));

            that.$el.find(".hikly-datepicker-input").click(function() {
                if (_config._needFrash) {
                   //_config._needFrash = false;
                    that._showDatepicker();

                    if (!options.single) {
                        that._showTimerpickerBar();
                    }
                }
                that._showDialog();
                if (that.getValue().length > 0) {
                    //by wangqin
                    if (!!options.emptyFlag) {
                        _config.isModify = false;
                    }
                }
                that._changeIconType();
            });

            var dpComboIcon = that.$el.find(".dpCombo-icon");
            dpComboIcon.mousedown(function() {

                if (_config.isModify) {
                    that.$el.find(".hikly-datepicker-input").click();
                } else {
                    that.setValue("");
                    that._changeIconType();
                }
            });

            that.$el.find(".hikly-datepicker-input").val(that.getValue());
        },

        _changeIconType: function() {
            var that = this,
                options = that.options,
                _config = that._config,
                dpComboIcon = that.$el.find(".dpCombo-icon");

            if (_config.isModify) {
                dpComboIcon.removeClass("removeBox");
                dpComboIcon.addClass(options.icon);
            } else {
                dpComboIcon.addClass("removeBox");
                dpComboIcon.removeClass(options.icon);
            }
        },

        setValue: function(str) {
            var that = this,
                dateFM,
                options = that.options,
                _config = that._config;

            if (options.single) {
                dateFM = options.dateFM.split(" ")[0];
            } else {
                dateFM = options.dateFM;
            }

            if (str instanceof Date) {
                options.value = str.format(dateFM);
            } else if (typeof str === "string") {
                if (options.single) {
                    str = str.split(" ")[0];
                }
                options.value = str;
            }
            that.$el.data("value", options.value);
            that.$el.find(".hikly-datepicker-input").val(options.value);
            // that.render();

            if (_config.dialog) {
                _config.dialog.popUp("close");
            }
            options.onChange.apply(that.$el);

        },

        getValue: function() {
            var that = this,
                dateFM,
                options = that.options;

            if (options.value) {
                if (options.single) {
                    return options.value.split(" ")[0];
                }
                return options.value;
            }
            return '';
        },
        //展现下拉框
        _showDialog: function() {
            var that = this,
                pageX, pageY,
                options = that.options,
                _config = that._config;
            setTimeout(function() { //ie取不到document.documentElement.scrollLeft有待改善 xx
                // edit by chenguanbin 2015-09-02
                // 添加偏移量
                pageX = that.$el.offset().left - (options.offset.x || 0);
                pageY = that.$el.offset().top - (options.offset.y || -1);

                if ((pageY + $(document).scrollTop()) > 320) {
                    pageY -= 320;
                } else {
                    pageY += 24;
                }
                _config.dialog = $('#' + that.cid + '_dialog').popUp({
                    x: pageX,
                    y: pageY,
                    zindex: 100002,
                    width: DpCombo._width,
                    height: DpCombo._height,
                    isBlur: true,
                    close: function() {
                        _config.isModify = true;
                        that._changeIconType();
                    }
                });

                _config.dialog.popUp("open");
            }, 10);
        },
        //展现时间组件
        _showDatepicker: function() {
            var that = this,
                options = that.options,
                _config = that._config;
                //解决setvalue之后日历没有更新的缺件
            $('#' + that.cid + '_dialog').remove();
            $('<div id="'+that.cid +'_dialog" class="hikly-datepicker-dialog"><div>').appendTo('body');

            $('#' + that.cid + '_dialog').datepicker($.extend({}, that.options, {
                single: true,
                dateFM: "yyyy-MM-dd",
                value: that.getValue(),
                onChange: function() {
                    if (options.single) {
                        that.setValue($(this).data('value'));
                    }
                }
            }));
        },
        _showTimerpickerBar: function() {
            var that = this,
                dialog, toolbar,
                options = that.options,
                _config = that._config;

            //添加不同工具栏
            if ($('#' + that.cid + '_dialog').length > 0) {
                toolbar = $('#' + that.cid + '_dialog').find(".hikly-datepicker-toolbar");
            } else {
                toolbar = $('<div class="hikly-datepicker-toolbar"></div>');
                $('#' + that.cid + '_dialog').append(toolbar);
            }

            toolbar.empty();

            toolbar.append($($.template(DpCombo._dpTControlTemplate, {
                _datepicker_dqsj: _datepicker_dqsj,
                _datepicker_ok: _datepicker_ok
            })));


            toolbar.find(".dp-dqsj").after($('<div id="' + that.cid + '_timepicker" class="toolbar-combo"></div>'));

            _config.timepicker = $('#' + that.cid + '_timepicker').timepicker($.extend({}, that.options, {
                value: options.value ? options.value.split(" ")[1] : null,
                onChange: function() {}
            }));

            toolbar.find(".dp-dqsj").click(function() {
                that.setValue((new Date()).format(options.dateFM));
                // that.render();
            });

            toolbar.find(".dp-ok").click(function() {
                if (options.single) {
                    that.setValue($('#' + that.cid + '_dialog').data('value'));
                } else {
                    that.setValue($('#' + that.cid + '_dialog').data('value') + " " + $('#' + that.cid + '_timepicker').data('value'));
                }
            });
        }
    };

    function Plugin(option, value) {

        return this.each(function() {
            var $this = $(this),
                data = $this.data('bs.dpCombo'),
                options = $.extend({}, DpCombo.DEFAULTS, $this.data(), typeof option === 'object' && option);

            if (!data) {
                $.data(this, "bs.dpCombo", (data = new DpCombo($(this), options)));
            }

            if (typeof option === 'string') {
                data[option](value);
            }
        });
    }

    var old = $.fn.dpCombo;

    $.fn.dpCombo = Plugin;
    $.fn.dpCombo.Constructor = DpCombo;


    // CAROUSEL NO CONFLICT
    // ====================

    $.fn.dpCombo.noConflict = function() {
        $.fn.dpCombo = old;
        return this;
    };
})(jQuery);

//备份jquery的ajax方法
$._ajax = $.ajax;
/**
 * 重载ajax通用方法
 * @author xiangxiao
 * @date   2014-10-31
 * @param  {[type]}   opt [description]
 * @return {[type]}       [description]
 */
var ajaxArr = [];
var defaultOpt = {
    actionFlag: true
};
$.ajax = function(opt) {
    opt = $.extend({}, defaultOpt, opt);
    var fn = {
        error: function(XMLHttpRequest, textStatus, errorThrown) {},
        success: function(data, textStatus) {},
        beforeSend: function(jqXHR, settings) {}
    };
    if (opt.error) {
        fn.error = opt.error;
    }
    if (opt.success) {
        fn.success = opt.success;
    }
    if (opt.beforeSend) {
        fn.beforeSend = opt.beforeSend;
    }
    if (opt.actionFlag && opt.url.indexOf("?") === -1) {
        if (opt.url && opt.url.indexOf(".action") > -1) {
            opt.url = opt.url.substr(0, opt.url.length - 7);
        }
        if (opt.url.indexOf(".js") === -1) {
            opt.url += ".action";
        }
        opt.url += "?time=" + new Date().getTime();
    }
    //ie789下存在先出发blur再出发keydown事件，所有的验证请求都不加遮罩，实现方式有待改善
    if (!opt.isValid) {
        if (ajaxArr.length > 20) {
            $.say("请求次数过多, 休息一会吧", "success");
            return;
        }

        fn.mask = opt.mask || true;

        //前后都加了延时判断 以免后面不会unmask
        if (ajaxArr.length === 0 && fn.mask) {
            setTimeout(function() {
                if (ajaxArr.length > 0) {
                    $.mask({
                        loading: true
                    });
                }
            }, 20);
        }

        ajaxArr.push(opt);
        //默认情况都是true，只有当用户传了false，才是false.
        var flag = true;
        if(opt.mask == "false"){
            flag = false;
        }
        fn.mask = flag;

        if (fn.mask) {
            $.mask({
                transparent: true
            });
        }
    }

    opt.type = opt.type ? opt.type : "POST";
    opt.timeout = opt.timeout ? opt.timeout : 120000;
    var _opt = $.extend(opt, {
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            var text = XMLHttpRequest.responseText;
            if (text && text.indexOf("this_is_login_input_title") !== -1) {
                // 隐藏OCX
                $('object').hide();

                $.alert({
                    module: true,
                    info: "登陆超时",
                    title: "提醒",
                    isShowClose: true,
                    sureBtn: null
                });
                ajaxArr.shift();

                if (ajaxArr.length === 0) {
                    $.unmask();
                }
                fn.error(XMLHttpRequest, textStatus, errorThrown);
                setTimeout(function() {
                    location.reload();
                }, 1000);
            } else {
                ajaxArr.shift();
                if (ajaxArr.length === 0) {
                    $.unmask();
                }
                fn.error(XMLHttpRequest, textStatus, errorThrown);
            }
        },
        success: function(data, textStatus) {
            if (undefined === data.success && data.indexOf("this_is_login_input_title") !== -1) {
                $.alert({
                    module: true,
                    info: "登陆超时",
                    title: "提醒",
                    isShowClose: true,
                    sureBtn: null
                });
                setTimeout(function() {
                    location.reload();
                    return;
                }, 1000);
                return;
            }
            if (!opt.isValid) {
                ajaxArr.shift();

                if (ajaxArr.length === 0) {
                    setTimeout(function() {
                        ajaxArr.length === 0 && $.unmask();
                    }, 100);
                }
            }

            if (!data) {
                return;
            }

            //如果是html,有待改善，需改善为正则
            if (typeof data === "string") {
                try {
                    data = $.parseJSON(data);
                } catch (e) {
                    fn.success(data, textStatus);
                    return;
                }
            }
            if (data.sessionStatus === "timeout") {
                $.alert({
                    module: true,
                    info: "登陆超时",
                    title: "提醒",
                    isShowClose: true,
                    sureBtn: null
                });
                setTimeout(function() {
                    location.reload();
                }, 1000);
                return;
            }
            if (opt.valid) { //如果是验证
                fn.success(data, textStatus);
                return;
            }

            if (typeof data.sessionStatus === "string" && data.sessionStatus === "timeout") {
                return;
            }
            if (!data.success) {
                $.say(data.message);
                opt.onerror && opt.onerror(data.message);

                if (opt.failure) {
                    opt.failure(data);
                }
                return;
            }
            fn.success(data.data, data.message, textStatus);
        },
        beforeSend: function(jqXHR, settings) {
            fn.beforeSend(jqXHR, settings);
        }
    });
    return $._ajax(_opt);
};
