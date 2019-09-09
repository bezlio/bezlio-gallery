define(function () {
     function AddNote (bezl) {
        bezl.vars.addingHistory = true;
    }

    return {
        addNote: AddNote
    }
});