SELECT 
	AVG(cud.Number01) AS Pricing
	, AVG(cud.Number02) AS Quality
	, AVG(cud.Number03) AS "Customer Service"
FROM 
	Erp.Customer c with(nolock)

	INNER JOIN Erp.Customer_UD cud with(nolock) ON
	cud.ForeignSysRowID = c.SysRowID