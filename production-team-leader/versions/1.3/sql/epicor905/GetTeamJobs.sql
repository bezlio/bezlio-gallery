SELECT
	op.JobNum + '.' + CAST(op.AssemblySeq AS VARCHAR) + '.' + CAST(op.OprSeq AS VARCHAR) AS JobID
	, op.JobNum
	, op.AssemblySeq
	, op.OprSeq
	, jh.PartDescription + ' - ' + op.OpDesc AS JobDesc
	, op.RunQty - op.QtyCompleted AS PendingQty
FROM
	JobOper op with(nolock)
	
	INNER JOIN JobHead jh with(nolock) ON
	jh.Company = op.Company
	AND jh.JobNum = op.JobNum
WHERE
	op.OpComplete = 0
	--AND op.Company = 'YourCompanyID'  -- Set this to a specific company ID if you have more than one
	AND jh.JobClosed = 0
	AND jh.JobComplete = 0
	AND jh.JobReleased = 1
	AND op.SubContract = 0
