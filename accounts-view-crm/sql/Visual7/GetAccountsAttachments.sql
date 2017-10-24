SELECT TOP 100
	'' AS FileName
	, '' AS Description
	, '' AS FileExt
	, c.ID AS ID
FROM
    CUSTOMER c with(nolock)
WHERE
    (1 <> 1)