define(function () {
 
    function RunReport (bezl, parm) {
        bezl.vars.reportLoading = true;
        bezl.vars.reportSelected = true;
        bezl.vars.selectedReport = parm;
        parm.Selected = true;

        for (var i = 0; i < bezl.data.ReportListing.length; i++) {
            if (bezl.data.ReportListing[i].Name != parm.Name) {
                bezl.data.ReportListing[i].Selected = false;
            }
        };

        var parametersRequired = false;
        if (parm.ReportDetails) {
            for (var i = 0; i < parm.ReportDetails.ParameterFields.length; i++) {
                if (parm.ReportDetails.ParameterFields[i].ReportName == ''
                        && parm.ReportDetails.ParameterFields[i].IsOptionalPrompt == false
                        && (parm.ReportDetails.ParameterFields[i].Value == null)) {
                    parametersRequired = true;
                
                    // Also take this time to structure the Value object according to the parameter
                    // type
                    if (parm.ReportDetails.ParameterFields[i].DiscreteOrRangeKind == 1 
                        && parm.ReportDetails.ParameterFields[i].EnableAllowMultipleValue) {
                        parm.ReportDetails.ParameterFields[i].Value = [{ StartValue: '', EndValue: '' }];
                    } else if (parm.ReportDetails.ParameterFields[i].DiscreteOrRangeKind == 1 
                        && !parm.ReportDetails.ParameterFields[i].EnableAllowMultipleValue) {
                        parm.ReportDetails.ParameterFields[i].Value = { StartValue: '', EndValue: '' };
                    } else if (parm.ReportDetails.ParameterFields[i].EnableAllowMultipleValue) {
                        parm.ReportDetails.ParameterFields[i].Value = [];
                    }
                }
            }
        }

        if (parametersRequired) {
            bezl.vars.promptForParameters = true;
        } else {
            bezl.vars.promptForParameters = false;
            bezl.dataService.add('Report','brdb','CrystalReports','ReturnAsPDF',
                { "FolderName": parm.FolderName, "Connection": "Workflow", "ReportName": parm.Name,
                "Parameters": [
                { "Key": "ReportDetails", "Value": JSON.stringify(parm.ReportDetails) }
                ] },0);
        }
    }

    function AddParameterValue (bezl, parm) {
        if (parm.ParameterValueType == 4 && parm.EnableAllowMultipleValue) {  	
            parm.Value.push(parm.AddValue); 
            parm.AddValue = "";
        } else if (parm.ParameterValueType == 4 && !parm.EnableAllowMultipleValue) {
        parm.Value = parm.AddValue;
        }
    }

    function Back(bezl) {
        bezl.vars.reportSelected=false;
        bezl.vars.selectedReport = { "ReportDetails" : { "ParameterFields" : [] } };
        bezl.vars.promptForParameters = false;
        bezl.vars.reportLoading = false;
        var viewer = $(bezl.container.nativeElement).find('#viewer')[0];
        viewer.src = 'about:blank';  
    }

    function RunQuery (bezl, queryName) {

        switch (queryName) {

            default:
                break;
        }
    }

    return {
        runQuery: RunQuery,
        runReport: RunReport,
        addParameterValue: AddParameterValue,
        back: Back
    }
});
