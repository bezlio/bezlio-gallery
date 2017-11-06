SELECT
	c.CustID AS ID
	, c.CustNum
	, c.Name
	, c.Address1
	, c.Address2
	, c.Address3
	, c.City
	, c.State
	, c.ZIP
	, c.Address1 + ' ' + c.City + ', ' + c.State + ' ' + c.ZIP + ' ' AS Address
	, c.ServRef5 AS Geocode_Location
	, (CASE WHEN c.CustomerType = 'CUS' THEN 'Customer' ELSE (CASE WHEN c.CustomerType = 'SUS' THEN 'Suspect' ELSE (CASE WHEN c.CustomerType = 'PRO' THEN 'Prospect' ELSE c.CustomerType END) END) END) as AccountType
	, t.TerritoryDesc AS Territory
	, c.EstDate
	, LastContact = (SELECT TOP 1 cl.LastDate FROM CRMCall cl with(nolock) WHERE cl.Company = c.Company and cl.CallCustNum = c.CustNum ORDER BY cl.LastDate DESC)
	, YTDSales = (SELECT SUM(ih.InvoiceAmt) FROM InvcHead ih with(nolock) WHERE ih.Company = c.Company and ih.CustNum = c.CustNum and ih.FiscalYear = YEAR(GETDATE()))
	, LYTDSales = (SELECT SUM(ih.InvoiceAmt) FROM InvcHead ih with(nolock) WHERE ih.Company = c.Company and ih.CustNum = c.CustNum and ih.FiscalYear = YEAR(GETDATE())-1 And MONTH(ih.InvoiceDate) <= MONTH(GETDATE()) And DAY(ih.InvoiceDate) <= DAY(GETDATE()))
	, sra.SalesRepCode AS SalesRep
	, tm.Description AS TermsDescription
	, c.CustURL as WebSite
	, ShipVia = (SELECT top 1 Description FROM ShipVia sv with(nolock) WHERE sv.ShipViaCode = c.ShipViaCode)
	, FreightTerms = (select top 1 Description from FOB with(nolock) where FOB.FOB = c.DefaultFOB)
	, '' as HoursOfOperation
	, c.Comment_ as CustomerNotes
	, NextTaskDue = (SELECT TOP 1 tsk.DueDate FROM Task tsk with(nolock) WHERE tsk.Company = c.Company and tsk.RelatedToFile = 'Customer' and tsk.Key1 = c.CustNum and tsk.Complete = 0 ORDER BY tsk.DueDate)
	, Coalesce(ARAging.[0to30], 0) As CurrentBalance
	, Coalesce(ARAging.[31to60], 0) As ThirtyToSixty
	, Coalesce(ARAging.[61to90], 0) As SixtytoNinety
	, Coalesce(ARAging.[91to120], 0) As NinetyToOneHundredTwenty
	, Coalesce(ArAging.Over120, 0) As OneHundredTwentyPlus
FROM
	Customer c with(nolock)
	
	INNER JOIN SalesTer t with(nolock) ON
	t.Company = c.Company
	AND t.TerritoryID = c.TerritoryID
	
	INNER JOIN SaleAuth sra with(nolock) ON
	sra.Company = c.Company
	AND sra.SalesRepCode = c.SalesRepCode

	INNER JOIN UserFile u with(nolock) ON
	u.DcdUserID = sra.DcdUserID
	AND u.EMailAddress = '{EmailAddress}'

	LEFT OUTER JOIN Terms tm with(nolock) ON
	tm.Company = c.Company
	AND tm.TermsCode = c.TermsCode
	LEFT OUTER JOIN
	(select 
	    iAR.CustNum,
		iAR.Company,
        sum(case when DATEDIFF(DD, iAR.DueDate, GETDATE()) < 30 then iAR.InvoiceBal else 0 end) As "0to30",
        sum(case when DATEDIFF(DD, iAR.DueDate, GETDATE()) > 30 and DATEDIFF(DD, iAR.DueDate, GETDATE()) < 60 then iAR.InvoiceBal else 0 end) As "31to60",
        sum(case when DATEDIFF(DD, iAR.DueDate, GETDATE()) > 60 and DATEDIFF(DD, iAR.DueDate, GETDATE()) < 90 then iAR.InvoiceBal else 0 end) As "61to90",
        sum(case when DATEDIFF(DD, iAR.DueDate, GETDATE()) > 90 and DATEDIFF(DD, iAR.DueDate, GETDATE()) < 120 then iAR.InvoiceBal else 0 end) As "91to120",       
        sum(case when DATEDIFF(DD, iAR.DueDate, GETDATE()) > 120 then iAR.InvoiceBal else 0 end) As "Over120"
	FROM
		InvcHead iAR with(nolock)
	WHERE 
		iAR.InvoiceBal <> 0
	GROUP BY
	   iAR.Company,iAR.CustNum) As ARAging 
	   On  c.Company = ARAging.Company 
	   AND c.CustNum = ArAging.CustNum
WHERE
	c.ZIP <> ''
	--AND c.Company = 'YourCompanyID'  -- Set this to a specific company ID if you have more than one
ORDER BY
	c.Name asc
