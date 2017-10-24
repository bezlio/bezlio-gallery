SELECT
	CallDesc AS ShortSummary
	, CallText AS Details
	, cl.LastDate AS CallDate
	, sr.Name AS SalesRepName
	, cl.RelatedToFile
	, ct.CallTypeDesc
	, cust.CustID AS ID
FROM 
	CRMCall cl with(nolock)

	LEFT OUTER JOIN SalesRep sr with(nolock) ON
	sr.Company = cl.Company
	AND sr.SalesRepCode = cl.SalesRepCode
	
	LEFT OUTER JOIN CallType ct with(nolock) ON
	ct.Company = cl.Company
	AND ct.CallTypeCode = cl.CallTypeCode
	
	INNER JOIN Customer cust with(nolock) ON
	cust.Company = cl.Company
	AND cust.CustNum = cl.CallCustNum
	
	INNER JOIN SaleAuth sra with(nolock) ON
	sra.Company = cust.Company
	AND sra.SalesRepCode = cust.SalesRepCode

	INNER JOIN UserFile u with(nolock) ON
	u.DcdUserID = sra.DcdUserID
	AND u.EMailAddress = '{EmailAddress}'
WHERE 
	DATEDIFF (day, cl.LastDate , GetDate()) < 90  
	--and cl.Company = 'YourCompanyID'  -- Set this to a specific company ID if you have more than one
ORDER BY
	cl.LastDate desc
	, cl.LastTime desc