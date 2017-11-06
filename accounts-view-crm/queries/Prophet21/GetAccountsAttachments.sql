SELECT
	  '' AS FileName
	, '' AS Description
	, '' AS FileExt
	, c.customer_id_string AS ID
FROM
    p21_view_customer c with(nolock)
WHERE
    (1 <> 1)