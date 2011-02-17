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
	["af",LANG("LANG_af")],
	["sq",LANG("LANG_sq")],
	["ar",LANG("LANG_ar")],
	["be",LANG("LANG_be")],
	["bg",LANG("LANG_bg")],
	["ca",LANG("LANG_ca")],
	["zh-CN",LANG("LANG_zh_CN")],
	["zh-TW",LANG("LANG_zh_TW")],
	["hr",LANG("LANG_hr")],
	["cs",LANG("LANG_cs")],
	["da",LANG("LANG_da")],
	["nl",LANG("LANG_nl")],
	["en",LANG("LANG_en")],
	["et",LANG("LANG_et")],
	["tl",LANG("LANG_tl")],
	["fi",LANG("LANG_fi")],
	["fr",LANG("LANG_fr")],
	["gl",LANG("LANG_gl")],
	["de",LANG("LANG_de")],
	["el",LANG("LANG_el")],
	["ht",LANG("LANG_ht")],
	["iw",LANG("LANG_iw")],
	["hi",LANG("LANG_hi")],
	["hu",LANG("LANG_hu")],
	["is",LANG("LANG_is")],
	["id",LANG("LANG_id")],
	["ga",LANG("LANG_ga")],
	["it",LANG("LANG_it")],
	["ja",LANG("LANG_ja")],
	["lv",LANG("LANG_lv")],
	["lt",LANG("LANG_lt")],
	["mk",LANG("LANG_mk")],
	["ms",LANG("LANG_ms")],
	["mt",LANG("LANG_mt")],
	["no",LANG("LANG_no")],
	["fa",LANG("LANG_fa")],
	["pl",LANG("LANG_pl")],
	["pt",LANG("LANG_pt")],
	["ro",LANG("LANG_ro")],
	["ru",LANG("LANG_ru")],
	["sr",LANG("LANG_sr")],
	["sk",LANG("LANG_sk")],
	["sl",LANG("LANG_sl")],
	["es",LANG("LANG_es")],
	["sw",LANG("LANG_sw")],
	["sv",LANG("LANG_sv")],
	["th",LANG("LANG_th")],
	["tr",LANG("LANG_tr")],
	["uk",LANG("LANG_uk")],
	["vi",LANG("LANG_vi")],
	["cy",LANG("LANG_cy")],
	["yi",LANG("LANG_yi")]
];


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

//initalize
initializeTaS();