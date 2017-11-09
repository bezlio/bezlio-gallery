SELECT 
	ih.net_due_date AS DueDate
	, ih.total_amount - ih.amount_paid AS InvoiceBal
	, 0 AS CreditMemo
FROM 
	invoice_hdr ih with(nolock)
WHERE
	ih.paid_in_full_flag = 'N'