define(["./account.js"], function (account) {
 
    function OnDataChange (bezl) {
        if (bezl.data.Accounts) {
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

                // Set up any of the properties we wish to consolidate additional
                // data into from subsequent queries
                bezl.data.Accounts[i].Contacts = [];
                bezl.data.Accounts[i].CRMCalls = [];
                bezl.data.Accounts[i].Tasks = [];
                bezl.data.Accounts[i].Attachments = [];
                

                // Date pipe has rounding issue, truncate at "T" to get correct Date
                bezl.data.Accounts[i].LastContact = (bezl.data.Accounts[i].LastContact || 'T').split("T")[0];
                bezl.data.Accounts[i].NextTaskDue = (bezl.data.Accounts[i].NextTaskDue || 'T').split('T')[0]
            };

            account.applyFilter(bezl);
            // Apply the existing sort if there is one
            if (bezl.vars.sortCol && bezl.vars.sort) {
                account.sort(bezl, bezl.vars.sortCol, bezl.vars.sort);
            }
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

        // If we got the account tasks back, merge those in
        if (bezl.data.Accounts && bezl.data.Tasks) {
            for (var x = 0; x < bezl.data.Accounts.length; x++) {
                for (var i = 0; i < bezl.data.Tasks.length; i++) {
                    if (bezl.data.Tasks[i].ID == bezl.data.Accounts[x].ID) {
                        // Not sure if this is the best place to do this...
                        // Convert any ISO 8601 datetime strings to just date strings
                        bezl.data.Tasks[i].StartDate = (bezl.data.Tasks[i].StartDate || 'T').split('T')[0]
                        bezl.data.Tasks[i].DueDate = (bezl.data.Tasks[i].DueDate || 'T').split('T')[0]

                        bezl.data.Accounts[x].Tasks.push(bezl.data.Tasks[i]);
                    }
                }
            }
        }

        // If we got the account attachments back, merge those in
        if (bezl.data.Accounts && bezl.data.Attachments) {
            for (var x = 0; x < bezl.data.Accounts.length; x++) {
                for (var i = 0; i < bezl.data.Attachments.length; i++) {
                    if (bezl.data.Attachments[i].ID == bezl.data.Accounts[x].ID) {
                        bezl.data.Accounts[x].Attachments.push(bezl.data.Attachments[i]);
                    }
                }
            }
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
