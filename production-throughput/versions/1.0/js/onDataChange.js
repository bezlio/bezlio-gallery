define(["./app.js"], function (app) {
    
    function OnDataChange (bezl) {
        if (bezl.data.SummaryData) {
            bezl.vars.loadingSummaryData = false;

            // Use D3 to group the data by location and store the result in a new
            // variable named summaryData
            bezl.vars.summaryData = d3.nest().key(function(d) { return d.Location; }).entries(bezl.data.SummaryData);

            // Maintain an alert flag at the location level if any work centers are not operating
            // at or above target percentage
            bezl.vars.summaryData.forEach(l => {
                l.warningCount = 0;
                l.values.forEach(wc => {
                    if (wc['Current Percentage'] < wc['Target Percentage']) {
                        l.warningCount++;
                    }
                });
                l.selected = l.warningCount > 0;
            });

            // Now dispose of bezl.data.SummaryData since we no longer need it
            bezl.data.SummaryData = null;
            bezl.dataService.remove('SummaryData');
        }
    }
    
    return {
        onDataChange: OnDataChange
    }
   });
   