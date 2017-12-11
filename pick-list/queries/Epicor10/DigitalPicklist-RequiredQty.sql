SELECT 
	OD.PartNum, 
	OD.LineDesc,
	ORL.ReqDate,
	SUM(ORL.OurReqQty) AS Qty	 
FROM OrderDtl OD with(nolock) 
INNER JOIN OrderRel ORL with(nolock)  
	ON OD.Company = ORL.Company
	AND OD.OrderNum = ORL.OrderNum 
	AND ORL.OpenRelease = 1
WHERE YEAR(ORL.ReqDate) >= YEAR(GETDATE())-1
GROUP BY OD.PartNum, OD.LineDesc, ORL.ReqDate
ORDER BY ORL.ReqDate asc