-- We use pattern matching against the chart of accounts.  Fill in each of the below according to your structure.  Feel free
-- to define your own categories here as well by just copying an existing SELECT below and being sure to define the Order value 
-- and put in your own pattern.
DECLARE @EarningsPattern nvarchar(max) = '[4-9]%';
DECLARE @DepreciationPattern nvarchar(max) = '7%';
DECLARE @UnbilledShipmentsPattern nvarchar(max) = '11200';
DECLARE @ChangeInARPattern nvarchar(max) = '11100';
DECLARE @ChangeInAPPattern nvarchar(max) = '20200';
DECLARE @PrepaidExpensesPattern nvarchar(max) = '12%';
DECLARE @DividendsPaidPattern nvarchar(max) = '38700';

-- Define whether each type of account needs to be multiplied by -1
DECLARE @EarningsMultiplier INT = -1;
DECLARE @DepreciationMultiplier INT = 1;
DECLARE @UnbilledShipmentsMultiplier INT = -1;
DECLARE @ChangeInARMultiplier INT = -1;
DECLARE @ChangeInAPMultiplier INT = -1;
DECLARE @PrepaidExpensesMultiplier INT = 1;
DECLARE @DividendsPaidMultiplier INT = -1;

-- Earnings
SELECT
	p.FiscalYear AS [Year]
	, p.FiscalPeriod AS Period
	, 0 as 'Order'
	, 'Earnings' as 'Description'
	, ISNULL(((SELECT SUM(BalanceAmt) FROM Erp.GLPeriodBal WHERE Company = p.Company AND FiscalYear = p.FiscalYear AND FiscalPeriod = p.FiscalPeriod AND SegValue1 LIKE @EarningsPattern)*@EarningsMultiplier), 0) as 'Value'
FROM
	Erp.FiscalPer p with(nolock)
	
-- Depreciation
UNION ALL
SELECT
	p.FiscalYear AS [Year]
	, p.FiscalPeriod AS Period
	, 1 as 'Order'
	, 'Depreciation' as 'Description'
	, ISNULL(((SELECT SUM(BalanceAmt) FROM Erp.GLPeriodBal WHERE Company = p.Company AND FiscalYear = p.FiscalYear AND FiscalPeriod = p.FiscalPeriod AND SegValue1 LIKE @DepreciationPattern)*@DepreciationMultiplier), 0) as 'Value'
FROM
	Erp.FiscalPer p with(nolock)
	
-- Unbilled Shipments
UNION ALL
SELECT
	p.FiscalYear AS [Year]
	, p.FiscalPeriod AS Period
	, 2 as 'Order'
	, 'Unbilled Shipments' as 'Description'
	, ISNULL(((SELECT SUM(BalanceAmt) FROM Erp.GLPeriodBal WHERE Company = p.Company AND FiscalYear = p.FiscalYear AND FiscalPeriod = p.FiscalPeriod AND SegValue1 LIKE @UnbilledShipmentsPattern)*@UnbilledShipmentsMultiplier), 0) as 'Value'
FROM
	Erp.FiscalPer p with(nolock)
	
-- Change In AR
UNION ALL
SELECT
	p.FiscalYear AS [Year]
	, p.FiscalPeriod AS Period
	, 3 as 'Order'
	, 'Change In AR' as 'Description'
	, ISNULL(((SELECT SUM(BalanceAmt) FROM Erp.GLPeriodBal WHERE Company = p.Company AND FiscalYear = p.FiscalYear AND FiscalPeriod = p.FiscalPeriod AND SegValue1 LIKE @ChangeInARPattern)*@ChangeInARMultiplier), 0) as 'Value'
FROM
	Erp.FiscalPer p with(nolock)
	
-- Change In AP
UNION ALL
SELECT
	p.FiscalYear AS [Year]
	, p.FiscalPeriod AS Period
	, 4 as 'Order'
	, 'Change In AP' as 'Description'
	, ISNULL(((SELECT SUM(BalanceAmt) FROM Erp.GLPeriodBal WHERE Company = p.Company AND FiscalYear = p.FiscalYear AND FiscalPeriod = p.FiscalPeriod AND SegValue1 LIKE @ChangeInAPPattern)*@ChangeInAPMultiplier), 0) as 'Value'
FROM
	Erp.FiscalPer p with(nolock)
	
-- Prepaid Expenses
UNION ALL
SELECT
	p.FiscalYear AS [Year]
	, p.FiscalPeriod AS Period
	, 5 as 'Order'
	, 'Prepaid Expenses' as 'Description'
	, ISNULL(((SELECT SUM(BalanceAmt) FROM Erp.GLPeriodBal WHERE Company = p.Company AND FiscalYear = p.FiscalYear AND FiscalPeriod = p.FiscalPeriod AND SegValue1 LIKE @PrepaidExpensesPattern)*@PrepaidExpensesMultiplier), 0) as 'Value'
FROM
	Erp.FiscalPer p with(nolock)
	
-- Dividends Paid
UNION ALL
SELECT
	p.FiscalYear AS [Year]
	, p.FiscalPeriod AS Period
	, 6 as 'Order'
	, 'Dividends Paid' as 'Description'
	, ISNULL(((SELECT SUM(BalanceAmt) FROM Erp.GLPeriodBal WHERE Company = p.Company AND FiscalYear = p.FiscalYear AND FiscalPeriod = p.FiscalPeriod AND SegValue1 LIKE @DividendsPaidPattern)*@DividendsPaidMultiplier), 0) as 'Value'
FROM
	Erp.FiscalPer p with(nolock)
	
	
-- Overall sorting	
ORDER BY
	p.FiscalYear DESC
	, p.FiscalPeriod
	, [Order]