SELECT
	  cl.category_id AS ShortSummary
	, cl.notes AS Details
	, Cast(cl.start_date As Date) AS CallDate
	, sr.name AS SalesRepName
	, '' AS RelatedToFile
	, ct.category_desc As CallTypeDesc
	, cust.customer_id_string AS ID
FROM 
	p21_view_call_log cl with(nolock)

	LEFT OUTER JOIN p21_view_users sr with(nolock) ON
	sr.id = cl.user_id
	
	LEFT OUTER JOIN p21_view_call_category ct with(nolock) ON
	ct.category_id = cl.category_id -- (non Primary Key)
	
	INNER JOIN p21_view_customer cust with(nolock) ON
	cust.customer_id = cl.customer_id
WHERE 
	DATEDIFF (day, cl.end_date , GetDate()) < 90  
	--AND sr.email_address = '{EmailAddress}' -- Disabled for TESTING
ORDER BY
	cl.end_date desc