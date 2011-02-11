var WordsDataStore;
var WordsColumnModel;
var WordsListingEditorGrid;

/* add word section */
var WordCreateForm;
var WordCreateWindow;

var originalField;
var translatedField;
var originalLangField;
var translatedLangField;
	
Ext.onReady(function(){
	Ext.QuickTips.init();
	
	WordsDataStore = new Ext.data.ArrayStore({
	    fields: ['id', 'original','translated','originalLang','translatedLang','addedOn','lastDisplayed','memorized'],
	    idIndex: 'id',
	});
	
	
	var langCombo = new Ext.form.ComboBox({
	    typeAhead: true,
	    triggerAction: 'all',
	    lazyRender:true,
	    mode: 'local',
		forceSelection: true,
	    store: new Ext.data.ArrayStore({
	        id: 0,
	        fields: ['name','displayText'],
	        data: languagesArray
	    }),
	    valueField: 'name',
	    displayField: 'displayText'
	})
	
	var langComboTranslated = new Ext.form.ComboBox({
	    typeAhead: true,
	    triggerAction: 'all',
	    lazyRender:true,
	    mode: 'local',
		forceSelection: true,
	    store: new Ext.data.ArrayStore({
	        id: 0,
	        fields: ['name','displayText'],
	        data: languagesArray
	    }),
	    valueField: 'name',
	    displayField: 'displayText'
	})

	var memorizedCombo = new Ext.form.ComboBox({
	    typeAhead: true,
	    triggerAction: 'all',
	    lazyRender:true,
	    mode: 'local',
	    store: new Ext.data.ArrayStore({
	        id: 0,
	        fields: ['name','value'],
	        data: memorizedStates
	    }),
	    valueField: 'name',
	    displayField: 'value'
	})

	
	// create reusable renderer
	Ext.util.Format.comboRenderer = function(combo){
	    return function(value){
	        var record = combo.findRecord(combo.valueField, value);
	        return record ? record.get(combo.displayField) : combo.valueNotFoundText;
	    }
	}
	
	function formatDate(value){
        return value ? new Date(value).dateFormat('M d, Y') : '';
    } 
			
	WordsColumnModel = new Ext.grid.ColumnModel([
		  {header: LANG("WORD_GRID_HEADER_ID"), readOnly: true, dataIndex: 'id', width: 30, hidden: true},	
		  {header: LANG("WORD_GRID_HEADER_ORIGINAL"), dataIndex: 'original', width: 198, sortable: true, 
				editor: new Ext.form.TextField({allowBlank: false, maxLength: 2000, maskRe: /([a-zA-Z0-9\s]+)$/ })},
		  {header: LANG("WORD_GRID_HEADER_TRANSLATED"), dataIndex: 'translated', width: 197, sortable: true,
				editor: new Ext.form.TextField({allowBlank: false, maxLength: 2000, maskRe: /([a-zA-Z0-9\s]+)$/ }) },
		  {header: LANG("WORD_GRID_HEADER_ORIGINAL_LANG"), dataIndex: 'originalLang', width: 120, sortable: true, editor: langCombo,renderer: Ext.util.Format.comboRenderer(langCombo)},
		  {header: LANG("WORD_GRID_HEADER_TRANSLATED_LANG"), dataIndex: 'translatedLang', width: 120, sortable: true, 
		  		editor: langComboTranslated, renderer: Ext.util.Format.comboRenderer(langComboTranslated)},
		  {header: LANG("WORD_GRID_HEADER_ADDED_ON"), dataIndex: 'addedOn', width: 80, sortable: true, readOnly: true, renderer: formatDate}, 
		  {header: LANG("WORD_GRID_HEADER_LAST_SHOWN"), dataIndex: 'lastDisplayed', width: 85, sortable: true, readOnly: true, renderer: formatDate, hidden: true},
		  {header: LANG("WORD_GRID_HEADER_MEMORIZED"), dataIndex: 'memorized', width: 100, editor: memorizedCombo, renderer: Ext.util.Format.comboRenderer(memorizedCombo), hidden: true },
		  {xtype: 'actioncolumn', width: 30,
                items: [{
                    icon   : 'images/delete.gif', tooltip: LANG("WORD_GRID_DELETE_TOOLTIP"), handler: function(grid, rowIndex, colIndex) {
                        removeWord(rowIndex);
                    }
                }]
            }
		]);
		  
	WordsListingEditorGrid =  new Ext.grid.EditorGridPanel({
	    id: 'WordsListingEditorGrid',
	    store: WordsDataStore,
	    cm: WordsColumnModel,
	    enableColLock:false,
	    clicksToEdit:1,  
        stripeRows: true,
        height: 550,
        width: 770,
        title: LANG("WORD_GRID_TITLE"),
	    selModel: new Ext.grid.RowSelectionModel({singleSelect:false}),
		items: [{
            xtype:'box',
            id:'instruction',
			hideLabel: true,
			cls:'memorizeInstruction',
			html:LANG("GRID_DESC_HTML"),
        }
		],
		tbar: [
			/*{text: LANG("WORD_GRID_TBAR_SHOW_ALL"), tooltip: LANG("WORD_GRID_TBAR_SHOW_ALL_TOOLTIP"), iconCls:'showAll', handler: showAll},
			{text: LANG("WORD_GRID_TBAR_SHOW_NOT_MEMORIZED"), tooltip: LANG("WORD_GRID_TBAR_SHOW_NOT_MEMORIZED_TOOLTIP"), iconCls:'showNotMemorized', handler: showNotMemorized},*/
			{text: LANG("WORD_GRID_TBAR_ADD_NEW"), tooltip: LANG("WORD_GRID_TBAR_ADD_NEW_TOOLTIP"), iconCls:'newWord', handler: displayWordFormWindow}
		]
	});
	WordsListingEditorGrid.on('afteredit', gridUpdated);
	WordsListingEditorGrid.render('wordsGrid');
	
	
//create word form starts here	
	originalField = new Ext.form.TextField({
    	id: 'original',
    	fieldLabel: LANG("ORIGINAL_FIELD_TITLE"),
    	maxLength: 200,
    	allowBlank: false,
    	anchor : '95%',
    	maskRe: /([a-zA-Z0-9\s]+)$/
	});
	
	translatedField = new Ext.form.TextField({
    	id: 'translated',
    	fieldLabel: LANG("TRANSLATED_FIELD_TITLE"),
    	maxLength: 200,
    	allowBlank: false,
    	anchor : '95%',
    	maskRe: /([a-zA-Z0-9\s]+)$/
	});
	
	originalLangField = new Ext.form.ComboBox({
		id: 'originalLang',
    	fieldLabel: LANG("ORIGINAL_LANG_TITLE"),
	    triggerAction: 'all',
		anchor:'95%',
		allowBlank: false,
	    mode: 'local',
		forceSelection: true,
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
    	fieldLabel: LANG("TRANSLATED_LANG_TITLE"),
	    triggerAction: 'all',
		anchor:'95%',
		allowBlank: false,
	    mode: 'local',
		forceSelection: true,
	    store: new Ext.data.ArrayStore({
	        id: 0,
	        fields: ['name','displayText'],
	        data: languagesArray
	    }),
	    valueField: 'name',
	    displayField: 'displayText'
	})
	
	WordCreateForm = new Ext.FormPanel({
        labelAlign: 'top',
        bodyStyle:'padding:5px',
        width: 600,        
        items: [{
            layout:'column',
            border:false,
            items:[{
                columnWidth:0.5,
                layout: 'form',
                border:false,
                items: [originalField, originalLangField]
            },{
                columnWidth:0.5,
                layout: 'form',
                border:false,
                items: [translatedField, translatedLangField]
            }]
        }],
    buttons: [{
      text: LANG("WORD_ADD_FORM_SAVE_BUTTON"),
      handler: createNewWord
    },{
      text: LANG("WORD_ADD_FORM_CANCEL_BUTTON"),
      handler: function(){
        WordCreateWindow.hide();
      }
    }]
    });
	
	WordCreateWindow= new Ext.Window({
      id: 'WordCreateWindow',
      title: LANG("WORD_ADD_FORM_TITLE"),
      closable:true,
      width: 610,
      height: 250,
      plain:true,
      layout: 'fit',
	  modal: true,
      items: WordCreateForm
    });
		
	getAllWords();
});