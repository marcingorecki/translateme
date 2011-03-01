var db;

function initDB(){

  var doc;
  if(chrome.extension){
    doc=chrome.extension.getBackgroundPage();
  }else{
	doc=window;
  }
  if(doc.db!=undefined){
      db=doc.db;
  }else{
      db = doc.openDatabase(
        'TranslateMeTutor', // dbName
        '1.0',            // version
        'TranslateMe DB for search history',  // description
        5 * 1024 * 1024,  // estimatedSize in bytes
        function(db) {}   // optional creationCallback
      );
  }
  db.transaction(function(tx) {
  	//tx.executeSql('DROP TABLE words');
    tx.executeSql('CREATE TABLE IF NOT EXISTS ' +
      'words(id INTEGER PRIMARY KEY ASC, original TEXT, translated TEXT, originalLang TEXT, translatedLang TEXT, addedOn INTEGER, lastDisplayed INTEGER, memorized INTEGER)');
	tx.executeSql('CREATE TABLE IF NOT EXISTS ' +
      'history(id INTEGER PRIMARY KEY ASC, id_word INTEGER, note INTEGER, addedOn INTEGER)');
  },errorCallback);
}

function saveHistory(id_word, note){
  db.transaction(function(tx) {
    tx.executeSql('INSERT INTO history(id_word, note, addedOn) values (?,?,?)',
      [id_word, note, new Date().getTime()]);
  },errorCallback);
}

function updateMemorized(id_word, memorized){
  db.transaction(function(tx) {
    tx.executeSql('UPDATE words set memorized=?, lastDisplayed=? where id=?',
      [memorized, new Date().getTime(), id_word]);
  },errorCallback);
}

function insertWord(original, translated, originalLang, translatedLang ){
  db.transaction(function(tx) {
    tx.executeSql('INSERT INTO words(original, translated, originalLang, translatedLang, addedOn, lastDisplayed, memorized) values (?,?,?,?,?,?,?)',
      [original, translated, originalLang, translatedLang, new Date().getTime(), new Date().getTime(), 0]);
  },errorCallback);
}

function updateWord(id, field, newValue){
	console.log("updateWord "+id+", "+field+", "+newValue);
	db.transaction(function(tx) {
		field=escape(field);
		tx.executeSql('UPDATE words set '+field+'=? where id=?',[newValue,id]);
	},errorCallback);
}

function getAllWords() {
  db.readTransaction(function(tx) {
    tx.executeSql("SELECT * from words", [], retrieveResults );
  },errorCallback);
}

function getNotMemorized() {
  db.readTransaction(function(tx) {
    tx.executeSql('SELECT * from words where memorized<?', [6], retrieveResults );
  },errorCallback);
}

function deleteWord(id){
	db.transaction(function(tx) {
		tx.executeSql('DELETE FROM words where id=?',[id]);
	},errorCallback);
}


/*
 * where strftime('%s',datetime('now'))-(addedOn/1000)>360 - where there is more than 360s difference between now and time added. AddedOn is stored in miliseconds, 
 * calculations are done in seconds 
 * 
 * intervals for memorized:
 * 0 - always
 * 1 - 3 hours 3*60*60
 * 2 - 24 hours 24*60*60
 * 3 - 48 hours 48*60*60
 * 4 - 7 days 7*24*60*60
 * 5 - 14 days 14*24*60*60
 * 6 - never
 * 
 * Due to chromium issue 63975 (not authorized to use function: random) we will retrieve all data from DB and shuffle them in memory. Yuck :( 
 * http://groups.google.com/a/chromium.org/group/chromium-bugs/browse_thread/thread/12541d2d12a6ca2e?fwc=1
 * 
 */

function selectWordsToMemorize(){
  db.readTransaction(function(tx) {
    tx.executeSql("SELECT * from words where memorized=0 "+
		"or (memorized=1 and (strftime('%s',datetime('now'))-(lastDisplayed/1000))> 3*60*60) " +
		"or (memorized=2 and (strftime('%s',datetime('now'))-(lastDisplayed/1000))> 24*60*60) " +
		"or (memorized=3 and (strftime('%s',datetime('now'))-(lastDisplayed/1000))> 48*60*60) " +
		"or (memorized=4 and (strftime('%s',datetime('now'))-(lastDisplayed/1000))> 7*24*60*60) " +
		"or (memorized=5 and (strftime('%s',datetime('now'))-(lastDisplayed/1000))> 14*24*60*60) limit 15", [], retrieveToMemorize );
  },errorCallback);
}

function selectWordsCount(callbackFn){
  db.readTransaction(function(tx) {
    tx.executeSql("SELECT count(*) as count from words where memorized=0 "+
		"or (memorized=1 and (strftime('%s',datetime('now'))-(lastDisplayed/1000))> 3*60*60) " +
		"or (memorized=2 and (strftime('%s',datetime('now'))-(lastDisplayed/1000))> 24*60*60) " +
		"or (memorized=3 and (strftime('%s',datetime('now'))-(lastDisplayed/1000))> 48*60*60) " +
		"or (memorized=4 and (strftime('%s',datetime('now'))-(lastDisplayed/1000))> 7*24*60*60) " +
		"or (memorized=5 and (strftime('%s',datetime('now'))-(lastDisplayed/1000))> 14*24*60*60) ", [], callbackFn );
  },errorCallback);
}

function errorCallback(error){
	console.log(error);
	Ext.MessageBox.alert(error);
}

initDB();
