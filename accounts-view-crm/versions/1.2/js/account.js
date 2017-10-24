define(function () {
 
    function RunQuery (bezl, queryName) {

        switch (queryName) {
            case "Accounts":
                bezl.vars.loading = true; 
                bezl.vars.accountsProcessed = false;
                // Pull in the accounts list for the logged in user
                bezl.dataService.add('Accounts','brdb','sales-rep-queries','ExecuteQuery', { 
                    "QueryName": "GetAccounts",
                    "Parameters": [
                        { "Key": "EmailAddress", "Value": bezl.env.currentUser }
                    ] },0);
                break;
            case "CallTypes":
                bezl.dataService.add('CallTypes','brdb','sales-rep-queries','ExecuteQuery', { 
                    "QueryName": "GetCallTypes" 
                },0);
                break;
            case "CRMCalls":
                bezl.vars.loadingCallLog = true; 
                // Pull in the call list for just the currently selected account
                bezl.dataService.add('CRMCalls','brdb','sales-rep-queries','ExecuteQuery', { 
                    "QueryName": "GetAccountCallHistory",
                    "Parameters": [
                        { "Key": "ID", "Value": bezl.vars.selectedCustId }
                    ] },0);
                break;
            case "SalesRep":
                bezl.dataService.add('SalesRep','brdb','sales-rep-queries','ExecuteQuery', { 
                                            "QueryName": "GetSalesRep", 
                                            "Parameters": [
                                                { "Key": "EmailAddress", "Value": bezl.env.currentUser }
                                            ] 
                                        },0); 
                break;
            default:
                break;
        }
    }

    function Select(bezl, account) {
        // Mark the selected customer as selected
        for (var i = 0; i < bezl.data.Accounts.length; i++) {
            if (bezl.data.Accounts[i].ID == account.ID) {
                bezl.data.Accounts[i].Selected = !bezl.data.Accounts[i].Selected;

                if (bezl.data.Accounts[i].Selected) {
                    localStorage.setItem('selectedAccount', JSON.stringify(bezl.data.Accounts[i]));
                    $('#bezlpanel').trigger('selectAccount', [bezl.data.Accounts[i]]);
                    bezl.vars.selectedAccount = bezl.data.Accounts[i];
                } else {
                    localStorage.setItem('selectedAccount', '');
                    $('#bezlpanel').trigger('selectAccount', [{}]);
                }
                
            } else {
                bezl.data.Accounts[i].Selected = false;
            }
        };
    }

    function Sort(bezl, sortColumn, sortDirection = null) {

        // If the sort direction is passed we will use it, otherwise it will be calculated
        if (sortDirection !== null && (sortDirection == "asc" || sortDirection == "desc")) {
            bezl.vars.sort = sortDirection;
        } else {
            // If the previous sort column was picked, make it the opposite sort
            if (bezl.vars.sortCol == sortColumn) {
                if (bezl.vars.sort == "desc") {
                    bezl.vars.sort = "asc";
                } else {
                    bezl.vars.sort = "desc";
                }
            } else {
                bezl.vars.sort = "asc";
            }
        }
        
        // Store the sort column so the UI can reflect it
        bezl.vars.sortCol = sortColumn;


        // Test for numeric sort columns, otherwise sort alphabetic
        if (sortColumn == "Distance") {
            if (bezl.vars.sort == "asc") {
                bezl.data.Accounts.sort(function (a, b) {
                    var A = a[sortColumn] || Number.MAX_SAFE_INTEGER;
                    var B = b[sortColumn] || Number.MAX_SAFE_INTEGER;
                    return A - B;
                });
            } else {
                bezl.data.Accounts.sort(function (a, b) {
                    var A = a[sortColumn] || Number.MAX_SAFE_INTEGER;
                    var B = b[sortColumn] || Number.MAX_SAFE_INTEGER;
                    return B - A;
                });
            }
        } else if (sortColumn == "LastContact" || sortColumn == "NextTaskDue") {
            if (bezl.vars.sort == "asc") {
                bezl.data.Accounts.sort(function (a, b) {
                    var A = Date.parse(a[sortColumn]) || Number.MAX_SAFE_INTEGER;
                    var B = Date.parse(b[sortColumn]) || Number.MAX_SAFE_INTEGER;
                    return A - B;
                });
            } else {
                bezl.data.Accounts.sort(function (a, b) {
                    var A = Date.parse(a[sortColumn]) || Number.MAX_SAFE_INTEGER * -1;
                    var B = Date.parse(b[sortColumn]) || Number.MAX_SAFE_INTEGER * -1;
                    return B - A;
                });
            } 
        } else {
            if (bezl.vars.sort == "asc") { 
                bezl.data.Accounts.sort(function(a, b) {
                    var A = a[sortColumn] .toUpperCase(); // ignore upper and lowercase
                    var B = b[sortColumn] .toUpperCase(); // ignore upper and lowercase
                    if (A < B) {
                        return -1;
                    }
                    if (A > B) {
                        return 1;
                    }

                    // names must be equal
                    return 0;
                });
            } else {
                bezl.data.Accounts.sort(function(a, b) {
                    var A = a[sortColumn] .toUpperCase(); // ignore upper and lowercase
                    var B = b[sortColumn] .toUpperCase(); // ignore upper and lowercase
                    if (A > B) {
                        return -1;
                    }
                    if (A < B) {
                        return 1;
                    }

                    // names must be equal
                    return 0;
                });
            }
        }

    }

    // Only display accounts that have data matching the data string in the
    // filter input box. This function updates the "show" variable on the
    // account object.
    function ApplyFilter(bezl) {
        if (bezl.data.Accounts) { // Avoid throwing errors if the account data hasn't been returned yet
            for (var i = 0; i < bezl.data.Accounts.length; i++) {
                if (bezl.vars.filterString) { // Make sure we have something to filter on
                    if (bezl.data.Accounts[i].ID.toUpperCase().indexOf(bezl.vars.filterString.toUpperCase()) !== -1 ||
                    bezl.data.Accounts[i].Name.toUpperCase().indexOf(bezl.vars.filterString.toUpperCase()) !== -1 ||
                    bezl.data.Accounts[i].Territory.toUpperCase().indexOf(bezl.vars.filterString.toUpperCase()) !== -1 ||
                    bezl.data.Accounts[i].Address.toUpperCase().indexOf(bezl.vars.filterString.toUpperCase()) !== -1) {
                        bezl.data.Accounts[i].show = true;
                    } else {
                        bezl.data.Accounts[i].show = false;
                    }
                } else {
                    bezl.data.Accounts[i].show = true;
                }
            };
        }
    }

    function ClickAddress(bezl, account) {
        window.open('http://maps.google.com/maps?q=' + account.AddressURL, '_blank');
    }
  
    function ClickEmail(bezl, contact) {

    }

    function ClickPhoneNum(bezl, contact) {

    }

    function ClickCallLog(bezl, account) {
        bezl.vars.selectedCustomerName = account.Name;
        bezl.vars.selectedCustId = account.ID;
        bezl.vars.loadingCallLog = true;
        RunQuery(bezl, 'CRMCalls');
    }

    function AddNote(bezl) {
        require([bezl.vars.config.baseJsUrl + '/' + bezl.vars.config.Platform + '/platform.js'], function(platform) {
            platform.addNote(bezl);
        });
    }


    function DeleteFailedNote(bezl, note) {
        bezl.vars.pendingNotes.splice(bezl.vars.pendingNotes.indexOf(note), 1);
        localStorage.setItem('pendingNotes', JSON.stringify(bezl.vars.pendingNotes));
    }

    function RetryFailedNote(bezl, note) {
        require([bezl.vars.config.baseJsUrl + '/' + bezl.vars.config.Platform + '/platform.js'], function(platform) {
            platform.submitNote(bezl, note);
        });
    }    

    return {
        runQuery: RunQuery,
        select: Select,
        sort: Sort,
        applyFilter: ApplyFilter,
        clickAddress: ClickAddress,
        clickEmail: ClickEmail,
        clickPhoneNum: ClickPhoneNum,
        clickCallLog: ClickCallLog,
        addNote: AddNote,
        deleteFailedNote: DeleteFailedNote,
        retryFailedNote: RetryFailedNote
    }
});
