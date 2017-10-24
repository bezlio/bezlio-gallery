SELECT
	  c.customer_id_string AS ID
	, c.customer_id As CustNum
	, c.customer_name As Name
	, a.phys_address1 As Address1
	, a.phys_address2 As Address2
	, a.phys_address3 As Address3
	, a.phys_city As City
	, a.phys_state As State
	, a.phys_postal_code As ZIP
	, a.phys_address1 + ' ' + a.phys_city + ', ' + a.phys_state + ' ' + a.phys_postal_code + ' ' AS Address
	, gl.Geocode_Location AS Geocode_Location
	, ct.customer_type AS AccountType
	, '' AS Territory --t.territory_id AS Territory -- Multiple Territories found for a single Customer causing duplications
	, '' As EstDate -- Not found for Prophet21. (Possible alternate c.date_acct_opened)
	, LastContact = (SELECT TOP 1 Cast(cl.end_date As Date) FROM p21_view_call_log cl with(nolock) WHERE cl.customer_id = c.customer_id ORDER BY cl.end_date DESC)
	  -- (Epicor offers a FiscalYear for an Invoice. Prophet 21 appears to require some additional qualifying for Fiscal - pending based on demand.)
	, YTDSales = (SELECT SUM(ih.total_amount) FROM p21_view_invoice_hdr ih with(nolock) WHERE ih.company_no = c.company_id and ih.customer_id_number = c.customer_id and ih.year_for_period = YEAR(GETDATE()))
	, LYTDSales = (SELECT SUM(ih.total_amount) FROM p21_view_invoice_hdr ih with(nolock) WHERE ih.company_no = c.company_id and ih.customer_id_number = c.customer_id and ih.year_for_period = YEAR(GETDATE())-1 And MONTH(ih.invoice_date) <= MONTH(GETDATE()) And DAY(ih.invoice_date) <= DAY(GETDATE()))
	, sr.id AS SalesRep
	, tm.terms_desc AS TermsDescription
	, NextTaskDue = (SELECT TOP 1 Cast(tsk.target_complete_date As Date) FROM p21_view_activity_trans tsk with(nolock) 
					 WHERE tsk.company_id = c.company_id 
						And tsk.contact_id In (Select id FROM p21_view_contacts with(nolock) WHERE address_id = a.id ) 
						And tsk.completed_flag = 'N' 
					 ORDER BY tsk.target_complete_date ASC)
	, Coalesce(ARAging.[0to30], 0) As CurrentBalance
	, Coalesce(ARAging.[31to60], 0) As ThirtyToSixty
	, Coalesce(ARAging.[61to90], 0) As SixtytoNinety
	, Coalesce(ARAging.[91to120], 0) As NinetyToOneHundredTwenty
	, Coalesce(ArAging.Over120, 0) As OneHundredTwentyPlus
FROM
	p21_view_customer c with(nolock)

	LEFT OUTER JOIN p21_view_address a with(nolock) ON
	c.customer_id = a.id

	LEFT OUTER JOIN Bezlio_Customer_Geocode_Location gl with(nolock) ON
	c.customer_id = gl.customer_id
	And c.company_id = gl.company_id

	INNER JOIN p21_view_customer_type ct with(nolock) ON
	c.customer_type_cd = ct.customer_type_uid
	
	-- Multiple Territories found for a single Customer causing duplications
	--LEFT OUTER JOIN p21_view_territory_x_customer tc with(nolock) ON
	--c.customer_id = tc.customer_id
	--LEFT OUTER JOIN p21_view_territory t with(nolock) ON
	--tc.territory_uid = t.territory_uid
	
	LEFT OUTER JOIN p21_view_contacts sr with(nolock) ON
	c.salesrep_id = sr.id

	LEFT OUTER JOIN p21_view_terms tm with(nolock) ON
	c.terms_id = tm.terms_id
	LEFT OUTER JOIN
		(SELECT 
			iAR.customer_id As CustNum,
			iAR.company_no As Company,
			-- (Or iAR.net_due_date? vs iAR.terms_due_date)
			sum(case when DATEDIFF(DD, iAR.terms_due_date, GETDATE()) < 30 then iAR.total_amount - iAR.amount_paid else 0 end) As "0to30",
			sum(case when DATEDIFF(DD, iAR.terms_due_date, GETDATE()) > 30 and DATEDIFF(DD, iAR.terms_due_date, GETDATE()) < 60 then iAR.total_amount - iAR.amount_paid else 0 end) As "31to60",
			sum(case when DATEDIFF(DD, iAR.terms_due_date, GETDATE()) > 60 and DATEDIFF(DD, iAR.terms_due_date, GETDATE()) < 90 then iAR.total_amount - iAR.amount_paid else 0 end) As "61to90",
			sum(case when DATEDIFF(DD, iAR.terms_due_date, GETDATE()) > 90 and DATEDIFF(DD, iAR.terms_due_date, GETDATE()) < 120 then iAR.total_amount - iAR.amount_paid else 0 end) As "91to120",       
			sum(case when DATEDIFF(DD, iAR.terms_due_date, GETDATE()) > 120 then iAR.total_amount - iAR.amount_paid else 0 end) As "Over120"
		FROM
			p21_view_invoice_hdr iAR with(nolock)
		WHERE 
			(iAR.total_amount - iAR.amount_paid) <> 0
		GROUP BY
		iAR.company_no,iAR.customer_id) As ARAging 
	ON  c.company_id = ARAging.Company 
	AND c.customer_id = ArAging.CustNum
WHERE
	a.phys_postal_code <> ''
	AND sr.email_address = '{EmailAddress}'
	--AND c.company_id = 'YourCompanyID'  -- Set this to a specific company ID if you have more than one
	AND c.customer_name NOT LIKE '%DO NOT USE%'
ORDER BY
	c.customer_name asc