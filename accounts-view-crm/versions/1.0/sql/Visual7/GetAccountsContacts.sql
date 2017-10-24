SELECT
	  c.ID AS ID
	, c.ID AS CustNum
	, ISNULL(ct.CONTACT_FIRST_NAME,'') + ' ' + ISNULL(ct.CONTACT_LAST_NAME,'') AS ContactName
	, ct.CONTACT_EMAIL AS EMailAddress
	, ct.CONTACT_POSITION AS ContactTitle
	, ct.CONTACT_PHONE AS PhoneNum
FROM 
	CUSTOMER_CONTACT ct with(nolock)
	
	INNER JOIN CUSTOMER c with(nolock) ON
	c.ID = ct.CUSTOMER_ID