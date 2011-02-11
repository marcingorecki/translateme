function init()
{
	google.language.getBranding('branding');
}
google.load("language", "1");
google.setOnLoadCallback(init);
	
initializeTaS();
	
var query = "";

function showNotification(title, text){
	if (window.webkitNotifications) {
	  var notification = webkitNotifications.createNotification(
		  "Translation.png",
		  title,
		  text
	  );
	  notification.show();
   } else {
	//notifications not available, use old alert() method
	alert(title+" - "+text);
   }
}

function translationNotification(queryN,fromN,toN,resultN){
	var noficationTitle=queryN + " ("+fromN+"->"+toN+")";
	var noficationText=resultN.translation;
  
	showNotification(noficationTitle, noficationText);
	insertWord(queryN,resultN.translation,fromN,toN);
}

//display results in notification window
function displayTranslation(result) {
	translationNotification(query,fromLang,toLang,result);
}

//translate selected text directly on translate.google.com. This gives more results that the API search
function onClickSelectionFull(info, tab) {
	query=info["selectionText"];
	var url="http://translate.google.com/#"+fromLang+"|"+toLang+"|"+escape(query);
	window.open(url);
	_gaq.push(['_trackEvent', 'Full Translate', 'clicked']);
}

//translate selected text using google translate api
function onClickSelection(info, tab) {

  query=info["selectionText"];  
  google.language.translate(query, fromLang, toLang, displayTranslation);
  _gaq.push(['_trackEvent', 'Translate Selection', 'clicked']);
}

function detectAndTranslate(info, tab) {
	originaltext = info["selectionText"];
	google.language.detect(originaltext, function(result){
		//if language is not detected use default one
		if(result.language){
			detectedLang=result.language;
		} else {
			detectedLang=fromLang;
		}
		google.language.translate(originaltext, detectedLang, toLang, function(result) {  
			  translationNotification(query,detectedLang,toLang,result);
			});
	});	
	_gaq.push(['_trackEvent', 'Translate Detected', 'clicked']);
}

//detect Language and read it aloud!
function onClickSpeakSelection(info, tab){
	_gaq.push(['_trackEvent', 'Speak selection', 'clicked']);
	originaltext = info["selectionText"];
	
	if(originaltext.length>100){
		showNotification("Text too long","Text too read will be truncated to 100 characters");
		originaltext=originaltext.substring(0,99);
	}
	
	google.language.detect(originaltext, function(result){
		if(result.language){
			detectedLang=result.language;
		} else {
			detectedLang=fromLang;
		}
		
		readItAloud(originaltext,detectedLang);
	});	
}

//detect Language and show on wikipedia
function onClickShowOnWiki(info, tab){
	_gaq.push(['_trackEvent', 'ShowOnWikipedia', 'clicked']);
	originaltext = info["selectionText"];
	
	
	google.language.detect(originaltext, function(result){
		if(result.language){
			detectedLang=result.language;
		} else {
			detectedLang=fromLang;
		}
		
		//check if remapping is required
		if(langToWiki[detectedLang]){
			detectedLang=langToWiki[detectedLang];
		}
		
		var url="http://"+detectedLang+".wikipedia.org/wiki/"+originaltext.toLowerCase();
		window.open(url);
	});	
}

//detect Language and show on wiktionary
function onClickShowOnWiktionary(info, tab){
	_gaq.push(['_trackEvent', 'ShowOnWiktionary', 'clicked']);
	originaltext = info["selectionText"];
	
	
	google.language.detect(originaltext, function(result){
		if(result.language){
			detectedLang=result.language;
		} else {
			detectedLang=fromLang;
		}
		
		//check if remapping is required
		if(langToWiki[detectedLang]){
			detectedLang=langToWictionary[detectedLang];
		}
		
		var url="http://"+detectedLang+".wiktionary.org/wiki/"+originaltext.toLowerCase();
		window.open(url);
	});	
}

//show extension options
function showOptions() {
	chrome.tabs.create({'url': 'options.html'}, null)
}

chrome.contextMenus.create({"title": "Translate", "contexts":["selection"], "onclick": onClickSelection});
chrome.contextMenus.create({"title": "Translate (Detect Language)", "contexts":["selection"], "onclick": detectAndTranslate});
chrome.contextMenus.create({"title": "Full Translation", "contexts":["selection"], "onclick": onClickSelectionFull});
chrome.contextMenus.create({"title": "Speak!", "contexts":["selection"], "onclick": onClickSpeakSelection});
chrome.contextMenus.create({"type": "separator", "contexts":["selection"]});
chrome.contextMenus.create({"title": "Show on Wikipedia", "contexts":["selection"], "onclick": onClickShowOnWiki});
chrome.contextMenus.create({"title": "Show on Wiktionary", "contexts":["selection"], "onclick": onClickShowOnWiktionary});
chrome.contextMenus.create({"type": "separator", "contexts":["selection"]});
chrome.contextMenus.create({"title": "Options", "contexts":["selection"], "onclick": showOptions});

chrome.contextMenus.create({"title": "TranslateMe Options", "contexts":["page"], "onclick": showOptions});
