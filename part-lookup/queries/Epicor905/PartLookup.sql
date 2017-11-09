SELECT
	p.PartNum AS Id
	, p.PartDescription AS Description
	, SUM(pb.OnhandQty) AS 'On Hand Qty'
	-- Add all of the columns you wish to see here - they will be dynamically added to the view
FROM
	Part p with(nolock)
	
	LEFT OUTER JOIN PartBin pb with(nolock) ON
	pb.Company = p.Company
GROUP BY
	p.PartNum
	, p.PartDescription
	
-- NOTE: Current version of Bezlio / this Bezl did not support changing query from Excel to SQL and provide parameters
-- during that change so we currently bring back ALL parts.  The change to make this only pull a single part is
-- in DEV when this was committed.  Once in live this query will be updated accordingly.