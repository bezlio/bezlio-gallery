define(function () {

    function OnStartup(bezl) {
        bezl.vars.reportListingLoading = true;
        bezl.vars.reportSelected = false;
        bezl.functions.reportListing({ 'FolderName': '/reports/customreports', 'ReportName': '' });

        bezl.vars.currentPath = '/reports/customreports';
    }

    return {
        onStartup: OnStartup
    }
});