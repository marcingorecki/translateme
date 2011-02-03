
//set defaults
var fromLang = "en";
var toLang = "pl";


function init()
{
	google.language.getBranding('branding');
}
google.load("language", "1");
google.setOnLoadCallback(init);


	
//read stored data
var storedFromLang = localStorage[FROMLANG_KEY];
var storedToLang = localStorage[TOLANG_KEY];
if(storedFromLang) {
	fromLang=storedFromLang
} else {
	showOptions();
}
if(storedToLang) toLang=storedToLang;
	
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

//display results in notification window
function displayTranslation(result) {
  
  var noficationTitle=query + " ("+fromLang+"->"+toLang+")";
  var noficationText=result.translation;
  
  showNotification(noficationTitle, noficationText);
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
		google.language.translate(originaltext, fromLang, toLang, displayTranslation);
	});	
	_gaq.push(['_trackEvent', 'Translate Detected', 'clicked']);
}

//read text aloud
function readItAloud(text, lang) {
	xhr=new XMLHttpRequest();
	xhr.onreadystatechange  = function(){ 
		 if(xhr.readyState  == 4) {
			if(xhr.status  == 200) {
				var encoded=BinaryBase64.encodeBinary(xhr.responseText);
				var src="data:audio/mp3;base64,"+encoded;
				var audio=new Audio();
				audio.src=src;
				audio.play();
			} else {
				 alert("Audio data can't be retrieved, Error:"+xhr.status);
			}
		 }
	}; 
	xhr.overrideMimeType('text/plain; charset=x-user-defined');
	url="http://translate.google.com/translate_tts?tl="+lang+"&q="+text;
	xhr.open("GET", url,  true); 
	xhr.send(null);
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


//show extension options
function showOptions() {
	chrome.tabs.create({'url': 'options.html'}, null)
}

chrome.contextMenus.create({"title": "Translate", "contexts":["selection"], "onclick": onClickSelection});
chrome.contextMenus.create({"title": "Translate (Detect Language)", "contexts":["selection"], "onclick": detectAndTranslate});
chrome.contextMenus.create({"title": "Full Translation", "contexts":["selection"], "onclick": onClickSelectionFull});
chrome.contextMenus.create({"title": "Speak!", "contexts":["selection"], "onclick": onClickSpeakSelection});
chrome.contextMenus.create({"title": "Options", "contexts":["selection"], "onclick": showOptions});

chrome.contextMenus.create({"title": "TranslateMe Options", "contexts":["page"], "onclick": showOptions});
