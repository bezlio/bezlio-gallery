define(["./account.js"], function (account) {
 
    function OnStartup (bezl) {        
        bezl.vars.filterString = ""

        // Initiate the call to refresh the customer list
        account.runQuery(bezl, 'Accounts');
        account.runQuery(bezl, 'AccountContacts');
        //account.runQuery(bezl, 'CRMCalls');
        account.runQuery(bezl, 'Tasks');
        account.runQuery(bezl, 'Attachments');

        // Determine the current position of the user
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) { 
              bezl.vars.currentLat = position.coords.latitude;
              bezl.vars.currentLng = position.coords.longitude;
            });
        }

        // Listen for new/updated tasks from the Task panel. The "Next Task
        // Due" value for an account might have possibly changed.
        $("#bezlpanel").on("updateTask", function(event, param1) {
            for (var i = 0; i < bezl.data.Accounts.length; i++) {
                if (bezl.data.Accounts[i].ID == param1.ID) {
                    //bezl.data.Accounts[i].Tasks = param1.Tasks // Doesn't seem to be necessary

                    var nextTaskDue = "";
                    for (var j = 0; j < bezl.data.Accounts[i].Tasks.length; j++) {
                        if (bezl.data.Accounts[i].Tasks[j].Complete == false) {
                            if (nextTaskDue == "") {
                                nextTaskDue = bezl.data.Accounts[i].Tasks[j].DueDate;
                            } else {
                                if (bezl.data.Accounts[i].Tasks[j].DueDate < nextTaskDue) {
                                    nextTaskDue = bezl.data.Accounts[i].Tasks[j].DueDate;
                                }
                            }
                        }
                    }

                    bezl.data.Accounts[i].NextTaskDue = nextTaskDue;
                }
            }
        });
    }
  
  return {
    onStartup: OnStartup
  }
});
