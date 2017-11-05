SELECT
	ih.InvoiceNum
	, id.InvoiceLine
	, v.Name AS VendorName
	, COALESCE(pg.Description, 'Other') AS Category
	, id.ExtCost AS AmountDue
	, ih.DueDate
FROM
	APInvHed ih with(nolock)

	INNER JOIN Vendor v with(nolock) ON
	v.Company = ih.Company
	and v.VendorNum = ih.VendorNum

	INNER JOIN APInvDtl id with(nolock) ON
	id.Company = ih.Company
	AND id.InvoiceNum = ih.InvoiceNum

	LEFT OUTER JOIN Part p with(nolock) ON
	p.Company = id.Company
	AND p.PartNum = id.PartNum

	LEFT OUTER JOIN ProdGrup pg with(nolock) ON
	pg.Company = p.Company
	AND pg.ProdCode = p.ProdCode
WHERE
	ih.OpenPayable = 1
	AND id.ExtCost > 0
ORDER BY
	COALESCE(pg.Description, 'Other')