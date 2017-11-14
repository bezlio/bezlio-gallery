SELECT
	p.item_id AS Id
	, p.item_desc AS Description
	, pb.location_id AS Bin
	, pb.qty_on_hand AS OnHandQty
FROM
	inv_loc pb with(nolock)

	LEFT OUTER JOIN inv_mast p with(nolock) ON
	p.inv_mast_uid = pb.inv_mast_uid
WHERE
	pb.qty_on_hand > 0