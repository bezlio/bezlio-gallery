SELECT 
	c.ID AS ID
	, c.ID as CustNum
	, c.Name
	, c.ADDR_1 as Address1
	, c.ADDR_2 as Address2
	, c.ADDR_3 as Address3
	, c.City
	, c.State
	, c.ZIPCODE as ZIP
	, c.ADDR_1 + ' ' + c.City + ', ' + c.State + ' ' + c.ZIPCODE + ' ' AS Address
	, '' AS Geocode_Location
	, 'Customer' as AccountType
	, t.DESCRIPTION AS Territory
	, c.OPEN_DATE as EstDate
	, LastContact = '' 
	, YTDSales = (SELECT SUM(r.TOTAL_AMOUNT) FROM RECEIVABLE r with(nolock) WHERE r.CUSTOMER_ID = c.ID and YEAR(r.INVOICE_DATE) = YEAR(GETDATE()))
	, LYTDSales = (SELECT SUM(r.TOTAL_AMOUNT) FROM RECEIVABLE r with(nolock) WHERE r.CUSTOMER_ID = c.ID and YEAR(r.INVOICE_DATE) = YEAR(GETDATE()) -1 And MONTH(r.INVOICE_DATE) <= MONTH(GETDATE()) And DAY(r.INVOICE_DATE) <= DAY(GETDATE()))
	, c.SALESREP_ID AS SalesRep
	, 'NET ' + CAST (c.TERMS_NET_DAYS as varchar) AS TermsDescription
	, NextTaskDue = ''
FROM CUSTOMER c 
LEFT OUTER JOIN TERRITORY t ON c.TERRITORY = t.CODE