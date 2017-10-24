INSERT INTO BEZLIO_LABOR_HEAD
           (ROWID
		   ,EMPLOYEE_ID
           ,CLOCK_IN_STAMP
           ,ACTIVE_TRANS)
     VALUES
           ('{LaborHeadRowId}'
		   ,'{EmployeeID}'
           , GETDATE()
           , 1)