define(function () {

    function OnStartup(bezl) {
        bezl.vars.reportListingLoading = true;
        bezl.vars.reportSelected = false;
        bezl.functions.reportListing({ 'FolderName': bezl.vars.startingPath, 'ReportName': '' });

        bezl.vars.currentPath = bezl.vars.startingPath;
    }

    return {
        onStartup: OnStartup
    }
});