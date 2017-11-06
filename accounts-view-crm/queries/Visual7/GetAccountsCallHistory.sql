SELECT
	'' AS ShortSummary
	, '' AS Details
	, '' AS CallDate
	, '' AS SalesRepName
	, '' AS RelatedToFile
	, '' AS CallTypeDesc
	, c.CustID AS ID
FROM 
    Erp.Customer c with(nolock)
WHERE 
	(1 <> 1)