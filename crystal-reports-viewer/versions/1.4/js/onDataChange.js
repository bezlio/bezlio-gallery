define(["./report.js"], function (report) {
 
    function OnDataChange (bezl) {
        if (bezl.data.ReportListing) {
            bezl.vars.reportListingLoading = false;
        }

        if (bezl.data.Report) { 
            var pdfData = atob(bezl.data.Report);
            // Clean up data subscription as we no longer need it
            bezl.dataService.remove('Report');
            bezl.data.Report = null;

            require.config({
              paths: {'pdfjs-dist': 'https://npmcdn.com/pdfjs-dist@2.0.943'}
            });
            require(['pdfjs-dist/build/pdf'], function (PDFJS) {

                // Using DocumentInitParameters object to load binary data.
                var loadingTask = PDFJS.getDocument({data: pdfData});
                loadingTask.promise.then(function(pdfDoc_) {

                    bezl.vars.pdfDoc = pdfDoc_;
                    bezl.vars.pageNum = 1;
                    bezl.vars.pageRendering = false;
                    bezl.vars.pageNumPending = null;
                    bezl.vars.scale = "auto";
                    bezl.vars.canvas = document.getElementById('viewer');
                    bezl.vars.ctx = bezl.vars.canvas.getContext('2d');
                    bezl.vars.totalPages = bezl.vars.pdfDoc.numPages;

                    // Initial/first page rendering
                    bezl.vars.renderPage(bezl.vars.pageNum);    
                    
                    // Wire up controls to functions for PDF viewer
                    document.getElementById('next').addEventListener('click', bezl.vars.onNextPage);
                    document.getElementById('previous').addEventListener('click', bezl.vars.onPrevPage);

                }, function (reason) {
                    // PDF loading error
                    console.error(reason);
                });

            });

            bezl.vars.reportLoading = false;
        }

        if (bezl.data.SaveReport) {
            var sliceSize = 1024;
            var byteCharacters = atob(bezl.data.SaveReport);
            var bytesLength = byteCharacters.length;
            var slicesCount = Math.ceil(bytesLength / sliceSize);
            var byteArrays = new Array(slicesCount);
            for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
                var begin = sliceIndex * sliceSize;
                var end = Math.min(begin + sliceSize, bytesLength);
                var bytes = new Array(end - begin);
                for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
                    bytes[i] = byteCharacters[offset].charCodeAt(0);
                }
                byteArrays[sliceIndex] = new Uint8Array(bytes);
            }

            var mimeType = "application/octet-stream"; // Sane default
            require([bezl.vars.config.baseLibraryUrl + 'mimeTypes.js'], function(mime) {
                mimeType = mime.getMimeTypeFromExtension(bezl.vars.saveAsFileExtension);

                var file = new Blob(byteArrays, {type: mimeType});
                saveAs(file, bezl.vars.selectedReport.BaseName + bezl.vars.saveAsFileExtension);

                bezl.vars.reportLoading = false;

                // Clean up data subscription as we no longer need it
                bezl.dataService.remove('SaveReport');
                bezl.data.SaveReport = null;
            });
        }
    }
  
    return {
        onDataChange: OnDataChange
    }
});
