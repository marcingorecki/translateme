var FROMLANG_KEY = "fromLang";
var TOLANG_KEY = "toLang";
var FROMLANG_MANUAL_KEY = "fromLangManual";
var TOLANG_MANUAL_KEY = "toLangManual";
var VERBOSE_KEY = "verbose";

//set defaults
var fromLang = "en";
var toLang = "pl";
var fromLangManual = "en";
var toLangManual = "pl";
var verbose=false;

//language mapping between google translate (used as main code in the extension and wikipedia
var langToWiki = {
"zh-CN":"zh",
"zh-TW":"zh-classical",
"iw":"he"
}

var langToWictionary = {
"zh-CN":"zh",
"zh-TW":"zh",
"ht":"en", //Haitian words are included in EN wiki
"iw":"he"
}

String.prototype.format = function() {
    var formatted = this;
    for(arg in arguments) {
        formatted = formatted.replace("{" + arg + "}", arguments[arg]);
    }
    return formatted;
};

var memorizedStates=[
	['0', "Just added (0)"],
	['1', "New to me (1)"],
	['2', "A bit (2)"],
	['3', "Something (3)"],
	['4', "Quite (4)"],
	['5', "Almost (5)"],
	['6', "Fully (6)"]
];

var languagesArray = [
["af","Afrikaans"],
["sq","Albanian"],
["ar","Arabic"],
["be","Belarusian"],
["bg","Bulgarian"],
["ca","Catalan"],
["zh-CN","Chinese Simplified"],
["zh-TW","Chinese Traditional"],
["hr","Croatian"],
["cs","Czech"],
["da","Danish"],
["nl","Dutch"],
["en","English"],
["et","Estonian"],
["tl","Filipino"],
["fi","Finnish"],
["fr","French"],
["gl","Galician"],
["de","German"],
["el","Greek"],
["ht","Haitian Creole"],
["iw","Hebrew"],
["hi","Hindi"],
["hu","Hungarian"],
["is","Icelandic"],
["id","Indonesian"],
["ga","Irish"],
["it","Italian"],
["ja","Japanese"],
["lv","Latvian"],
["lt","Lithuanian"],
["mk","Macedonian"],
["ms","Malay"],
["mt","Maltese"],
["no","Norwegian"],
["fa","Persian"],
["pl","Polish"],
["pt","Portuguese"],
["ro","Romanian"],
["ru","Russian"],
["sr","Serbian"],
["sk","Slovak"],
["sl","Slovenian"],
["es","Spanish"],
["sw","Swahili"],
["sv","Swedish"],
["th","Thai"],
["tr","Turkish"],
["uk","Ukrainian"],
["vi","Vietnamese"],
["cy","Welsh"],
["yi","Yiddish"]];


//initialize google analytics
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-21038528-1']);
  _gaq.push(['_trackPageview']);
  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

function initializeTaS(){
	//read stored data
	var storedFromLang = localStorage[FROMLANG_KEY];
	var storedToLang = localStorage[TOLANG_KEY];
	
	//translation in pop up
	if(localStorage[FROMLANG_MANUAL_KEY]){
		fromLangManual = localStorage[FROMLANG_MANUAL_KEY];
	}
	if(localStorage[TOLANG_MANUAL_KEY]){
		toLangManual = localStorage[TOLANG_MANUAL_KEY];	
	}
	
	if(storedFromLang) {
		fromLang=storedFromLang
	} else {
		showOptions();
	}
	if(storedToLang) toLang=storedToLang;
	
	//translation in main window
	if(!fromLangManual){
		fromLangManual = fromLang;
	}
	if(!toLangManual){
		toLangManual = toLang;
	}
	
	//debug
	if(localStorage[VERBOSE_KEY]=="1"){
		verbose=true;
	}
}

function log(message){
	if(verbose){
		console.log(message);
	}
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

//initalize
initializeTaS();