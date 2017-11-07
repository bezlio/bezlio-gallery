SELECT
	e.Company AS Company
	, e.EmpID AS EmpID
	, e.Name AS Name
	, e.Shift AS Shift
	, lh.LaborHedSeq AS LaborHedSeq
	, lh.ClockInDate AS LaborHedDate
	, lh.ClockInTime AS LaborHedTime
	, ld.LaborDtlSeq AS LaborDtlSeq
	, ld.ClockInDate AS LaborDtlDate
	, ld.ClockinTime AS LaborDtlTime
	, ld.JobNum
	, ld.AssemblySeq
	, ld.OprSeq
	, ld.ResourceID
	, jh.PartNum
	, jh.PartDescription
	, jo.RunQty AS TotalQty
	, jo.QtyCompleted AS CompQty
	, (jo.RunQty - jo.QtyCompleted) AS DueQty
	, ld.IndirectCode
	, i.Description AS IndirectDescription
	, e.ResourceGrpID
FROM
	EmpBasic e with(nolock)

	LEFT OUTER JOIN LaborDtl ld with(nolock) ON
	ld.Company = e.Company
	AND ld.EmployeeNum = e.EmpID
	AND ld.ActiveTrans = 1

	LEFT OUTER JOIN JobHead jh with(nolock) ON 
	ld.Company = jh.Company 
	AND ld.JobNum = jh.JobNum

	LEFT OUTER JOIN JobOper jo with(nolock) ON 
	ld.Company = jo.Company
	AND ld.JobNum = jo.JobNum 
	AND ld.AssemblySeq = jo.AssemblySeq
	AND ld.OprSeq = jo.OprSeq

	LEFT OUTER JOIN LaborHed lh with(nolock) ON
	lh.Company = e.Company
	AND lh.EmployeeNum = e.EmpID
	AND lh.ActiveTrans = 1

	LEFT OUTER JOIN Indirect i with(nolock) ON
	i.Company = ld.Company
	AND i.IndirectCode = ld.IndirectCode
WHERE
	e.EmpStatus = 'A'