SELECT
	p.ID
	, p.DESCRIPTION
	, SUM(pl.QTY) AS 'On Hand Qty'
	-- Add all of the columns you wish to see here - they will be dynamically added to the view
FROM
	PART p with(nolock)

	LEFT OUTER JOIN PART_LOCATION pl with(nolock) ON
	pl.PART_ID = p.ID
GROUP BY
	p.ID
	, p.DESCRIPTION
	
-- NOTE: Current version of Bezlio / this Bezl did not support changing query from Excel to SQL and provide parameters
-- during that change so we currently bring back ALL parts.  The change to make this only pull a single part is
-- in DEV when this was committed.  Once in live this query will be updated accordingly.