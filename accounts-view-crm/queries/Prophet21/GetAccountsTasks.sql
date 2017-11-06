SELECT
	  t.activity_desc As TaskDescription
	, Cast(td.start_date As Date) As StartDate
	, Cast(td.target_complete_date As Date) As DueDate
	, tt.category_desc As TypeDescription
	, '' As PercentComplete
	, '' As PriorityCode
	, t.activity_id As TaskID
	, '' As TaskSeqNum
	, td.completed_flag AS Complete
	, tt.category_id AS TaskType
	, '' AS RowMod
	, c.customer_id_string AS ID
	, c.customer_id AS CustNum
	, td.company_id AS Company
	, sr.id AS SalesRepCode
FROM
	p21_view_activity t with(nolock)
	INNER JOIN p21_view_activity_trans td with(nolock) ON
	t.activity_id = td.activity_id

	LEFT OUTER JOIN p21_view_contacts cn with(nolock) ON
	td.contact_id = cn.id
	LEFT JOIN p21_view_customer c with(nolock) ON
	cn.address_id = c.customer_id

	LEFT OUTER JOIN p21_view_contacts sr with(nolock) ON
	c.salesrep_id = sr.id

	LEFT OUTER JOIN p21_view_category_x_activity cxa with(nolock) ON
	t.activity_id = cxa.activity_id
	LEFT JOIN p21_view_category tt with(nolock) ON
	cxa.category_uid = tt.category_uid
WHERE
	td.completed_flag = 'N'
	--AND (sr.email_address IS NULL OR sr.email_address = '{EmailAddress}') -- Disabled for TESTING
	--AND td.company_id = 'YourCompanyID'  -- Set this to a specific company ID if you have more than one