Select 
	ERP.OrderHed.OrderNum As OrderNum,
	ERP.OrderHed.OrderDate As OrderDate,
	ERP.OrderHed.PONum As PoNum,
	ERP.OrderHed.DocOrderAmt As OrderAmt,
	ERP.OrderDtl.OrderLine As OrderLine,
	ERP.OrderDtl.PartNum As PartNum,
	ERP.Part.PartDescription As PartDesc,
	Erp.OrderDtl.DocUnitPrice As UnitPrice,
	Erp.OrderDtl.DocExtPriceDtl As ExtPrice,
	Erp.OrderDtl.SellingQuantity As OrderQty,
	(Select Sum(Erp.OrderRel.SellingJobShippedQty + Erp.OrderRel.SellingStockShippedQty) 
		FROM Erp.OrderRel with (nolock)
		Where OrderDtl.Company = Erp.OrderRel.Company AND OrderDtl.OrderNum = Erp.OrderRel.OrderNum AND OrderDtl.OrderLine= Erp.OrderRel.OrderLine
		Group By Erp.OrderRel.Company,Erp.OrderRel.OrderNum, Erp.OrderRel.OrderLine) As ShippedQty
From 
	Erp.OrderHed with (nolock)
	INNER JOIN Erp.OrderDtl with (nolock) ON Erp.OrderHed.Company = Erp.OrderDtl.Company AND Erp.OrderHed.OrderNum = Erp.OrderDtl.OrderNum
	LEFT OUTER JOIN Erp.Part On Erp.OrderDtl.Company = Erp.Part.Company AND Erp.OrderDtl.PartNum = Erp.Part.PartNum
WHERE 
	ERP.OrderHed.OrderDate >= '{StartDate}' AND ERP.OrderHed.OrderDate <= '{EndDate}' AND
	ERP.OrderHed.Company =  CASE WHEN '{Company}' <> 'ALL' THEN '{Company}' ELSE Erp.OrderHed.Company END