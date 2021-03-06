SELECT 
	AVG(COALESCE(TRY_CAST(c.USER_1 AS INT),0)) AS Pricing
	, AVG(COALESCE(TRY_CAST(c.USER_2 AS INT),0)) AS Quality
	, AVG(COALESCE(TRY_CAST(c.USER_3 AS INT), 0)) AS "Customer Service"
FROM 
	CUSTOMER c with(nolock)