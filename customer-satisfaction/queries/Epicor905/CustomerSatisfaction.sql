SELECT 
	AVG(c.Number01) AS Pricing
	, AVG(c.Number02) AS Quality
	, AVG(c.Number03) AS "Customer Service"
FROM 
	Customer c with(nolock)