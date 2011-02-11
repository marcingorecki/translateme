function saveOptions(){
	localStorage[FROMLANG_KEY] = originalLangField.getValue();
	localStorage[TOLANG_KEY] = translatedLangField.getValue();
	localStorage[FROMLANG_MANUAL_KEY] = originalManualLangField.getValue();
	localStorage[TOLANG_MANUAL_KEY] = translatedManualLangField.getValue();
	//refresh settings
	initializeTaS();
	chrome.extension.getBackgroundPage().initializeTaS();
	Ext.MessageBox.alert(LANG("CONFIGURATION_SAVED_TITLE"),
			LANG("CONFIGURATION_SAVED_MESSAGE"), 
			function () {
				window.close();
			}
	)
}