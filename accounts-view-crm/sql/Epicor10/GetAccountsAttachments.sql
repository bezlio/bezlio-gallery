SELECT TOP 100
	f.XFileName AS FileName
	, f.XFileDesc AS Description
	, LOWER(RIGHT(XFileName, 4)) AS FileExt
	, cust.CustID AS ID
FROM
	Ice.XFileAttch fa with(nolock)
	
	INNER JOIN Ice.XFileRef f with(nolock) ON
	f.Company = fa.Company
	AND f.XFileRefNum = fa.XFileRefNum
	
	INNER JOIN Erp.Customer cust with(nolock) ON
	cust.Company = fa.Company
	AND cust.CustNum = fa.Key1
	
	INNER JOIN Erp.SaleAuth sra with(nolock) ON
	sra.Company = cust.Company
	AND sra.SalesRepCode = cust.SalesRepCode

	INNER JOIN Erp.UserFile u with(nolock) ON
	u.DcdUserID = sra.DcdUserID
	AND u.EMailAddress = '{EmailAddress}'
WHERE
	fa.RelatedToSchemaName = 'Erp'
	AND fa.RelatedToFile = 'Customer'
	--AND fa.Company = 'YourCompanyID'  -- Set this to a specific company ID if you have more than one
ORDER BY
	f.XFileName