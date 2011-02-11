var originalLangField;
var translatedLangField;
var originalManualLangField;
var translatedManualLangField;

Ext.onReady(function(){
	Ext.QuickTips.init();
	
	originalLangField = new Ext.form.ComboBox({
		id: 'originalLang',
    	fieldLabel: LANG("FROM_LANGUAGE"),
		labelAlign: "right",
	    triggerAction: 'all',
		width:150,
		allowBlank: false,
	    mode: 'local',
		forceSelection: true,
		readOnly: false,
	    store: new Ext.data.ArrayStore({
	        id: 0,
	        fields: ['name','displayText'],
	        data: languagesArray
	    }),
	    valueField: 'name',
	    displayField: 'displayText'
	})
	
	translatedLangField = new Ext.form.ComboBox({
		id: 'translatedLang',
	    fieldLabel: LANG("TO_LANGUAGE"),
		triggerAction: 'all',
		width:150,
		allowBlank: false,
	    mode: 'local',
		forceSelection: true,
		readOnly: false,
	    store: new Ext.data.ArrayStore({
	        id: 0,
	        fields: ['name','displayText'],
	        data: languagesArray
	    }),
	    valueField: 'name',
	    displayField: 'displayText'
	})
	
	originalManualLangField = new Ext.form.ComboBox({
		id: 'originalManualLang',
    	fieldLabel: LANG("FROM_LANGUAGE"),
		labelAlign: "right",
	    triggerAction: 'all',
		width:150,
		allowBlank: false,
	    mode: 'local',
		forceSelection: true,
		readOnly: false,
	    store: new Ext.data.ArrayStore({
	        id: 0,
	        fields: ['name','displayText'],
	        data: languagesArray
	    }),
	    valueField: 'name',
	    displayField: 'displayText'
	})
	
	translatedManualLangField = new Ext.form.ComboBox({
		id: 'translatedManualLang',
	    fieldLabel: LANG("TO_LANGUAGE"),
		triggerAction: 'all',
		width:150,
		allowBlank: false,
	    mode: 'local',
		forceSelection: true,
		readOnly: false,
	    store: new Ext.data.ArrayStore({
	        id: 0,
	        fields: ['name','displayText'],
	        data: languagesArray
	    }),
	    valueField: 'name',
	    displayField: 'displayText'
	})

	var contextLabel=new Ext.form.Label({
		cls:'x-form-item',
		text:LANG('CONTEXT_LABEL')
	});

	var manualLabel=new Ext.form.Label({
		cls:'x-form-item',
		text:LANG('MANUAL_LABEL')
	});	
	
	var buttonSave = new Ext.Button({
		width:30,
		text: LANG("BUTTON_SAVE_CONFIG"),
		handler: saveOptions
	});
	
	var mainForm = new Ext.FormPanel({
        labelAlign: 'left',
        bodyStyle:'padding:5px',
        width: 770,        
		title: LANG.MEMORIZE_FORM_TITLE,
        items: [{
            xtype:'box',
            id:'instruction',
            fieldLabel:LANG("OPTIONS_DESC_TITLE"),
			hideLabel: true,
			cls:'x-form-item',
			html:LANG("OPTIONS_DESC_HTML"),
        },{
			border:true,
            items:[{
				xtype: 'fieldset',
				hideLabel: true,
				layout:'column',
				border:false,
				items:[{
					columnWidth:0.5,
					layout: 'form',
					border:false,
					items: [
						contextLabel,originalLangField,translatedLangField,new Ext.Spacer({height:3}),
						manualLabel,originalManualLangField,translatedManualLangField,new Ext.Spacer({height:3}),
						buttonSave,new Ext.Spacer({height:5})]
				},{
					columnWidth:0.5,
					layout: 'form',
					border:false,
					items: [{
						xtype:'box',
						id:'donate',
						hideLabel: true,
						cls:'x-form-item',
						html:LANG("DONATE"),					
					}]
				}]
			}]
			
		},{
            xtype:'box',
            id:'footer',
			hideLabel: true,
			cls:'x-form-item',
			html:LANG("OPTIONS_FOOTER_HTML"),
        }],
    buttons: [],
	buttonAlign:'left'
    });

	originalLangField.setValue(fromLang);
	translatedLangField.setValue(toLang);
	originalManualLangField.setValue(fromLangManual);
	translatedManualLangField.setValue(toLangManual);
	mainForm.render('optionsDiv');

	
});