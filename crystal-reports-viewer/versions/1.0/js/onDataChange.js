define(function () {
 
    function OnDataChange (bezl) {
        if (bezl.data.ReportListing) {
            bezl.vars.reportListingLoading = false;
        }

        if (bezl.data.Report) { 
            var sliceSize = 1024;
            var byteCharacters = atob(bezl.data.Report);
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

            var file = new Blob(byteArrays, {type: 'application/pdf'});     
            var fileURL = URL.createObjectURL(file);
            var viewer = $(bezl.container.nativeElement).find('#viewer')[0];
            viewer.src = fileURL;  
            bezl.vars.reportLoading = false;
        }
    }
  
    return {
        onDataChange: OnDataChange
    }
});