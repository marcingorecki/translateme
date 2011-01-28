
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
if(storedToLang) fromTo=storedToLang;
	
var query = "";

//display results in notification window
function displayTranslation(result) {
  
  var noficationTitle=query + " ("+fromLang+"->"+toLang+")";
  var noficationText=result.translation;
  
  if (window.webkitNotifications) {
	  var notification = webkitNotifications.createNotification(
		  "Translation.png",
		  noficationTitle,
		  noficationText
	  );
	  notification.show();
   } else {
	//notifications not available, use old alert() method
	alert(noficationTitle+" - "+noficationText);
   }
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

//show extension options
function showOptions() {
	chrome.tabs.create({'url': 'options.html'}, null)
}

chrome.contextMenus.create({"title": "Translate", "contexts":["selection"], "onclick": onClickSelection});
chrome.contextMenus.create({"title": "Full Translation", "contexts":["selection"], "onclick": onClickSelectionFull});
chrome.contextMenus.create({"title": "Options", "contexts":["selection"], "onclick": showOptions});
chrome.contextMenus.create({"title": "TranslateMe Options", "contexts":["page"], "onclick": showOptions});
