define(["./employees.js"], function (employees) {
 
    function OnStartup (bezl) {
        // Default the number of selected employees on the team grid to 0
        bezl.vars.employeesSelected = 0;

        // Default the openJobs object so we do not get any errors when the jsGrid loadData
        // is run (which includes a filter)
        bezl.vars.openJobs = [];
        
        // Initiate the queries to run up front
        employees.runQuery(bezl, 'Employees');
        employees.runQuery(bezl, 'OpenJobs');

        // Configure the team members jsGrid
        $("#jsGridTeam").jsGrid({
        width: "100%",
        height: "100%",
        heading: true,
        sorting: true,
        autoload: true, 	
        inserting: false,
        controller: {
            loadData: function() {
                return bezl.vars.team.filter(t => t.show == true);
            }
        },
        fields: [
            { name: "display", title: "Name", type: "text", visible: true, width: 50, editing: false },
            { name: "clockedIn", title: "Clocked In", align: "center", width: 25,
            	itemTemplate: function(value, item) {
              	return $("<input>").attr("type", "checkbox")
                		.attr("checked", value || item.Checked)
                    .on("change", function() {
                    	item.Checked = $(this).is(":checked");
                    });
              }
            },
            { name: "currentActivity", title: "Current Activity", type: "text", visible: true, width: 50, editing: false },
            { name: "shift", title: "Shift", type: "text", visible: true, width: 10, editing: false },
            { name: "department", title: "Department", type: "text", visible: true, width: 50, editing: false }
        ],
        rowClick: function(args) {
            employees.select(bezl, args.item);
        }
        });
    
        // Configure the team members jsGrid
        $("#jsGridJobs").jsGrid({
        width: "600",
        height: "400",
        heading: true,
        sorting: true,
        autoload: true, 	
        inserting: false,
        controller: {
            loadData: function() {
                return bezl.vars.openJobs.filter(j => j.show == true);
            }
        },
        fields: [
            { name: "jobId", title: "Job", type: "text", visible: true, width: 25, editing: false },
            { name: "jobDesc", title: "Description", type: "text", visible: true, width: 50, editing: false },
            { name: "pendingQty", title: "Pending Qty", type: "number", visible: true, width: 50, editing: false }
        ],
        rowClick: function(args) {
            bezl.vars.selectedJob = args.item;

            // Highlight the selected row in jsGrid
            if ( bezl.vars.selectedRow ) { bezl.vars.selectedRow.children('.jsgrid-cell').css('background-color', ''); }
            var $row = this.rowByItem(args.item);
            $row.children('.jsgrid-cell').css('background-color','#F7B64B');
            bezl.vars.selectedRow = $row;
        }
        });
    
    }
  
 
  return {
    onStartup: OnStartup
  }
});