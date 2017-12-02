define(function () {
    function ReportListing(bezl, parm) {
        bezl.vars.reportListingLoading = true;
        bezl.dataService.add('ReportListing', 'brdb', 'SSRS', 'GetReportList', {
            "FolderName": parm.FolderName,
            "ReportName": parm.ReportName
        });
    }

    function CheckParameters(bezl, parm) {
        if (parm.Type === "Report") {
            bezl.vars.nonParameterReportName = parm.Name;
            bezl.dataService.add('Parameters', 'brdb', 'SSRS', 'GetReportParameters', {
                "FolderName": bezl.vars.currentPath,
                "ReportName": parm.Name
            });
        } else {
            this.reportListing(bezl, { 'FolderName': bezl.vars.currentPath + '/' + parm.Name, 'ReportName': '' });
            bezl.vars.currentPath += '/' + parm.Name;
        }
    }

    function RunReport(bezl, parm) {
        if (parm.Type === "Report") {
            bezl.vars.selectedReport = parm;
            bezl.vars.reportLoading = true;
            bezl.vars.reportSelected = true;

            bezl.dataService.add('Report', 'brdb', 'SSRS', 'ReturnAsPDF', {
                "FolderName": bezl.vars.currentPath,
                "ReportName": parm.Name
            }, 0);
        } else {
            this.reportListing(bezl, { 'FolderName': bezl.vars.currentPath + '/' + parm.Name, 'ReportName': '' });
            bezl.vars.currentPath += '/' + parm.Name;
        }
    }

    function Back(bezl) {
        bezl.vars.reportSelected = false;
        bezl.vars.selectedReport = { "ReportDetails": { "ParameterFields": [] } };
        bezl.vars.promptForParameters = false;
        bezl.vars.reportLoading = false;
        var viewer = $(bezl.container.nativeElement).find('#viewer')[0];
        viewer.src = 'about:blank';
    }

    function DirectoryUp(bezl) {
        if (bezl.vars.currentPath.match(/[\/]/g).length > 1) {
            bezl.vars.currentPath = bezl.vars.currentPath.substring(0, bezl.vars.currentPath.lastIndexOf('/'));
            this.reportListing(bezl, { 'FolderName': bezl.vars.currentPath, 'ReportName': '' });
        } else {
            //no more places to go up
        }
    }

    return {
        reportListing: ReportListing,
        checkParameters: CheckParameters,
        runReport: RunReport,
        back: Back,
        directoryUp: DirectoryUp
    }
});