SELECT
	pb.PART_ID AS Id
	, p.DESCRIPTION AS Description
	, pb.LOCATION_ID AS Bin
	, pb.QTY AS OnHandQty
FROM
	PART_LOCATION pb with(nolock)

	LEFT OUTER JOIN PART p with(nolock) ON
	p.ID = pb.PART_ID
WHERE
	pb.QTY > 0