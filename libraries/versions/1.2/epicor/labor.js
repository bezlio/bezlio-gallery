define(function () {
 
    /**
     * Clocks in one or many employees into MES.  Function simply creates BRDB call so monitor
     * for return in onDataChange.  The return presented there will return the LaborHed record
     * for each of the employees that were successfully clocked in.
     * @param {Object[]} bezl - A reference to the calling Bezl
     * @param {string} plugin - The plugin name (Epicor10, Epicor905)
     * @param {string} connection - The nammed connection as specified in Epicor905.dll.config
     * @param {string} company - The company ID within Epicor
     * @param {Object[]} employees - An array of employee IDs
     * @param {Number} shift - The shift number to clock all employees onto
     */
    function ClockIn (bezl
                    , plugin
                    , connection
                    , company
                    , employees
                    , shift) {
        bezl.dataService.add(
            'ClockIn'
            ,'brdb'
            ,plugin
            ,'Labor_ClockIn'
            , { 
                "Connection"    : connection,
                "Company"       : company,
                "EmployeeNum"   : employees,
                "Shift"         : shift
            },0);
    }

    /**
     * Clocks out one or many employees from MES.  Function simply creates BRDB call so monitor
     * for return in onDataChange.  The return presented there will be an array of EmployeeNum,
     * an Error column indicating whether there was an error, and ErrorText containing the errors
     * presented by the BO if an error did occur
     * @param {Object[]} bezl - A reference to the calling Bezl
     * @param {string} plugin - The plugin name (Epicor10, Epicor905)
     * @param {string} connection - The nammed connection as specified in Epicor905.dll.config
     * @param {string} company - The company ID within Epicor
     * @param {Object[]} employees - An array of employee IDs
     * @param {Number} shift - The shift number to clock all employees onto
     */
    function ClockOut (bezl
                    , plugin
                    , connection
                    , company
                    , employees) { 

        bezl.dataService.add(
            'ClockOut'
            ,'brdb'
            ,plugin
            ,'Labor_ClockOut'
            , { 
                "Connection"    : connection,
                "Company"       : company,
                "EmployeeNum"   : employees
            },0); 
    }

    /**
     * Start the provided job on the specified list of LaborHed numbers.  Function simply creates BRDB 
     * call so monitor for return in onDataChange.  The return presented there will be a dataset
     * of Labor records for the provided LaborHed numbers
     * @param {Object[]} bezl - A reference to the calling Bezl
     * @param {string} plugin - The plugin name (Epicor10, Epicor905)
     * @param {string} connection - The nammed connection as specified in Epicor905.dll.config
     * @param {string} company - The company ID within Epicor
     * @param {Object[]} laborHeds - An array of laborhed numbers
     * @param {Number} jobNum - The job number to clock onto
     * @param {Number} assemblySeq - The assembly sequence to clock onto
     * @param {Number} oprSeq - The operation sequence to clock onto
     * @param {Boolean} setup - Indicates this activity should be started for Setup
     */
    function StartJob (bezl
                    , plugin
                    , connection
                    , company
                    , laborHeds
                    , jobNum
                    , assemblySeq
                    , oprSeq
                    , setup) {
        bezl.dataService.add(
            'StartJob'
            ,'brdb'
            ,plugin
            ,'Labor_StartActivity'
            , { 
                'Connection'    : connection
                ,'Company'      : company
                ,'LaborHedSeq'  : laborHeds
                ,'JobNum'       : jobNum
                ,'JobAsm'       : assemblySeq
                ,'JobOp'        : oprSeq
                ,'Setup'        : setup
        },0);
    }

    /**
     * Ends all activities on the specified list of LaborHed numbers.  Function simply creates BRDB 
     * call so monitor for return in onDataChange.  The return presented there will be a dataset
     * of Labor records for the provided LaborHed numbers
     * @param {Object[]} bezl - A reference to the calling Bezl
     * @param {string} plugin - The plugin name (Epicor10, Epicor905)
     * @param {string} connection - The nammed connection as specified in Epicor905.dll.config
     * @param {string} company - The company ID within Epicor
     * @param {Object[]} laborDataSet - An array of the LaborDtl.  Only required property is LaborHedSeq
     */
    function EndActivities (bezl
                    , plugin
                    , connection
                    , company
                    , laborDataSet) {      
        bezl.dataService.add(
            'EndActivities'
            ,'brdb'
            ,plugin
            ,'Labor_EndActivities'
            , { 
                'Connection'    : connection
                ,'Company'      : company
                ,'LaborDataSet' : JSON.stringify(laborDataSet)
        },0);
    }
 
    return {
        clockIn: ClockIn,
        clockOut: ClockOut,
        endActivities: EndActivities,
        startJob: StartJob
    }
});