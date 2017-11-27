define(function () {

    function OnDataChange(bezl) {
        if (bezl.data.ReportListing) {
            bezl.vars.reportListingLoading = false;
        }

        if (bezl.data.Parameters) {
            if (bezl.data.Parameters.length === 0) {
                bezl.functions.runReport({ "Type": "Report", "Name": bezl.vars.nonParameterReportName });
            } else { }

            bezl.dataService.remove("Parameters");
        }

        if (bezl.data.Report) {
            bezl.vars.reportLoading = false;

            var sliceSize = 1024;
            var byteCharacters = atob(bezl.data.Report);

            var iFrame = $(bezl.container.nativeElement).find('#viewer')[0];
            iFrame = iFrame.contentWindow || (iFrame.contentDocument.document || iFrame.contentDocument);

            iFrame.document.open();
            iFrame.document.write(byteCharacters);
            iFrame.close();
        }
    }

    return {
        onDataChange: OnDataChange
    }
});