SELECT
	'' AS TaskDescription
	, '' AS StartDate
	, '' AS DueDate
	, '' AS TypeDescription
	, '' AS PercentComplete
	, '' AS PriorityCode
	, '' AS TaskID
	, '' AS TaskSeqNum
	, '' AS Complete
	, '' AS TaskType
	, '' AS RowMod
	, c.ID AS ID
	, c.ID AS CustNum
	, '' AS Company
	, '' AS SalesRepCode
FROM
	CUSTOMER c with(nolock)
WHERE
	(1<>1)