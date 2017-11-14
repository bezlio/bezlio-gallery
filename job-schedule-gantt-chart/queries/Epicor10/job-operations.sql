select 
	JobOper.JobNum as JobNum,
	JobOper.OpDesc as OpDesc,
	JobOper.StartDate as StartDate,
	JobOper.DueDate as EndDate
from Erp.JobOper as JobOper

--Other fields may be added here so that additional information can be added to the Gantt chart, however, additional changes would need to be made to the Bezl to ensure that they display appropriately.