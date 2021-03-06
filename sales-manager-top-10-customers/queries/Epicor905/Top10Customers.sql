SELECT TOP 10 
	CUSTOMER.CUSTID AS CUSTOMERID,
	CUSTOMER.NAME AS CUSTOMER_NAME,
	SUM(ORDERDTL.DOCEXTPRICEDTL) AS SALESVALUE
FROM ORDERHED AS ORDERHED WITH(NOLOCK)
INNER JOIN ORDERDTL AS ORDERDTL WITH(NOLOCK) ON 
	ORDERHED.COMPANY = ORDERDTL.COMPANY
AND
	ORDERHED.ORDERNUM = ORDERDTL.ORDERNUM

INNER JOIN CUSTOMER AS CUSTOMER ON 
	ORDERDTL.COMPANY = CUSTOMER.COMPANY
AND
	ORDERDTL.CUSTNUM = CUSTOMER.CUSTNUM
	WHERE ORDERHED.OPENORDER = '0' 
	GROUP BY CUSTOMER.CUSTID, CUSTOMER.NAME 
	ORDER BY 3 DESC

