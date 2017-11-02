define(["./app.js"], function (app) {
    
     function OnStartup (bezl) {
   
       // Load up the summary data from the data source
       bezl.vars.loadingSummaryData = true;
       bezl.dataService.add('SummaryData',
                            'brdb',
                            bezl.vars.config.summaryPlugin,
                            bezl.vars.config.summaryMethod, 
                            bezl.vars.config.summaryArgs, 0);
   
     }
     
     return {
       onStartup: OnStartup
     }
   });