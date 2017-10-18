define(function () {
 
  function OnStartup (bezl) {        
    bezl.vars.reportListingLoading = true;

    // Define PDF viewer functions
    bezl.vars.renderPage = function(num) {
        bezl.vars.pageRendering = true;
        // Using promise to fetch the page
        bezl.vars.pdfDoc.getPage(num).then(function(page) {

            var viewport = page.getViewport(bezl.vars.scale);

            if (bezl.vars.scale == "auto") {
                bezl.vars.canvas.style.width='100%';
                bezl.vars.canvas.width  = bezl.vars.canvas.offsetWidth;
                viewport = page.getViewport(bezl.vars.canvas.width / page.getViewport(1.0).width);
            } else {
                bezl.vars.canvas.style.width=null;
            }
            
            bezl.vars.canvas.height = viewport.height;
            bezl.vars.canvas.width = viewport.width;

            // Render PDF page into canvas context
            var renderContext = {
                canvasContext: bezl.vars.ctx,
                viewport: viewport
            };
            var renderTask = page.render(renderContext);

            // Wait for rendering to finish
            renderTask.promise.then(function() {
                bezl.vars.pageRendering = false;
                if (bezl.vars.pageNumPending !== null) {
                    // New page rendering is pending
                    bezl.vars.renderPage(bezl.vars.pageNumPending);
                    bezl.vars.pageNumPending = null;
                }
            });
        });                        
    }

    bezl.vars.queueRenderPage = function (num) {
        if (bezl.vars.pageRendering) {
            bezl.vars.pageNumPending = num;
        } else {
            bezl.vars.renderPage(num);
        }
    };

    bezl.vars.onNextPage = function () {
        if (bezl.vars.pageNum >= bezl.vars.pdfDoc.numPages) {
            return;
        }
        bezl.vars.pageNum++;
        bezl.vars.queueRenderPage(bezl.vars.pageNum);
    };

    bezl.vars.onPrevPage = function() {
        if (bezl.vars.pageNum <= 1) {
            return;
        }
        bezl.vars.pageNum--;
        bezl.vars.queueRenderPage(bezl.vars.pageNum);
    }
  }
  
  return {
    onStartup: OnStartup
  }
});