function LANG(string, args) {
	if(chrome.i18n){
		return chrome.i18n.getMessage(string, args);
	} else {
		//im run outside an extension
		return string;
	}
}