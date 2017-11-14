SELECT
	pb.PartNum AS Id
	, p.PartDescription AS Description
	, pb.BinNum AS Bin
	, pb.OnhandQty AS OnHandQty
FROM
	PartBin pb with(nolock)

	LEFT OUTER JOIN Part p with(nolock) ON
	p.Company = pb.Company
	AND p.PartNum = pb.PartNum
WHERE
	pb.OnhandQty > 0