SELECT
	b.WarehouseCode
	, b.BinNum
	, b.OnhandQty
	, p.IUM AS UOM
FROM
	PartBin b with (nolock)

	INNER JOIN Warehse w with(nolock) ON
	w.Company = b.Company
	AND w.WarehouseCode = b.WarehouseCode
	
	LEFT OUTER JOIN Part p with(nolock) ON
	p.Company = b.Company
	AND p.PartNum = b.PartNum
WHERE
	b.PartNum = '{PartNum}'
	AND b.OnhandQty > 0
	AND w.Plant = '{Plant}'