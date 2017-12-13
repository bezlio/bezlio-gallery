SELECT ORL.PartNum,
	PB.WarehouseCode,
	PB.BinNum,
	MAX(PB.OnhandQty - PB.AllocatedQty - PB.SalesAllocatedQty - PB.SalesPickingQty - PB.SalesPickedQty - PB.JobAllocatedQty - PB.JobPickingQty - PB.JobPickedQty - PB.TFOrdAllocatedQty - TFOrdPickingQty - TFOrdPickedQty - ShippingQty - PackedQty) As AvailQty
FROM OrderRel ORL with(nolock)  
INNER JOIN Erp.PartBin PB with(nolock)
	ON ORL.Company = PB.Company
	AND ORL.PartNum = PB.PartNum
WHERE 
	ORL.OpenRelease = 1
	AND (PB.OnhandQty - PB.AllocatedQty - PB.SalesAllocatedQty - PB.SalesPickingQty - PB.SalesPickedQty - PB.JobAllocatedQty - PB.JobPickingQty - PB.JobPickedQty - PB.TFOrdAllocatedQty - TFOrdPickingQty - TFOrdPickedQty - ShippingQty - PackedQty) > 0
	AND YEAR(ORL.ReqDate) >= YEAR(GETDATE())-1
GROUP BY ORL.PartNum, PB.WarehouseCode, PB.BinNum 
