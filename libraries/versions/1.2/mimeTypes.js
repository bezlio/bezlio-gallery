define(function () {
     function GetMimeTypeFromExtension (extension) {
        switch(extension) {
            case ".doc": return "application/msword"; break;
            case ".docx": return "application/msword"; break;
            case ".dot": return "application/msword"; break;
            case ".onetoc": return "application/onenote"; break;
            case ".onetoc2": return "application/onenote"; break;
            case ".onetmp": return "application/onenote"; break;
            case ".onepkg": return "application/onenote"; break;
            case ".pdf": return "application/pdf"; break;
            case ".ai": return "application/postscript"; break;
            case ".eps": return "application/postscript"; break;
            case ".ps": return "application/postscript"; break;
            case ".xls": return "application/vnd.ms-excel"; break;
            case ".xlm": return "application/vnd.ms-excel"; break;
            case ".xla": return "application/vnd.ms-excel"; break;
            case ".xlc": return "application/vnd.ms-excel"; break;
            case ".xlt": return "application/vnd.ms-excel"; break;
            case ".xlw": return "application/vnd.ms-excel"; break;
            case ".xlam": return "application/vnd.ms-excel.addin.macroenabled.12"; break;
            case ".xlsb": return "application/vnd.ms-excel.sheet.binary.macroenabled.12"; break;
            case ".xlsm": return "application/vnd.ms-excel.sheet.macroenabled.12"; break;
            case ".xltm": return "application/vnd.ms-excel.template.macroenabled.12"; break;
            case ".ppt": return "application/vnd.ms-powerpoint"; break;
            case ".pps": return "application/vnd.ms-powerpoint"; break;
            case ".pot": return "application/vnd.ms-powerpoint"; break;
            case ".ppam": return "application/vnd.ms-powerpoint.addin.macroenabled.12"; break;
            case ".pptm": return "application/vnd.ms-powerpoint.presentation.macroenabled.12"; break;
            case ".sldm": return "application/vnd.ms-powerpoint.slide.macroenabled.12"; break;
            case ".ppsm": return "application/vnd.ms-powerpoint.slideshow.macroenabled.12"; break;
            case ".potm": return "application/vnd.ms-powerpoint.template.macroenabled.12"; break;
            case ".mpp": return "application/vnd.ms-project"; break;
            case ".mpt": return "application/vnd.ms-project"; break;
            case ".docm": return "application/vnd.ms-word.document.macroenabled.12"; break;
            case ".dotm": return "application/vnd.ms-word.template.macroenabled.12"; break;
            case ".wps": return "application/vnd.ms-works"; break;
            case ".wks": return "application/vnd.ms-works"; break;
            case ".wcm": return "application/vnd.ms-works"; break;
            case ".wdb": return "application/vnd.ms-works"; break;
            case ".wpl": return "application/vnd.ms-wpl"; break;
            case ".xps": return "application/vnd.ms-xpsdocument"; break;
            case ".oxt": return "application/vnd.openofficeorg.extension"; break;
            case ".pptx": return "application/vnd.openxmlformats-officedocument.presentationml.presentation"; break;
            case ".sldx": return "application/vnd.openxmlformats-officedocument.presentationml.slide"; break;
            case ".ppsx": return "application/vnd.openxmlformats-officedocument.presentationml.slideshow"; break;
            case ".potx": return "application/vnd.openxmlformats-officedocument.presentationml.template"; break;
            case ".xlsx": return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"; break;
            case ".xltx": return "application/vnd.openxmlformats-officedocument.spreadsheetml.template"; break;
            case ".dotx": return "application/vnd.openxmlformats-officedocument.wordprocessingml.template"; break;
            case ".bmp": return "image/bmp"; break;
            case ".gif": return "image/gif"; break;
            case ".jpeg": return "image/jpeg"; break;
            case ".jpg": return "image/jpeg"; break;
            case ".jpe": return "image/jpeg"; break;
            case ".pict": return "image/pict"; break;
            case ".pic": return "image/pict"; break;
            case ".pct": return "image/pict"; break;
            case ".png": return "image/png"; break;
            case ".svg": return "image/svg+xml"; break;
            case ".svgz": return "image/svg+xml"; break;
            case ".tiff": return "image/tiff"; break;
            case ".tif": return "image/tiff"; break;
            case ".psd": return "image/vnd.adobe.photoshop"; break;
            case ".dwg": return "image/vnd.dwg"; break;
            case ".dxf": return "image/vnd.dxf"; break;
            case ".csv": return "text/csv"; break;
            case ".html": return "text/html"; break;
            case ".htm": return "text/html"; break;
            case ".txt": return "text/plain"; break;
            case ".text": return "text/plain"; break;
            default:
                return "application/octet-stream";
        }
     }

    return {
        getMimeTypeFromExtension: GetMimeTypeFromExtension,
    }

});
