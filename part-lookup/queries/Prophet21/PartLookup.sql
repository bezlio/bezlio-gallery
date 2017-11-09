SELECT 
	i.item_id AS Id
	, i.item_desc AS Description
	, SUM(l.qty_on_hand) AS 'On Hand Qty'
	-- Add all of the columns you wish to see here - they will be dynamically added to the view
FROM 
	inv_mast i with(nolock)

	LEFT OUTER JOIN inv_loc l with(nolock) ON
	l.inv_mast_uid = i.inv_mast_uid
GROUP BY
	i.item_id
	, i.item_desc
	
-- NOTE: Current version of Bezlio / this Bezl did not support changing query from Excel to SQL and provide parameters
-- during that change so we currently bring back ALL parts.  The change to make this only pull a single part is
-- in DEV when this was committed.  Once in live this query will be updated accordingly.