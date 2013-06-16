/**
 * For main
 * User: q13
 * Date: 13-5-26
 * Time: 下午12:53
 */
(function(root){
    var Tpl=function(tplName){
        this.tplName=tplName||"index";
        this.init();
    };
    _.extend(Tpl.prototype,{
        init:function(){
            var tplName=this.tplName,
                tplInitName=tplName+"Init";
            this[tplInitName]&&this[tplInitName]();
        },
        tabs:function(navList,panelList){
            var navListEl=$(navList),
                navItemEl=$('.nav-item a',navListEl),
                panelListEl=$(panelList),
                panelItemEl=$('.panel-item',panelListEl);
            navListEl.on('click','.nav-l',function(evt){
                var meEl=$(this),
                    href=meEl.attr('href');
                //导航激活
                navItemEl.removeClass('state-active');
                meEl.addClass('state-active');
                //面板激活
                panelItemEl.removeClass('state-active');
                $(href).addClass('state-active');
                //触发switched事件
                navListEl.trigger('switched',[meEl,$(href)]);
                evt.preventDefault();
            });
        },
        carousel:function(carousel){
            var carouselEl=$(carousel),
                showPanelEl=$('.carousel-show-panel',carouselEl),
                listEl=$('.carousel-list',carouselEl),
                itemEl=$('.carousel-item',listEl),
                indicatorItemEl=$('.indicator-item',carouselEl);
            var totalLength=itemEl.length,
                activeIndex=0;
            //定义执行体
            var run=function(){
                listEl.stop(true,true).animate({
                    "left":-itemEl.width()*activeIndex
                },400);
            };
            //更新状态
            var updateState=function(){
                indicatorItemEl.removeClass('state-active').eq(activeIndex).addClass('state-active');
				$('.to-left,.to-right',carouselEl).show();
				if(activeIndex==0){
					$('.to-left',carouselEl).hide();
				}
				if(activeIndex==totalLength-1){
					$('.to-right',carouselEl).hide();
				}
            };
            showPanelEl.css({
                "overflow":"hidden"
            });
            //设置list大宽度
            listEl.width(10000);
            //设置show panel高度
            showPanelEl.height(listEl.height());
            carouselEl.on('click','.to-left,.to-right',function(evt){
                var meEl=$(this);
                if(meEl.hasClass('to-right')){
                    if(activeIndex<totalLength-1){
                        activeIndex++;
                        run();
                    }
                }else{
                    if(activeIndex>0){
                        activeIndex--;
                        run();
                    }
                }
                updateState();
            }).on('click','.indicator-item',function(evt){
                var meEl=$(this),
                    index=indicatorItemEl.index(meEl);
                activeIndex=index;
                run();
                updateState();
                evt.preventDefault();
            });
        },
        indexInit:function(){
            var caseEl=$('.bd .case'),
                caseLinkEl=$('.case-l',caseEl),
                advListEl=$('#adv-list');
            //焦点图
            advListEl.responsiveSlides({
                auto: true,
                pager: true,
                nav: true,
                speed: 500,
                maxwidth: 660,
                namespace: "adv-slide"
            });
        },
        aboutInit:function(){
            var that=this;
            var navListEl=$('.bd .nav-list'),
                panelListEl=$('.bd .panel-list'),
                carouselEl=$('.bd .member .carousel');
            this.tabs(navListEl,panelListEl);
            navListEl.on('switched',function(evt,nav,panel){
                if(!carouselEl.data('rendered')&&$.contains($(panel).get(0),carouselEl.get(0))){
                    that.carousel(carouselEl);
                    carouselEl.data('rendered',true);
                }
            });
        },
        ywtxInit:function(){
            var navListEl=$('.bd .nav-list'),
                panelListEl=$('.bd .panel-list');
			var systemName=location.hash.slice(1);
            this.tabs(navListEl,panelListEl);
			if(systemName.length>0){
                $('.nav-l',navListEl).filter('[href="#'+systemName+'-panel"]').click();
            }
        },
        joinInit:function(){
            var navListEl=$('.bd .nav-list'),
                panelListEl=$('.bd .panel-list');
            this.tabs(navListEl,panelListEl);
        },
        alfxInit:function(){
            var carouselEl=$('.bd .carousel'),
                caseEl=$('.bd .case'),
                caseLinkEl=$('.case-l',caseEl);
            var caseName=location.hash.slice(1);
            this.carousel(carouselEl);
            //lightbox效果
            caseLinkEl.fancybox();
            if(caseName.length>0){
                caseLinkEl.filter('[href="alfx/'+caseName+'.html"]').click();
            }
        }
    });
    //Dom ready后进行页面初始化
    jQuery(function($){
        var bodyEl=$('body'),
            tplName=bodyEl.attr('tplname');
        new Tpl(tplName);
		$('#addFav').click(addFavorite);
    });
}(window));

function addFavorite(){
var url=location.href;
var title="北京伟联市场顾问有限公司";
ua = navigator.userAgent.toLowerCase();
	if(document.all){
		try{
			window.external.AddFavorite(url,title);
		}
		catch(e){
			alert("加入收藏失败，\n请您使用菜单栏或Ctrl+D收藏本站。");
		}
	}else if(window.sidebar){
		window.sidebar.addPanel(title,url,"")
	}
	else{
		alert("加入收藏失败，\n请您使用菜单栏或Ctrl+D收藏本站。");
	}
	return false;
}