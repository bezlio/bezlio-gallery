define(["./account.js"], function (account) {
 
    function OnDataChange (bezl) {
        if (bezl.data.Accounts && !bezl.vars.accountsProcessed) {
            bezl.vars.loading = false;

            // If there was a previously selected account in localStorage, grab a reference
            // so we can know whether to mark them as selected
            bezl.vars.selectedAccount = {};
            if (typeof(Storage) !== "undefined" && localStorage.getItem("selectedAccount")) {
                bezl.vars.selectedAccount = JSON.parse(localStorage.getItem("selectedAccount"));
            }

            // Perform additional processing on the returned data
            for (var i = 0; i < bezl.data.Accounts.length; i++) {
                // Add a Selected property to the account record
                if (bezl.data.Accounts[i].ID == bezl.vars.selectedAccount.ID) {
                    bezl.data.Accounts[i].Selected = true;
                } else {
                    bezl.data.Accounts[i].Selected = false;
                }

                // Create an AddressURL column with an encoded version of each Address
                // so that it can be part of a Google Maps AddressURL
                bezl.data.Accounts[i].AddressURL = encodeURI(bezl.data.Accounts[i].Address);

                // Determine the distance from the current location, if applicable
                if (bezl.data.Accounts[i].Geocode_Location) {
                    bezl.data.Accounts[i].Distance = CalcDistance(bezl.vars.currentLat
                                                                , bezl.vars.currentLng
                                                                , parseFloat(bezl.data.Accounts[i].Geocode_Location.split(',')[0].split(':')[1])
                                                                , parseFloat(bezl.data.Accounts[i].Geocode_Location.split(',')[1].split(':')[1]));
                }             

                bezl.data.Accounts[i].Contacts = [];

                // Date pipe has rounding issue, truncate at "T" to get correct Date
                bezl.data.Accounts[i].LastContact = (bezl.data.Accounts[i].LastContact || 'T').split("T")[0];
                bezl.data.Accounts[i].NextTaskDue = (bezl.data.Accounts[i].NextTaskDue || 'T').split('T')[0]
            };

            account.applyFilter(bezl);
            // Apply the existing sort if there is one
            if (bezl.vars.sortCol && bezl.vars.sort) {
                account.sort(bezl, bezl.vars.sortCol, bezl.vars.sort);
            }

            bezl.vars.accountsProcessed = true;
        }

        // If we got the account contacts back, merge those in
        if (bezl.data.Accounts && bezl.data.AccountContacts) {
            for (var i = 0; i < bezl.data.AccountContacts.length; i++) {
                for (var x = 0; x < bezl.data.Accounts.length; x++) {
                    if (bezl.data.AccountContacts[i].ID == bezl.data.Accounts[x].ID) {
                        bezl.data.Accounts[x].Contacts.push(bezl.data.AccountContacts[i]);
                    }
                }
            }
        }

        if (bezl.data.CRMCalls) {
            bezl.vars.loadingCallLog = false; 
        }

        if (typeof(Storage) !== "undefined" && localStorage.getItem("pendingNotes")) {
            bezl.vars.pendingNotes = JSON.parse(localStorage.getItem("pendingNotes"));
            var now = Date.now();

            bezl.vars.pendingNotes.forEach(n => {
                require([bezl.vars.config.baseJsUrl + '/' + bezl.vars.config.Platform + '/platform.js'], function(platform) {

                    if (bezl.data[n.id]) {
                        platform.onAddNoteResponse(bezl, n);
                        account.runQuery(bezl, 'CRMCalls');
                    } else if (!n.processed && now - n.lastAttempt > (bezl.vars.config.retryInterval * 1000) && n.retryCount <= bezl.vars.config.maxRetryCount) {
                        platform.submitNote(bezl, n);
                    }

                });

                if (n.success) {
                    bezl.vars.pendingNotes.splice(bezl.vars.pendingNotes.indexOf(n), 1);
                }
            });

            localStorage.setItem('pendingNotes', JSON.stringify(bezl.vars.pendingNotes));
        }
    }

    function CalcDistance(lat1, lon1, lat2, lon2, unit) {
        var radlat1 = Math.PI * lat1/180
        var radlat2 = Math.PI * lat2/180
        var theta = lon1-lon2
        var radtheta = Math.PI * theta/180
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist)
        dist = dist * 180/Math.PI
        dist = dist * 60 * 1.1515
        if (unit=="K") { dist = dist * 1.609344 }
        if (unit=="N") { dist = dist * 0.8684 }
        return Math.round(dist)
    }
  
    return {
        onDataChange: OnDataChange
    }
});
