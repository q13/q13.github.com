/******************************************
 * 纷享销客banner
 *
 * @author          q13
 * @copyright       Copyright (c) 2012 Websanova.
 * @license         Licensed under the MIT and GPL licenses.
 * @link            http://code13.ml
 * @github          https://github.com/q13/q13.github.com
 * @version			1.0.0
 *
 ******************************************/

(function($) {
    $.fn.banner = function(option, settings) {
        if (typeof option === 'object') {
            settings = option;
        } else if (typeof option === 'string') {
            var values = [];

            var elements = this.each(function() {
                var banner = $(this).data('_banner');

                if (banner) {
                    if (option === 'destroy') {
                        banner.destroy();
                    } else if (option === 'lock') {
                        banner.lock(settings);
                    } else if (option === 'startPlay') {
                        banner.startPlay();
                    } else if (option === 'stopPlay') {
                        banner.stopPlay();
                    } else if (option === 'switchTo') {
                        banner.switchTo(settings);
                    }else if ($.fn.banner.defaultSettings[option] !== undefined) {
                        if (settings !== undefined) {
                            banner.settings[option] = settings;
                        } else {
                            values.push(banner.settings[option]);
                        }
                    }
                }
            });

            if (values.length === 1) {
                return values[0];
            }
            if (values.length > 0) {
                return values;
            } else {
                return elements;
            }
        }

        return this.each(function() {
            var $el = $(this);

            var $settings = $.extend({},
            $.fn.banner.defaultSettings, settings || {});

            var banner = new Banner($el,$settings);
            $el.data('_banner', banner);
        });
    }

    $.fn.banner.defaultSettings = {
        itemSelector: 'li',
        easing:'swing', //缓动函数
        duration: 600,  //动画过程
        interval:1000 //动画间隔
    };

    function Banner($el,settings) {
        this.settings = settings;
        this.$el = $el;
        this.tid=null;  //计时器id
        this._locked=false; //锁定
        this._currentIndex=0;    //追踪当前激活item
        this.init();
        return this;
    }

    Banner.prototype = {
        init: function() {
            var $el=this.$el;
            var settings=this.settings;  
            var $items=$(settings.itemSelector,$el);
            var elPosition=$el.css('position');
            //设置element容器定位
            if(elPosition=="static"){
                $el.css('position','relative');       
            }
            //设置item绝对定位并隐藏
            $items.css({
                'position':'absolute',
                'top':'0',
                'left':'0',
                'opacity':0
            }).hide();
            //事件绑定
            this._bindEvent();
        },
        _bindEvent:function(){
            var that=this;
            var $el=this.$el;  
            $el.on('mouseenter',function(){
                that.stopPlay();        
            }).on('mouseleave',function(){
                that.startPlay(); 
            });
        },
        _animate:function(nextIndex,callback){
            var that=this;
            var settings=this.settings,
                easing=settings.easing,
                duration=settings.duration;
            var $el=this.$el,
                itemsEl=$(settings.itemSelector,$el);
            var currentIndex=that._currentIndex,
                $currentItem,
                $nextItem,
                activeCompleted=false,
                nextCompleted=false;
            if(currentIndex==nextIndex){ //下一个item和当前item index相等，直接返回
                return;
            }
            $currentItem=itemsEl.eq(currentIndex);
            $nextItem=itemsEl.eq(nextIndex);
            
            $currentItem.stop(true,true).animate({
                'opacity':0
            },duration,easing,function(){
                $currentItem.hide(); 
                activeCompleted=true;
                if(activeCompleted&&nextCompleted){
                    that._currentIndex=nextIndex;
                    callback&&callback();   
                }   
            });  
            $nextItem.show().stop(true,true).animate({
                'opacity':1
            },duration,easing,function(){
                nextCompleted=true;
                if(activeCompleted&&nextCompleted){
                    that._currentIndex=nextIndex;
                    callback&&callback();     
                }
            });      
        },
        startPlay:function(){
            var that=this;
            var settings=this.settings,
                interval=settings.interval;
            var $el=this.$el,
                itemsEl=$(settings.itemSelector,$el);
            
            clearTimeout(this.tid);
            (function(){
                var fnSelf=arguments.callee;
                var currentIndex=that._currentIndex,
                    itemLength=itemsEl.length,
                    nextIndex;
                
                if(!that._locked){
                    //确定跳转下一个item
                    if(currentIndex>=itemLength-1){
                        nextIndex=0;        
                    }else{
                        nextIndex=currentIndex+1;
                    }    
                    that._animate(nextIndex,function(){
                        clearTimeout(that.tid);
                        that.tid=setTimeout(function(){
                            fnSelf();    
                        },interval);    
                    });
                }
            }());
        },
        stopPlay:function(){
            clearTimeout(this.tid);    
        },
        lock: function(locked) {
            this._locked=!!locked;
        },
        switchTo:function(index){
            this._animate(index);
        },
        destroy: function() {
            var $el=this.$el;
            $el.off();
        }
    }
})(jQuery);