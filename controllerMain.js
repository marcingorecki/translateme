//init section
function init()
{
	google.language.getBranding('branding');
}
google.load("language", "1");
google.setOnLoadCallback(init);

//methods
function displayWaitingIcon(){	
	var area=$("#translated");
	var imgdiv=$("#loadingImg");
	pos=area.offset();
	
	imgdiv.css({ 
        'position': 'absolute',
        'top': pos.top + (area.outerHeight()-imgdiv.outerHeight())/2,
        'left': pos.left + (area.outerWidth()-imgdiv.outerWidth())/2
    }); 
	
	$("#loadingImg").show();
}

function hideWaitingIcon(){
	$("#loadingImg").hide();
}

function translateNow(){
	displayWaitingIcon();
	
	query=originalField.getValue();
	fromL=originalLangField.getValue();
	toL=translatedLangField.getValue();
	
	//store new values if required
	if(fromL!=fromLangManual){
		localStorage[FROMLANG_MANUAL_KEY] = fromL;
	}
	if(toL!=toLangManual){
		localStorage[TOLANG_MANUAL_KEY] = toL;
	}
	
	//translate and store results in db
	google.language.translate(query, fromL, toL, function(result){
			translatedField.setValue("");
			hideWaitingIcon();
			log(result);
			translatedField.setValue(result.translation);
			insertWord(query,result.translation,fromL,toL);
		}
	);
	log(originalLangField.getValue()+" ["+fromLang+"->"+toLang+"]");
	_gaq.push(['_trackEvent', 'Full Translate', 'mainTab']);
}

function readOriginal(){
	query=originalField.getValue().trim();
	lang=originalLangField.getValue();
	if(query.length>0){
		readItAloud(query, lang);
	}
}

function readTranslated(){
	query=translatedField.getValue().trim();
	lang=translatedLangField.getValue();
	if(query.length>0){
		readItAloud(query, lang);
	}
}

function swap(){
	tmp = originalLangField.getValue();
	originalLangField.setValue(translatedLangField.getValue());
	translatedLangField.setValue(tmp);
	localStorage[FROMLANG_MANUAL_KEY] = originalLangField.getValue();
	localStorage[TOLANG_MANUAL_KEY] = translatedLangField.getValue();
}

