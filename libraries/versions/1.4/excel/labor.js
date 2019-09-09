define(function () {
 
    function ClockIn (bezl
                    , connection
                    , company
                    , employees
                    , shift) {
    }

    function ClockInResponse (bezl
                            , employees
                            , responseData) {

        return employees;
    }

    function ClockOut (bezl
                    , connection
                    , company
                    , employees) { 

    }

    function ClockOutResponse (bezl
                            , employees
                            , responseData) {

        return employees;
    }

    function EndActivities (bezl) {        

    }

    function StartJob (bezl
                    , connection
                    , company
                    , laborHeds
                    , jobNum
                    , assemblySeq
                    , oprSeq) {
    }

    function StartIndirect (bezl, indirect) {        

    }
 
    return {
        clockIn: ClockIn,
        clockInResponse: ClockInResponse,
        clockOut: ClockOut,
        clockOutResponse: ClockOutResponse,
        endActivities: EndActivities,
        startJob: StartJob,
        startIndirect: StartIndirect
    }
});