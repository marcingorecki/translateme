var words = new Array();
var lastShow = 'all'; //all or notmemorized

function retrieveResults(tx, results){
  words = new Array();
  var len = results.rows.length;
  
  for (var i = 0; i < len; ++i) {
    var row = results.rows.item(i);
	words.push([row.id, row.original, row.translated, row.originalLang, row.translatedLang, row.addedOn, row.lastDisplayed, row.memorized]); 
  }
  WordsDataStore.loadData(words);  
}

function gridUpdated(gridEvent) {
	console.log(gridEvent);
	
	var id = gridEvent.record.data.id;	
	var field = gridEvent.field;
	var newValue = gridEvent.value;
	
	updateWord(id, field, newValue);
	WordsDataStore.commitChanges();
	_gaq.push(['_trackEvent', 'Grid', 'Updated']);
}

function showNotMemorized(){
	getNotMemorized();
	lastShow='notmemorized';
}

function showAll(){
	getAllWords();
	lastShow='all'
}

function removeWord(rowId){	
	id=WordsDataStore.getAt(rowId).data.id;
	console.log(id);
	console.log("Removing "+rowId+", deleting "+id);
	deleteWord(id);
	WordsDataStore.removeAt(rowId);
	_gaq.push(['_trackEvent', 'Grid', 'Word removed']);
}

function createNewWord(){
	console.log(originalField.getValue());
	if(isWordFormValid()){
		insertWord(originalField.getValue(), translatedField.getValue(), originalLangField.getValue(), translatedLangField.getValue());
		WordCreateWindow.hide();
		_gaq.push(['_trackEvent', 'Grid', 'New word created']);
		switch(lastShow){
			case 'all' : showAll(); break;
			case 'notmemorized' : showNotMemorized(); break;
			default : Ext.MessageBox.alert('Something went terribly wrong','They say "Don\'t drink and code". This message proves if right. '+
				'Should you see it, please notify the author quoting following error message: createNewWord case '+lastShow);
		}
    } else {
      Ext.MessageBox.alert('Warning','Please fill in all required data. Thank you.');
    }
}

function resetWordForm(){
    originalField.setValue('');
    originalLangField.setValue('');
    translatedField.setValue('');
    translatedLangField.setValue('');
  }
  
// check if the form is valid
function isWordFormValid(){
  return(originalField.isValid() && 
  	originalLangField.isValid() && 
  	translatedField.isValid() &&
  	translatedLangField.isValid());
  }
  
// display or bring forth the form
function displayWordFormWindow(){
  if(!WordCreateWindow.isVisible()){
    resetWordForm();
    WordCreateWindow.show();
  } else {
    WordCreateWindow.toFront();
  }
}

