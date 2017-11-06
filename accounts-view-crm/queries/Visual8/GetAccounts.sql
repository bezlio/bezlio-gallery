SELECT
	c.ID AS ID
	, c.ID as CustNum
	, isnull(c.Name,'') as Name
	, isnull(c.ADDR_1,'') as Address1
	, isnull(c.ADDR_2,'') as Address2
	, isnull(c.ADDR_3,'') as Address3
	, isnull(c.City,'') as City
	, isnull(c.State,'') as State
	, isnull(c.ZIPCODE,'') as ZIP
	, isnull(c.ADDR_1 + ' ' + c.CITY + ', ' + isnull(c.STATE,'') + ' ' + isnull(c.ZIPCODE,'') + ' ','') AS Address
	, isnull(c.USER_5,'') AS Geocode_Location
	, 'Distributor' as AccountType
	, t.DESCRIPTION AS Territory
	, c.OPEN_DATE as EstDate
	, LastContact = c.LAST_ORDER_DATE -- ADD BACK FOR YOUR CRM (SELECT TOP 1 cl.LastDate FROM Erp.CRMCall cl with(nolock) WHERE cl.Company = c.Company and cl.CallCustNum = c.CustNum ORDER BY cl.LastDate DESC)
	, YTDSales = (SELECT SUM(r.TOTAL_AMOUNT) FROM RECEIVABLE r with(nolock) WHERE r.CUSTOMER_ID = c.ID and YEAR(r.INVOICE_DATE) = YEAR(GETDATE()))
	, LYTDSales = (SELECT SUM(r.TOTAL_AMOUNT) FROM RECEIVABLE r with(nolock) WHERE r.CUSTOMER_ID = c.ID and YEAR(r.INVOICE_DATE) = YEAR(GETDATE()) -1 And MONTH(r.INVOICE_DATE) <= MONTH(GETDATE()) And DAY(r.INVOICE_DATE) <= DAY(GETDATE()))
	, sra.NAME AS SalesRep
	, tm.Description AS TermsDescription
	, isnull(c.WEB_URL,'') as WebSite
	, isnull(c.SHIP_VIA,'') as ShipVia
	, FreightTerms = c.FREIGHT_TERMS
	, '' as HoursOfOperation
	, '' as CustomerNotes
	, NextTaskDue = '' -- (SELECT TOP 1 tsk.DueDate FROM Erp.Task tsk with(nolock) WHERE tsk.Company = c.Company and tsk.RelatedToFile = 'Customer' and tsk.Key1 = c.CustNum and tsk.Complete = 0 ORDER BY tsk.DueDate)
	, Coalesce(ARAging.[0to30], 0) As CurrentBalance
	, Coalesce(ARAging.[31to60], 0) As ThirtyToSixty
	, Coalesce(ARAging.[61to90], 0) As SixtytoNinety
	, Coalesce(ARAging.[91to120], 0) As NinetyToOneHundredTwenty
	, Coalesce(ArAging.Over120, 0) As OneHundredTwentyPlus
FROM
	CUSTOMER c with(nolock)
	INNER JOIN TERRITORY t with(nolock) ON t.CODE = c.TERRITORY
	INNER JOIN SALES_REP sra with(nolock) ON sra.ID = c.SALESREP_ID
	LEFT OUTER JOIN bzl_RepEmails b with(nolock) on b.SALESREP_ID = c.SALESREP_ID
	LEFT OUTER JOIN TERMS tm with(nolock) ON tm.ID = c.DEF_TERMS_ID
	LEFT OUTER JOIN
	(
		select 
			iAR.CUSTOMER_ID,
			sum(case when DATEDIFF(DD, iAR.INVOICE_DATE + TERMS_NET_DAYS, GETDATE()) < 30 then iAR.TOTAL_AMOUNT - PAID_AMOUNT else 0 end) As "0to30",
			sum(case when DATEDIFF(DD, iAR.INVOICE_DATE + TERMS_NET_DAYS, GETDATE()) > 30 and DATEDIFF(DD, iAR.INVOICE_DATE + TERMS_NET_DAYS, GETDATE()) < 60 then iAR.TOTAL_AMOUNT - PAID_AMOUNT else 0 end) As "31to60",
			sum(case when DATEDIFF(DD, iAR.INVOICE_DATE + TERMS_NET_DAYS, GETDATE()) > 60 and DATEDIFF(DD, iAR.INVOICE_DATE + TERMS_NET_DAYS, GETDATE()) < 90 then iAR.TOTAL_AMOUNT - PAID_AMOUNT else 0 end) As "61to90",
			sum(case when DATEDIFF(DD, iAR.INVOICE_DATE + TERMS_NET_DAYS, GETDATE()) > 90 and DATEDIFF(DD, iAR.INVOICE_DATE + TERMS_NET_DAYS, GETDATE()) < 120 then iAR.TOTAL_AMOUNT - PAID_AMOUNT else 0 end) As "91to120",       
			sum(case when DATEDIFF(DD, iAR.INVOICE_DATE + TERMS_NET_DAYS, GETDATE()) > 120 then iAR.TOTAL_AMOUNT - PAID_AMOUNT else 0 end) As "Over120"
		FROM RECEIVABLE iAR with(nolock)
		WHERE iAR.TOTAL_AMOUNT - PAID_AMOUNT <> 0
		GROUP BY iAR.CUSTOMER_ID
	) As ARAging 
	   On  ARAging.CUSTOMER_ID = c.ID

WHERE
	c.ACTIVE_FLAG = 'Y'
	and b.EMAIL = '{EmailAddress}'
	and (c.ID in (select CUSTOMER_ID from CUSTOMER_ORDER where ORDER_DATE >= getdate() - 365 * 2 and CUSTOMER_ID is not null)
		or c.ID in (select CUSTOMER_ID from QUOTE where QUOTE_DATE >= getdate() - 365 * 2 and CUSTOMER_ID is not null)
		)
ORDER BY
	c.Name asc
