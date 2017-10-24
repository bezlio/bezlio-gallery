define(function () {

    // This is all of the platform specific logic for this Bezl (Epicor 10 in this case)
    function AddNote(bezl) {
        bezl.vars.pendingNotes = [];
        if (typeof(Storage) !== "undefined" && localStorage.getItem("pendingNotes")) {
            bezl.vars.pendingNotes = JSON.parse(localStorage.getItem("pendingNotes"));
        }

        var now = Date.now();

        bezl.vars.pendingNotes.push({
            id: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                    return v.toString(16);
                }),
            company: bezl.vars.config.Company,
            custNum: bezl.vars.selectedAccount.CustNum,
            shortSummary: bezl.vars.shortSummary,
            details: bezl.vars.details,
            type: bezl.vars.type = '',
            salesRep: ((bezl.data.SalesRep.length > 0) ? bezl.data.SalesRep[0].SalesRepCode : bezl.vars.selectedAccount.SalesRep),
            processed: false,
            success: false,
            lastAttempt: now,
            retryCount: 0,
            result: ''
        });

        bezl.vars.pendingNotes.forEach(n => {
            if (!n.processed || 
                (now - n.lastAttempt > (bezl.vars.config.retryInterval * 1000) && n.retryCount <= bezl.vars.config.maxRetryCount)) {     
                SubmitNote(bezl, n);
            }
        });

        localStorage.setItem('pendingNotes', JSON.stringify(bezl.vars.pendingNotes));

        bezl.vars.shortSummary = '';
        bezl.vars.details = '';
        bezl.vars.type = '';
    }

    function SubmitNote(bezl, n) {
        require([bezl.vars.config.baseLibraryUrl + 'epicor/crm.js'], function(functions) {
            functions.addNote(bezl
                            , n.id
                            , bezl.vars.config.Platform
                            , bezl.vars.config.Company
                            , n.custNum
                            , n.shortSummary
                            , n.details
                            , n.type
                            , n.salesRep)

            n.lastAttempt = Date.now();

            if (n.processed) {
                n.retryCount++;
            }

            localStorage.setItem('pendingNotes', JSON.stringify(bezl.vars.pendingNotes));
        }); 
    }

    function OnAddNoteResponse(bezl, note) {
        if (bezl.data[note.id].BOUpdError && bezl.data[note.id].BOUpdError.length > 0) {
            bezl.notificationService.showCriticalError(JSON.stringify(bezl.data[note.id].BOUpdError));
            note.result = JSON.stringify(bezl.data[note.id].BOUpdError);
        } else {
            note.success = true;
        }

        bezl.data[note.id] = null;
        bezl.dataService.remove(note.id);
        note.processed = true;
        localStorage.setItem('pendingNotes', JSON.stringify(bezl.vars.pendingNotes));
    }

    return {
        addNote: AddNote,
        submitNote: SubmitNote,
        onAddNoteResponse: OnAddNoteResponse
    }
});
