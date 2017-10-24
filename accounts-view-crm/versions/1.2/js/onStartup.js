define(["./account.js"], function (account) {
 
    function OnStartup (bezl) {        
        bezl.vars.filterString = ""

        // Initiate the call to refresh the customer list
        account.runQuery(bezl, 'Accounts');
        account.runQuery(bezl, 'AccountContacts');
        account.runQuery(bezl, 'CallTypes');
        account.runQuery(bezl, 'SalesRep');

        // Determine the current position of the user
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) { 
              bezl.vars.currentLat = position.coords.latitude;
              bezl.vars.currentLng = position.coords.longitude;
            });
        }

        bezl.vars.pendingNotes = [];
        if (typeof(Storage) !== "undefined" && localStorage.getItem("pendingNotes")) {
            bezl.vars.pendingNotes = JSON.parse(localStorage.getItem("pendingNotes"));
        }
    }
  
  return {
    onStartup: OnStartup
  }
});
