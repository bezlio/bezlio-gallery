SELECT
	whse.Description AS 'Location'
	, pw.PartNum AS 'Product'
	, (SELECT TOP 1 DATEDIFF(DAY, pt.TranDate, GETDATE()) FROM PartTran pt with(nolock) 
		WHERE pt.Company = pw.Company and pt.PartNum = pw.PartNum and pt.WareHouseCode = pw.WarehouseCode ORDER BY pt.TranDate DESC) AS Age
	, CASE WHEN p.CostMethod = 'S' THEN 
		(pc.StdBurdenCost + pc.StdLaborCost + pc.StdMaterialCost + pc.StdMtlBurCost + pc.StdSubContCost) * pw.OnhandQty 
	  ELSE
		(pc.AvgBurdenCost + pc.AvgLaborCost + pc.AvgMaterialCost + pc.AvgMtlBurCost + pc.AvgSubContCost) * pw.OnhandQty END AS 'Cost'
FROM
	PartWhse pw with(nolock)

	INNER JOIN Warehse whse with(nolock) ON
	whse.Company = pw.Company
	AND whse.WarehouseCode = pw.WarehouseCode

	INNER JOIN Part p with(nolock) ON
	p.Company = pw.Company
	AND p.PartNum = pw.PartNum

	INNER JOIN PartCost pc with(nolock) ON
	pc.Company = pw.Company
	AND pc.PartNum = pw.PartNum
WHERE
	(CASE WHEN p.CostMethod = 'S' THEN 
		(pc.StdBurdenCost + pc.StdLaborCost + pc.StdMaterialCost + pc.StdMtlBurCost + pc.StdSubContCost) * pw.OnhandQty 
	  ELSE
		(pc.AvgBurdenCost + pc.AvgLaborCost + pc.AvgMaterialCost + pc.AvgMtlBurCost + pc.AvgSubContCost) * pw.OnhandQty END) > 0