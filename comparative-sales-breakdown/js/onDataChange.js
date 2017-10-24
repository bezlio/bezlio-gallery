define(["./app.js"], function (app) {
    
    function OnDataChange (bezl) {
        if (bezl.data.SummaryData) {
            bezl.vars.loadingSummaryData = false;
            // This variable is used to prorate previous YTD numbers on the details window
            bezl.vars.currYearPercent = bezl.data.SummaryData[0]['Portion Of Year'];
        }

        if (bezl.data.ByProduct) {
            bezl.vars.loadingByProduct = false;

            // Fix up the column headers since they cannot come through on the pivor table
            bezl.data.ByProduct.forEach(p => {
                p.Product = p.Column1 || p['Column 1'];
                p.YTDSales = p.Column3 || p['Column 3'];
                p.PriorSales = p.Column2 || p['Column 2'];
            });
        }

        if (bezl.data.ByMonth) {
            bezl.vars.loadingByMonth = false;

            // Fix up the column headers since they cannot come through on the pivor table
            bezl.data.ByMonth.forEach(m => {
                m.Month = m.Column1 || m['Column 1'];
                m.Sales = m.Column3 || m['Column 3'];
                m.PriorYear = m.Column2 || m['Column 2'];
            });
        }
    }
     
    return {
        onDataChange: OnDataChange
    }
   });
   