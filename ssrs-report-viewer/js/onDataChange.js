define(function () {

    function OnDataChange(bezl) {
        if (bezl.data.ReportListing) {
            bezl.vars.reportListingLoading = false;
        }

        if (bezl.data.Parameters) {
            console.log("Length: " + bezl.data.Parameters.length);
            console.log("Report Name:" + bezl.vars.nonParameterReportName);

            if (bezl.data.Parameters.length === 0) {
                bezl.functions.runReport({ "Type": "Report", "Name": bezl.vars.nonParameterReportName });
            } else {

            }

            bezl.dataService.remove("Parameters");
        }

        if (bezl.data.Report) {
            bezl.vars.reportLoading = false;
            //console.log(bezl.data.Report);

            //var data = btoa(bezl.data.Report);

            var sliceSize = 1024;
            var byteCharacters = atob(bezl.data.Report);
            //console.log(byteCharacters);

            //$(bezl.container.nativeElement).find('#viewer')[0].innerHtml = byteCharacters;

            var iFrame = $(bezl.container.nativeElement).find('#viewer')[0];
            iFrame = iFrame.contentWindow || (iFrame.contentDocument.document || iFrame.contentDocument);

            iFrame.document.open();
            iFrame.document.write(byteCharacters);
            iFrame.close();

            // var iframe = document.getElementById('iframeID');
            // iframe = iframe.contentWindow || ( iframe.contentDocument.document || iframe.contentDocument);

            // iframe.document.open();
            // iframe.document.write('Hello World!');
            // iframe.document.close();

            // var bytesLength = byteCharacters.length;
            // var sliceCount = Math.ceil(bytesLength / sliceSize);
            // var byteArrays = new Array(sliceCount);

            // for (var sliceIndex = 0; sliceIndex < sliceCount; sliceIndex++) {
            //     var begin = sliceIndex * sliceSize;
            //     var end = Math.min(begin + sliceSize, bytesLength);
            //     var bytes = new Array(end - begin);

            //     for (var offset = begin, i = 0; offset < end; i++ , ++offset) {
            //         bytes[i] = byteCharacters[offset].charCodeAt(0);
            //     }
            //     byteArrays[sliceIndex] = new Uint8Array(bytes);
            // }

            // var file = new Blob(byteArrays, { type: 'application/pdf' });
            // var fileURL = URL.createObjectURL(file);
            // var viewer = $(bezl.container.nativeElement).find('#viewer')[0];
            // viewer.src = fileURL;
            // bezl.vars.reportLoading = false;
        }
    }

    return {
        onDataChange: OnDataChange
    }
});