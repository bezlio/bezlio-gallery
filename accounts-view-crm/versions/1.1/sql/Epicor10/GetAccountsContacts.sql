SELECT
	c.CustID AS ID
	, case when c.PrimPCon = ct.ConNum then 'True' else NULL end as primaryContactPurchase
	, c.CustNum
	, ct.Name AS ContactName
	, ct.EMailAddress
	, ct.ContactTitle
	, ct.PhoneNum
	, ct.ConNum
	,ct.Twitter
	,ct.FaceBook
	,ct.LinkedIn
FROM 
	Erp.CustCnt ct with(nolock)
	
	INNER JOIN Erp.Customer c with(nolock) ON
	c.Company = ct.Company
	AND c.CustNum = ct.CustNum
	
	INNER JOIN Erp.SaleAuth sra with(nolock) ON
	sra.Company = c.Company
	AND sra.SalesRepCode = c.SalesRepCode

	INNER JOIN Erp.UserFile u with(nolock) ON
	u.DcdUserID = sra.DcdUserID
	AND u.EMailAddress = '{EmailAddress}'
WHERE
	c.ZIP <> ''
	--AND c.Company = 'YourCompanyID'  -- Set this to a specific company ID if you have more than one