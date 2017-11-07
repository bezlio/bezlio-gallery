SELECT
	m.JobNum + '.' + CAST(m.AssemblySeq AS VARCHAR) + '.' + CAST(m.MtlSeq AS VARCHAR) AS ID
	, m.JobNum
	, m.AssemblySeq
	, m.MtlSeq
	, m.PartNum
	, m.Description
	, m.RequiredQty
	, m.IUM
	, m.RelatedOperation
	, m.IssuedQty
	, m.Plant
FROM
	JobMtl m with (nolock)
WHERE
	m.JobNum = '{Job}'
	AND m.AssemblySeq = (CASE WHEN '{Asm}' = '' THEN m.AssemblySeq ELSE '{Asm}' END)
	AND m.RelatedOperation = (CASE WHEN '{Op}' = '' THEN m.RelatedOperation ELSE '{Op}' END)
	AND m.JobComplete = 0