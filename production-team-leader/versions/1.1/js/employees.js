define(function () {
 
    function Select (bezl, employee) {        
        // Also update the actual team array
        var teamUpdated = false;
        for (var i = 0; i < bezl.vars.team.length; i++) {
            if (bezl.vars.team[i].key == employee.key) {
                teamUpdated = true;
                var $row = $("#jsGridTeam").jsGrid("rowByItem", bezl.vars.team[i]);

                if (bezl.vars.team[i].selected) {
                    bezl.vars.team[i].selected = false;
                    bezl.vars.employeesSelected -= 1;
                    $row.children('.jsgrid-cell').css('background-color','');
                } else {
                    bezl.vars.team[i].selected = true;
                    bezl.vars.employeesSelected += 1;
                    $row.children('.jsgrid-cell').css('background-color','#F7B64B');
                }
            }
        };

        // If the team was not updated, that means an employee was selected that this
        // not currently a part of the leaders team.  Prompt for confirmation they wish
        // to add this team member (which will pop them into the team array and run this
        // method again)
        if (!teamUpdated) {
            bezl.vars.addToTeamPrompt = true;
            bezl.vars.addToTeam = employee;
        }
    }

    function SelectAll (bezl) {        
        bezl.vars.employeesSelected = bezl.vars.team.length;
        for (var i = 0; i < bezl.vars.team.length; i++) {
            var $row = $("#jsGridTeam").jsGrid("rowByItem", bezl.vars.team[i]);
            bezl.vars.team[i].selected = true;
            $row.children('.jsgrid-cell').css('background-color','#F7B64B');
        };
    }

    function DeselectAll (bezl) {        
        bezl.vars.employeesSelected = 0;
        for (var i = 0; i < bezl.vars.team.length; i++) {
            var $row = $("#jsGridTeam").jsGrid("rowByItem", bezl.vars.team[i]);
            bezl.vars.team[i].selected = false;
            $row.children('.jsgrid-cell').css('background-color','');
        };
    }

    function AddToTeam (bezl, employee) {   
        // Add the selected employee to the team array    
        bezl.vars.team.push(employee);

        // Reload the grid to include this new team member
        $("#jsGridTeam").jsGrid("loadData");
        HighlightSelected(bezl);

        // Call the standard logic to select the newly added employee
        Select(bezl, employee);

        // Clear out variables used in support of the pop-up
        bezl.vars.addToTeamPrompt = false;
        bezl.vars.addToTeam = {};
        bezl.vars.selectedEmployee.Name = "";
    }

    function AddToTeamCancel (bezl) {   
        bezl.vars.addToTeamPrompt = false;
        bezl.vars.addToTeam = {};
        bezl.vars.selectedEmployee.Name = "";
    }

    function HighlightSelected (bezl) {
        // Re-highlight any employees that were previously selected on the team
        for (var i = 0; i < bezl.vars.team.length; i++) {
            var $row = $("#jsGridTeam").jsGrid("rowByItem", bezl.vars.team[i]);

            if (bezl.vars.team[i].selected) {
                $row.children('.jsgrid-cell').css('background-color','#F7B64B');
            } 
        };
    }

    function RunQuery (bezl, queryName) {

        switch (queryName) {
            case "Employees":
                // Pull in all of the employees for the search box
                bezl.dataService.add('Employees','brdb', bezl.vars.config.pluginInstance,'ExecuteQuery', { 
                    "QueryName": "GetEmployees",
                    "Parameters": [
                        { "Key": "EmailAddress", "Value": bezl.env.currentUser }
                    ] },0);
                    bezl.vars.loadingEmployees = true;
                break;
            case "OpenJobs":
                // Pull in all of the employees for the search box
                bezl.dataService.add('OpenJobs','brdb', bezl.vars.config.pluginInstance,'ExecuteQuery', { 
                    "QueryName": "GetTeamJobs",
                    "Parameters": [
                        { "Key": "EmailAddress", "Value": bezl.env.currentUser }
                    ] },0);
                    bezl.vars.loadingJobs = true;
                break;
            default:
                bezl.notificationService.showCriticalError('Unknown query ' + queryName);
                break;
        }
    }

    function ClockIn (bezl) {
        // Since this is going to be an API call as opposed to a straight
        // query, detect the platform (via what was specified on setConfig)
        // and route this request to the appropriate integration
        if (bezl.vars.config.Platform == "Epicor905" || bezl.vars.config.Platform == "Epicor10") {
            require([bezl.vars.config.baseLibraryUrl + 'epicor/labor.js'], function(labor) {

                var clockInEmployees = [];
                for (var i = 0; i < bezl.vars.team.length; i++) {
                    if (bezl.vars.team[i].selected && !bezl.vars.team[i].clockedIn) {
                        clockInEmployees.push(bezl.vars.team[i].key);
                    }
                }

                if (clockInEmployees.length > 0) {
                    labor.clockIn(bezl
                                , bezl.vars.config.Platform
                                , bezl.vars.config.Connection
                                , bezl.vars.config.Company
                                , clockInEmployees
                                , bezl.vars.shift);
                    bezl.vars.clockingIn = true;  
                } else {
                    bezl.notificationService.showCriticalError('No employees selected for clock in that were not already clocked in.');
                } 
            });
        }
    }

    function ClockOut (bezl) {        
        // Since this is going to be an API call as opposed to a straight
        // query, detect the platform (via what was specified on setConfig)
        // and route this request to the appropriate integration
        if (bezl.vars.config.Platform == "Epicor905" || bezl.vars.config.Platform == "Epicor10") {
            require([bezl.vars.config.baseLibraryUrl + 'epicor/labor.js'], function(labor) {
                
                var clockOutEmployees = [];
                for (var i = 0; i < bezl.vars.team.length; i++) {
                    if (bezl.vars.team[i].selected && bezl.vars.team[i].clockedIn) {
                        clockOutEmployees.push(bezl.vars.team[i].key);
                    }
                }

                labor.clockOut(bezl
                            , bezl.vars.config.Platform
                            , bezl.vars.config.Connection
                            , bezl.vars.config.Company
                            , clockOutEmployees);

                bezl.vars.clockingOut = true;  
            });
        }
    }

    function EndActivities (bezl) {        
        // Since this is going to be an API call as opposed to a straight
        // query, detect the platform (via what was specified on setConfig)
        // and route this request to the appropriate integration
        if (bezl.vars.config.Platform == "Epicor905" || bezl.vars.config.Platform == "Epicor10") {
                require([bezl.vars.config.baseLibraryUrl + 'epicor/labor.js'], function(labor) {
                    var ds = {'LaborDtl': [ ] };

                    for (var i = 0; i < bezl.vars.team.length; i++) {
                        if (bezl.vars.team[i].selected && bezl.vars.team[i].clockedIn) {
                            ds.LaborDtl.push(
                                {
                                'Company'           :   bezl.vars.config.Company
                                ,'LaborHedSeq'		: 	((bezl.vars.team[i].LaborHed) ? bezl.vars.team[i].LaborHed.LaborHedSeq : bezl.vars.team[i].laborId)
                                ,'LaborQty'	        :	(bezl.vars.team[i].completedQty || 0)
                                ,'SetupPctComplete'	:	(bezl.vars.team[i].setupPctComplete || 0)
                                }
                            );

                            // Clear out the completed qty
                            bezl.vars.team[i].completedQty = 0;
                            bezl.vars.team[i].pendingQtyTemp = 0;
                            bezl.vars.team[i].setupPctComplete = 0;
                        }
                    }                   

                    labor.endActivities(bezl
                                , bezl.vars.config.Platform
                                , bezl.vars.config.Connection
                                , bezl.vars.config.Company
                                , ds);

                    bezl.vars.endingActivities = true;
                });
        }

        bezl.vars.endActivitiesPrompt = false;
    }

    function EndActivitiesCancel (bezl) {        
        for (var i = 0; i < bezl.vars.team.length; i++) {
            bezl.vars.team[i].completedQty = 0;
        };

        bezl.vars.endActivitiesPrompt = false;
    }

    function EndActivitiesPrompt (bezl) {        
        for (var i = 0; i < bezl.vars.team.length; i++) {
        bezl.vars.team[i].pendingQtyTemp = bezl.vars.team[i].pendingQty;
        };

        bezl.vars.endActivitiesPrompt = true;
    }

    function StartJob (bezl, job, setup) {        
        // Since this is going to be an API call as opposed to a straight
        // query, detect the platform (via what was specified on setConfig)
        // and route this request to the appropriate integration
        if (bezl.vars.config.Platform == "Epicor905" || bezl.vars.config.Platform == "Epicor10") {
            require([bezl.vars.config.baseLibraryUrl + 'epicor/labor.js'], function(labor) {
                var laborHeds = [];
                for (var i = 0; i < bezl.vars.team.length; i++) {
                    if (bezl.vars.team[i].selected && bezl.vars.team[i].clockedIn) {
                        laborHeds.push(((bezl.vars.team[i].LaborHed) ? bezl.vars.team[i].LaborHed.LaborHedSeq : bezl.vars.team[i].laborId));

                        // Update the selected job variable to note whether they are doing a setup or production
                        if (setup) {
                            bezl.vars.selectedJob.laborType = 'S';
                        } else {
                            bezl.vars.selectedJob.laborType = 'P';
                        }
                    }
                }

                if (laborHeds.length > 0) {
                    labor.startJob(bezl
                                , bezl.vars.config.Platform
                                , bezl.vars.config.Connection
                                , bezl.vars.config.Company
                                , laborHeds
                                , job.data.JobNum
                                , job.data.AssemblySeq
                                , job.data.OprSeq
                                , setup);

                    bezl.vars.startingJob = true;
                } else {
                    bezl.notificationService.showCriticalError('No selected clocked in employees available to start this job.');
                }
            });
        }

        bezl.vars.showJobDialog = false;
    }

    function ValidateQuantities (bezl, quantityRow) {        
        // Clear out any past overrides or exceptions
        quantityRow.override = false;
        quantityRow.quantityException = false;
        bezl.vars.endActivitiesDisabled = false;

        // Determine the total quanty completed across all other employees on this activity
        var totalCompleted = 0;
        for (var i = 0; i < bezl.vars.team.length; i++) {
            if (bezl.vars.team[i].selected && bezl.vars.team[i].key != quantityRow.key && bezl.vars.team[i].currentActivity == quantityRow.currentActivity) {
            totalCompleted += (bezl.vars.team[i].completedQty || 0);
            }
        };

        // Recalculate the current rows pendingQtyTemp based on the input
        quantityRow.pendingQtyTemp = quantityRow.pendingQty - quantityRow.completedQty - totalCompleted;

        // Mark the row with an exception if pendingQtyTemp now went to negative
        if (quantityRow.pendingQtyTemp < 0 && quantityRow.completedQty > 0) {
        quantityRow.quantityException = true;
        bezl.vars.endActivitiesDisabled = true;
        }

        // Now update all of those other employees pendingQtyTemp
        for (var i = 0; i < bezl.vars.team.length; i++) {
            if (bezl.vars.team[i].selected && bezl.vars.team[i].key != quantityRow.key 
                && bezl.vars.team[i].currentActivity == quantityRow.currentActivity
                && !bezl.vars.team[i].completedQty) {
            bezl.vars.team[i].pendingQtyTemp = bezl.vars.team[i].pendingQty - totalCompleted - quantityRow.completedQty + (bezl.vars.team[i].completedQty || 0);
            }
        };
    }

    function OverrideQuantityException (bezl, quantityRow) {  
        quantityRow.override = true;
        bezl.vars.endActivitiesDisabled = false;
    }

    function OnTeamFilterChange (bezl) {  
        if (bezl.vars.team) { // Avoid throwing errors if the team data hasn't been returned yet  
        for (var i = 0; i < bezl.vars.team.length; i++) {
            if (bezl.vars.teamFilterString) { // Make sure we have something to filter on
            if (bezl.vars.team[i].display && bezl.vars.team[i].display.toUpperCase().indexOf(bezl.vars.teamFilterString.toUpperCase()) !== -1 ||
                bezl.vars.team[i].currentActivity && bezl.vars.team[i].currentActivity.toUpperCase().indexOf(bezl.vars.teamFilterString.toUpperCase()) !== -1 ||
                bezl.vars.team[i].department && bezl.vars.team[i].department.toUpperCase().indexOf(bezl.vars.teamFilterString.toUpperCase()) !== -1) {
                bezl.vars.team[i].show = true;
            } else {
                bezl.vars.team[i].show = false;
            }
            } else {
            bezl.vars.team[i].show = true;
            }
        };
        }

        $("#jsGridTeam").jsGrid("loadData");
        HighlightSelected(bezl);
    }

    function OnJobFilterChange (bezl) {  
        if (bezl.vars.openJobs) { // Avoid throwing errors if the account data hasn't been returned yet  
        for (var i = 0; i < bezl.vars.openJobs.length; i++) {
            if (bezl.vars.jobFilterString) { // Make sure we have something to filter on
            if (bezl.vars.openJobs[i].jobId && bezl.vars.openJobs[i].jobId.toUpperCase().indexOf(bezl.vars.jobFilterString.toUpperCase()) !== -1 ||
                bezl.vars.openJobs[i].jobDesc && bezl.vars.openJobs[i].jobDesc.toUpperCase().indexOf(bezl.vars.jobFilterString.toUpperCase()) !== -1) {
                bezl.vars.openJobs[i].show = true;
            } else {
                bezl.vars.openJobs[i].show = false;
            }
            } else {
            bezl.vars.openJobs[i].show = true;
            }
        };
        }

        $("#jsGridJobs").jsGrid("loadData");
    }
 
    return {
        select: Select,
        selectAll: SelectAll,
        deselectAll: DeselectAll,
        addToTeam: AddToTeam,
        addToTeamCancel: AddToTeamCancel,
        highlightSelected: HighlightSelected,
        runQuery: RunQuery,
        clockIn: ClockIn,
        clockOut: ClockOut,
        endActivities: EndActivities,
        endActivitiesCancel: EndActivitiesCancel,
        endActivitiesPrompt: EndActivitiesPrompt,
        startJob: StartJob,
        validateQuantities: ValidateQuantities,
        overrideQuantityException: OverrideQuantityException,
        onTeamFilterChange: OnTeamFilterChange,
        onJobFilterChange: OnJobFilterChange
    }
});
