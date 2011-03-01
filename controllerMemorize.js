STATES = {
	START: 'start',
	SHOWING_NEW_WORD :'showingNewWord',
	WAIT_FOR_SELF_ASSESSMENT :'waitForSelfAssessment',
	SELF_ASSESSMENT_DONE : 'selfAssessmentDone'
}

var currentWord=0;
var loops=0;
var currentState=STATES.START;
var wordsToMemorize=new Array();

var stats={
	initialWords : 0,
	totalAttempts : 0,
	fullyMemorized : new Array(),
	display : function(){
		display=LANG("STATISTICS_CONTENT").format(stats.initialWords,stats.totalAttempts);
		if(stats.fullyMemorized.length>0){
			display=display+LANG("STATISTICS_CONTENT_MEMORIZED").format(stats.fullyMemorized.length, stats.fullyMemorized.toString());
		}		
		return display;
			
	}
}

function switchButtons(state){
	switch (state) {
	case STATES.START :
	case STATES.SHOWING_NEW_WORD :
		buttonNote1.hide();
		buttonNote2.hide();
		buttonNote3.hide();
		buttonNote4.hide();
		buttonNote5.hide();
		buttonShowAnswer.show();
		translatedField.hide();
		buttonShowNextQuestion.hide();
		break;
	case STATES.WAIT_FOR_SELF_ASSESSMENT : 
		buttonNote1.show();
		buttonNote2.show();
		buttonNote3.show();
		buttonNote4.show();
		buttonNote5.show();
		buttonShowAnswer.hide();
		translatedField.show();
		buttonShowNextQuestion.hide();
		break;
	case STATES.SELF_ASSESSMENT_DONE :
		buttonNote1.hide();
		buttonNote2.hide();
		buttonNote3.hide();
		buttonNote4.hide();
		buttonNote5.hide();
		buttonShowAnswer.hide();
		translatedField.show();
		buttonShowNextQuestion.show();
		break;
	
	}
}

//callback from data Access
function retrieveToMemorize(tx, results){
  wordsToMemorize = new Array();
  var len = results.rows.length;
  
  for (var i = 0; i < len; ++i) {
    var row = results.rows.item(i);
	wordsToMemorize.push(row)
  }
  
  localStorage[SESSION_KEY]=JSON.stringify(wordsToMemorize);
  initMemorize();
}


function getWordsToMemorize(){
	//check if any words has been stored in localStorage for current session
	if(localStorage[SESSION_KEY] && localStorage[SESSION_KEY].length>2){
		var wordsJson=localStorage[SESSION_KEY];
		console.log('session continues ' + wordsJson);
		wordsToMemorize = JSON.parse(wordsJson);
		initMemorize();		
	} else {
		//call dataAccess method
		selectWordsToMemorize();	
	}
}

function initMemorize(){
	if(wordsToMemorize.length>0){
		currentWord=0;
		stats.initialWords=wordsToMemorize.length;
		memorize();
	} else {
		Ext.MessageBox.alert(LANG("NO_WORDS_TITLE"),
			LANG("NO_WORDS_MESSAGE"), 
			function () {}
		)
                noWordsForm.show();
	}
}

//main loop
function memorize(){
        memorizeForm.show();
        
	//rememeber current state
	localStorage[SESSION_KEY]=JSON.stringify(wordsToMemorize);
	
	//display next action
	switchButtons(currentState);
	switch (currentState) {
		case STATES.START:
		case STATES.SHOWING_NEW_WORD :
			showWord();
			break;
		case STATES.WAIT_FOR_SELF_ASSESSMENT:
			break;
		case STATES.SELF_ASSESSMENT_DONE:
			break;
	}
}

function showWord(){
	originalField.setValue(wordsToMemorize[currentWord].original);
	originalLangField.setValue(wordsToMemorize[currentWord].originalLang);
	translatedField.setValue(wordsToMemorize[currentWord].translated);
	translatedLangField.setValue(wordsToMemorize[currentWord].translatedLang);
}

function showNextQuestion(){    
	//are there any words left for this session?
	if(wordsToMemorize.length>0){
		stats.totalAttempts++;
		if (++currentWord >= wordsToMemorize.length) {
			//start with a first one
			currentWord=0;
                        loops++;
		}
                if(loops>=2){
                    _gaq.push(['_trackEvent', 'Memorize', 'finishAfterTwoLoops']);
                    finishSession();
                }else{
                    currentState = STATES.SHOWING_NEW_WORD;
                    memorize();
                }
	} else {
		//done for today!
		memorizeForm.hide();
                noWordsForm.show();
		
		Ext.MessageBox.alert(LANG("STATISTICS_TITLE"),stats.display())
	}

}

function showAnswer(){
        _gaq.push(['_trackEvent', 'Memorize', 'showAnswer']);
	currentState=STATES.WAIT_FOR_SELF_ASSESSMENT;
	memorize();
}

function memorize1(){ memorizeNote(1); }
function memorize2(){ memorizeNote(2); }
function memorize3(){ memorizeNote(3); }
function memorize4(){ memorizeNote(4); }
function memorize5(){ memorizeNote(5); }

function memorizeNote(note){

	//add fine remembered to be displayed in the summary
	if(note == 5){
		stats.fullyMemorized.push(wordsToMemorize[currentWord].translated); 	
	}

	//save history
	saveHistory(wordsToMemorize[currentWord].id, note);
	
	//update the database
	if(note == 5) {
		//if the word in DB already had 5, make it 6. otherwise store as 5
		if(wordsToMemorize[currentWord].memorized == 5){
			updateMemorized(wordsToMemorize[currentWord].id, 6);
		}else{
			updateMemorized(wordsToMemorize[currentWord].id, 5);
		}
	} else {
		updateMemorized(wordsToMemorize[currentWord].id, note);
	}
	
	if(note == 4 || note == 5){
		//remembered for today, remove from set
		wordsToMemorize.splice(currentWord,1);
	}

	currentState=STATES.SELF_ASSESSMENT_DONE;
	memorize();
};

function finishSession(){
    wordsToMemorize=new Array(); //remove all words from current session
    showNextQuestion();
    localStorage[SESSION_KEY]=JSON.stringify(wordsToMemorize);
}

function doneForNow(){
    _gaq.push(['_trackEvent', 'Memorize', 'doneForNow']);
    finishSession();
}

function removeFromLearning(){
    _gaq.push(['_trackEvent', 'Memorize', 'removeFromLearning']);
    updateMemorized(wordsToMemorize[currentWord].id, 6);
    wordsToMemorize.splice(currentWord,1);
    localStorage[SESSION_KEY]=JSON.stringify(wordsToMemorize);
    showNextQuestion();
}
