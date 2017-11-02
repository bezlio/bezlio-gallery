define(["./app.js"], function (app) {
    
     function OnStartup (bezl) {
   
       // Load up the sales data from the data source
       app.getData(bezl, 'SummaryData');

       // Also start loading up the details data
       app.getData(bezl, 'ByProduct');
       app.getData(bezl, 'ByMonth');
     }
     
     return {
       onStartup: OnStartup
     }
   });