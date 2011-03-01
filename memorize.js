var wordsToMemorize=new Array();

var memorizeForm;
var memorizeCreateWindow;

var originalField;
var translatedField;
var originalLangField;
var translatedLangField;

var buttonNote1;
var buttonNote2;
var buttonNote3;
var buttonNote4;
var buttonNote5;
var buttonDone;
var buttonForget;
var buttonShowAnswer;
var buttonShowNextQuestion;

Ext.onReady(function(){
	Ext.QuickTips.init();
	createFormButtons();
	
	originalField = new Ext.form.TextField({
    	id: 'original',
    	fieldLabel: LANG("ORIGINAL_FIELD_TITLE") ,
    	maxLength: 200,
    	allowBlank: false,
		readOnly: true,
    	anchor : '95%',
    	maskRe: /([a-zA-Z0-9\s]+)$/
	});
	
	translatedField = new Ext.form.TextField({
    	id: 'translated',
    	fieldLabel: LANG("TRANSLATED_FIELD_TITLE"),
    	maxLength: 200,
    	allowBlank: false,
    	anchor : '95%',
		readOnly: true,
		hidden: true,		
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
		readOnly: true,
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
		readOnly: true,
	    store: new Ext.data.ArrayStore({
	        id: 0,
	        fields: ['name','displayText'],
	        data: languagesArray
	    }),
	    valueField: 'name',
	    displayField: 'displayText'
	})
	
	buttonForget = new Ext.Button({
		width:110,
		text: LANG("BUTTON_REMOVE"),
		handler: removeFromLearning
	});

	buttonDone = new Ext.Button({
		width:110,
		text: LANG("BUTTON_DONE_TODAY"),
		handler: doneForNow
	});
	
	memorizeForm = new Ext.FormPanel({
            labelAlign: 'top',
            bodyStyle:'padding:5px',
            width: 770,                    
            items: [{
                layout:'column',
                border:false,
                items:[{
                    columnWidth:0.42,
                    layout: 'form',
                    border:false,
                    items: [originalLangField, originalField]
                },{
                    columnWidth:0.42,
                    layout: 'form',
                    border:false,
                    items: [translatedLangField, translatedField]
                },{
                                    columnWidth:0.16,
                    layout: 'form',
                    border: false,
                    items: [buttonForget, new Ext.Spacer({height:3}), buttonDone]
                            }]
            }],
            buttons: [
                    buttonShowAnswer,
                    buttonShowNextQuestion,
                    buttonNote1, buttonNote2, buttonNote3, buttonNote4, buttonNote5
            ],
            buttonAlign:'left'
        });

        instructionForm = new Ext.FormPanel({
            labelAlign: 'top',
            bodyStyle:'padding:5px',
            width: 770,
                    //title: LANG("MEMORIZE_FORM_TITLE"),
            items: [{
                xtype:'box',
                border:true,
                id:'instruction',
                style:'font-size:12px; color:#333; padding:5px;',
                fieldLabel:LANG("MEMORIZE_INSTRUCTION_TITLE"),
                cls:'memorizeInstruction',
                html:LANG("MEMORIZE_INSTRUCTION_HTML")
            }]
        });

        noWordsForm = new Ext.FormPanel({
            labelAlign: 'top',
            bodyStyle:'padding:5px',
            width: 770,
            items: [{
                xtype:'box',
                border:true,
                id:'nowords',
                fieldLabel:LANG("NOWORDS_TITLE"),
                cls:'memorizeInstruction',
                html:LANG("NOWORDS_HTML")
            }]
        });

        noWordsForm.render('noWordsDiv');
        noWordsForm.hide();
	memorizeForm.render('memorizeDiv');
        memorizeForm.hide();
        instructionForm.render('instructionDiv');
        
        resetIcon();
        getWordsToMemorize();
});

function createFormButtons(){
	buttonShowAnswer = new Ext.Button({text: LANG("BUTTON_SHOW_ANSWER"), handler: showAnswer});
	buttonShowNextQuestion = new Ext.Button({text: LANG("BUTTON_SHOW_NEXT"), handler: showNextQuestion});
	buttonNote1 = new Ext.Button({text: memorizedStates[1][1], handler: memorize1, width: 45});
	buttonNote2 = new Ext.Button({text: memorizedStates[2][1], handler: memorize2, width: 45});
	buttonNote3 = new Ext.Button({text: memorizedStates[3][1], handler: memorize3, width: 45});
	buttonNote4 = new Ext.Button({text: memorizedStates[4][1], handler: memorize4, width: 45});
	buttonNote5 = new Ext.Button({text: memorizedStates[5][1], handler: memorize5, width: 45});	
}

