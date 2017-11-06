SELECT
	  c.customer_id_string AS ID
	, c.customer_id As CustNum
	, ct.contact_name AS ContactName
	, ct.email_address AS EMailAddress
	, ct.title AS ContactTitle
	, ct.direct_phone AS PhoneNum
FROM 
	p21_view_contacts ct with(nolock)
	
	INNER JOIN p21_view_address a with(nolock) ON
	ct.address_id = a.id
	INNER JOIN p21_view_customer c with(nolock) ON
	a.id = c.customer_id
	
	LEFT OUTER JOIN p21_view_contacts sr with(nolock) ON
	c.salesrep_id = sr.id
WHERE
	a.phys_postal_code <> ''
	--AND sr.email_address = '{EmailAddress}' -- Disabled for TESTING
	--AND c.company_id = 'YourCompanyID'  -- Set this to a specific company ID if you have more than one