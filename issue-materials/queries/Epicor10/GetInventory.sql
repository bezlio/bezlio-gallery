SELECT
	b.WarehouseCode
	, b.BinNum
	, b.OnhandQty
	, p.IUM AS UOM
FROM
	Erp.PartBin b with (nolock)

	INNER JOIN Erp.Warehse w with(nolock) ON
	w.Company = b.Company
	AND w.WarehouseCode = b.WarehouseCode
	
	LEFT OUTER JOIN Erp.Part p with(nolock) ON
	p.Company = b.Company
	AND p.PartNum = b.PartNum
WHERE
	b.PartNum = '{PartNum}'
	AND b.OnhandQty > 0
	AND w.Plant = '{Plant}'