SELECT
	  c.ID
	, c.ID as CustNum
	, ISNULL(ct.FIRST_NAME,'') + ' ' + ISNULL(ct.LAST_NAME,'') as ContactName
	, ct.EMAIL as EMailAddress
	, ct.POSITION as ContactTitle
	, ct.PHONE as PhoneNum
FROM CUSTOMER c with(nolock)

	INNER JOIN CUST_CONTACT cc with(nolock) ON 
	c.ID = cc.CUSTOMER_ID

	INNER JOIN CONTACT ct with(nolock) ON 
	ct.ID = cc.CONTACT_ID