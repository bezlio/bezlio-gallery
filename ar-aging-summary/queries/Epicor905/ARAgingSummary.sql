SELECT
	ih.DueDate
	, ih.InvoiceBal
	, ih.CreditMemo
FROM
	InvcHead ih with(nolock)
WHERE
	ih.OpenInvoice = 1
	AND ih.InvoiceBal > 0