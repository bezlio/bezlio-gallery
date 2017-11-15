SELECT 
	JO.JOBNUM AS JOBNUM,
	JO.OPDESC AS OPDESC,
	JO.STARTDATE AS STARTDATE,
	JO.DUEDATE AS ENDDATE
FROM JOBOPER AS JO WITH(NOLOCK)

--Other fields may be added here so that additional information can be added to the Gantt chart, however, additional changes would need to be made to the Bezl to ensure that they display appropriately.