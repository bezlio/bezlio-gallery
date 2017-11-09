SELECT 
	ih.invoice_no
	, id.sequence_number
	, v.vendor_name
	, COALESCE(pg.product_group_desc, 'Other') AS Category
	, id.purchase_account AS AmountDue
	, ih.net_due_date
  FROM 
	apinv_hdr ih with(nolock)

	INNER JOIN vendor v with(nolock) ON
	v.vendor_id = ih.vendor_id

	INNER JOIN apinv_line id with(nolock) ON
	id.voucher_no = ih.voucher_no

	LEFT OUTER JOIN inv_mast im with(nolock) ON
	im.item_id = id.item_id

	LEFT OUTER JOIN product_group pg with(nolock) ON
	pg.product_group_id = im.default_product_group
  WHERE 
	ih.amount_paid = 0
	AND ih.paid_in_full = 'N'
	AND ih.approved = 'Y'