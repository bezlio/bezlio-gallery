define(function () {
    function GetData(bezl, queryName) {
        switch (queryName) {
            case "SummaryData":
                bezl.vars.refreshing = true;
                bezl.dataService.add('SummaryData',
                    'brdb',
                    bezl.vars.config.summaryDataPlugin,
                    bezl.vars.config.summaryDataMethod, 
                    bezl.vars.config.summaryDataArgs, 0);  
                break;
        }
    }

    return {
        getData: GetData
    }
});
