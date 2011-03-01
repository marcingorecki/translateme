Ext.onReady(function(){
	Ext.QuickTips.init();
	tabs = new Ext.TabPanel({
		id:'tabs',
		renderTo: Ext.getBody(),
		activeTab: 0,
		deferredRender: true,
		height:600,
		width:800,
		
		items: [{
			title: LANG("OVERVIEW_TAB"),
			html: '<iframe src="overview.html" width="100%" height="100%" border="2"></iframe>'
		},{
			title: LANG("LEARN_TAB"),
			html: ''
		},{
			title: LANG("PHRASES_TAB"),
			html: '<iframe src="index.html" width="100%" height="100%" border="2"></iframe>'
		},{
			title: LANG("OPTIONS_TAB"),
			html: '<iframe src="options.html" width="100%" height="100%" border="2"></iframe>'
		}],
                listeners : {
                    tabchange : function(tabPanel, tab){
                        if(tab.title==LANG("LEARN_TAB")){
                            //reload the frame to get updated word list if necessary
                            tab.update('<iframe src="memorize.html" width="100%" height="100%" border="2"></iframe>');
                        }
                    }
                }
	});	

});