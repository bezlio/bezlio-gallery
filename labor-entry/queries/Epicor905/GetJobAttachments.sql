SELECT
	fr.XFileName AS FilePath
	, fr.XFileDesc AS FileDesc
FROM
	XFileAttch fa with(nolock)

	INNER JOIN XFileRef fr with(nolock) ON
	fr.Company = fa.Company
	AND fr.XFileRefNum = fa.XFileRefNum
WHERE
	fa.RelatedToFile = 'JobHead'
	AND fa.Key1 = '{JobNum}'