define(function () {
 
    /**
     * Clocks in an employee into VISUAL. This function expect the custom table BEZLIO_LABOR_HEAD
     * which is used to keep track of the overall attendance status of employees.
     * @param {Object[]} bezl - A reference to the calling Bezl
     * @param {string} employee - Employee ID to clock in
     * @param {string} laborHeadRowId - A unique labor head row ID to associate labor detail records with.  
     * @param {string} pluginInstance - BRDB plugin instance to use for write transaction
     */
    function ClockIn (bezl
                    , employee
                    , laborHeadRowId
                    , pluginInstance) {

        bezl.dataService.add('ClockIn_' + employee,'brdb', pluginInstance,'ExecuteNonQuery', { 
            "QueryName": "InsertLaborHead",
            "Parameters": [
                { "Key": "EmployeeID", "Value": employee },
                { "Key": "LaborHeadRowId", "Value": laborHeadRowId }
            ] },0);
    }

    /**
     * Clocks out an employee into VISUAL. This function expect the custom table BEZLIO_LABOR_HEAD
     * which is used to keep track of the overall attendance status of employees.
     * @param {Object[]} bezl - A reference to the calling Bezl
     * @param {string} employee - Employee ID to clock out
     * @param {string} pluginInstance - BRDB plugin instance to use for write transaction
     */
    function ClockOut (bezl
                    , employee
                    , pluginInstance) {

        bezl.dataService.add('ClockOut_' + employee,'brdb', pluginInstance,'ExecuteNonQuery', { 
            "QueryName": "UpdateLaborHead",
            "Parameters": [
                { "Key": "EmployeeID", "Value": employee }
            ] },0);
    }

    /**
     * Starts the provided job on the specified employee by creating a real labor ticket within VISUAL using the .Net objects
     * @param {Object[]} bezl - A reference to the calling Bezl
     * @param {string} connection - The connection name as defined in your Visual8.dll.config
     * @param {string} siteId - VISUAL site ID
     * @param {string} employee - Employee ID
     * @param {string} baseId - The work order base ID to clock onto
     * @param {string} lotId - The work order lot ID to clock onto
     * @param {string} splitId - The work order split ID to clock onto
     * @param {string} subId - The work order sub ID to clock onto
     * @param {Number} oprSeq - The operation sequence to clock onto
     * @param {Boolean} setup - Indicates this activity should be started for Setup
     * @param {string} description - Description
     * @param {datetime} clockIn - The clock in time to apply to the labor record
     */
    function StartJob (bezl
                    , connection
                    , siteId
                    , employee
                    , baseId
                    , lotId
                    , splitId
                    , subId
                    , oprSeq
                    , setup
                    , description
                    , clockIn) {
        
        var ds = { LABOR: [
            {
                TRANSACTION_TYPE: ((setup) ? "SETUP" : "RUN"),
                TRANSACTION_DATE: new Date(new Date().setHours(0, 0, 0, 0)),
                EMPLOYEE_ID: employee,
                CLOCK_IN: clockIn,
                SITE_ID: siteId,
                BASE_ID: baseId,
                LOT_ID: lotId,
                SPLIT_ID: splitId,
                SUB_ID: subId,
                SEQ_NO: oprSeq,
                START_IN_PROCESS_TICKET: true,
                DESCRIPTION: description
            }
        ] };
        
        bezl.dataService.add(
            'StartJob_' + employee
            ,'brdb'
            ,'Visual8'
            ,'ExecuteBOMethod'
            , { 
                "Connection"    : connection,
                "BOName"       :  "Lsa.Vmfg.ShopFloor.LaborTicket",
                "Parameters"   : [
                    { "Key": "Prepare", "Value": JSON.stringify({}) },
                    { "Key": ((setup) ? "NewSetupLaborRow" : "NewRunLaborRow"), "Value": JSON.stringify({ entryNo: 1}) },
                    { "Key": "MergeDataSet", "Value": JSON.stringify(ds) },
                    { "Key": "Save", "Value": JSON.stringify({}) }
                ]
            },0);
    } 

    /**
     * Updates an existing labor ticket using the Infor .Net opbjects
     * @param {Object[]} bezl - A reference to the calling Bezl
     * @param {string} connection - The connection name as defined in your Visual8.dll.config
     * @param {string} siteId - VISUAL site ID
     * @param {Number} laborId - Labor ticket transaction ID
     * @param {datetime} clockIn - The clock in time
     * @param {datetime} clockOut - The clock out time
     * @param {Number} hoursWorked - The total hours worked on this labor ticket
     * @param {Number} goodQty - The quantity completed
     * @param {Boolean} setupCompleted - Setup complete?
     * @param {string} description - Description
     */
    function UpdateLaborTicket (bezl
                            , connection
                            , siteId
                            , laborId
                            , clockIn
                            , clockOut
                            , hoursWorked
                            , goodQty
                            , setupCompleted
                            , description) {

        var ds = { EDIT_LABOR: [
            {
                CLOCK_IN_TIME: clockIn,
                CLOCK_OUT_time: clockOut,
                HOURS_WORKED: hoursWorked,
                GOOD_QTY: goodQty,
                SETUP_COMPLETED: setupCompleted,
                DESCRIPTION: description
            }
        ] };
        
        bezl.dataService.add(
            'EditLabor_' + laborId
            ,'brdb'
            ,'Visual8'
            ,'ExecuteBOMethod'
            , { 
                "Connection"    : connection,
                "BOName"       :  "Lsa.Vmfg.ShopFloor.EditLaborTicket",
                "Parameters"   : [
                    { "Key": "Prepare", "Value": JSON.stringify({}) },
                    { "Key": "NewEditLaborRow", "Value": JSON.stringify({ transactionId: laborId}) },
                    { "Key": "MergeDataSet", "Value": JSON.stringify(ds) },
                    { "Key": "Save", "Value": JSON.stringify({}) }
                ]
            },0);
    } 
 
    return {
        clockIn: ClockIn,
        clockOut: ClockOut,
        startJob: StartJob,
        updateLaborTicket: UpdateLaborTicket
    }
});