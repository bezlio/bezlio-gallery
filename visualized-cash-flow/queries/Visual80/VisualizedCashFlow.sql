-- We use pattern matching against the chart of accounts.  Fill in each of the below according to your structure.  Feel free
-- to define your own categories here as well by just copying an existing SELECT below and being sure to define the Order value 
-- and put in your own pattern.
DECLARE @EarningsPattern nvarchar(max) = '[4-9]%';
DECLARE @DepreciationPattern nvarchar(max) = '[4-5][2-9]25%';
DECLARE @UnbilledShipmentsPattern nvarchar(max) = '11200';
DECLARE @ChangeInARPattern nvarchar(max) = '1010-000';
DECLARE @ChangeInAPPattern nvarchar(max) = '1205-000';
DECLARE @PrepaidExpensesPattern nvarchar(max) = '1090%';
DECLARE @DividendsPaidPattern nvarchar(max) = '38700';

-- Set the site ID to look at
DECLARE @SiteID nvarchar(max) = 'MMC';

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
	p.ACCT_YEAR AS [Year]
	, p.ACCT_PERIOD AS Period
	, 0 as 'Order'
	, 'Earnings' as 'Description'
	, ISNULL(((SELECT SUM(CURR_BALANCE) FROM ACCOUNT_BALANCE WHERE ACCT_YEAR = p.ACCT_YEAR AND ACCT_PERIOD = p.ACCT_PERIOD AND ACCOUNT_ID LIKE @EarningsPattern)*@EarningsMultiplier), 0) as 'Value'
FROM
	ACCOUNT_PERIOD p with(nolock)
WHERE
	p.SITE_ID = @SiteID
	
-- Depreciation
UNION ALL
SELECT
	p.ACCT_YEAR AS [Year]
	, p.ACCT_PERIOD AS Period
	, 1 as 'Order'
	, 'Depreciation' as 'Description'
	, ISNULL(((SELECT SUM(CURR_BALANCE) FROM ACCOUNT_BALANCE WHERE ACCT_YEAR = p.ACCT_YEAR AND ACCT_PERIOD = p.ACCT_PERIOD AND ACCOUNT_ID LIKE @DepreciationPattern)*@DepreciationMultiplier), 0) as 'Value'
FROM
	ACCOUNT_PERIOD p with(nolock)
WHERE
	p.SITE_ID = @SiteID
	
-- Unbilled Shipments
UNION ALL
SELECT
	p.ACCT_YEAR AS [Year]
	, p.ACCT_PERIOD AS Period
	, 2 as 'Order'
	, 'Unbilled Shipments' as 'Description'
	, ISNULL(((SELECT SUM(CURR_BALANCE) FROM ACCOUNT_BALANCE WHERE ACCT_YEAR = p.ACCT_YEAR AND ACCT_PERIOD = p.ACCT_PERIOD AND ACCOUNT_ID LIKE @UnbilledShipmentsPattern)*@UnbilledShipmentsMultiplier), 0) as 'Value'
FROM
	ACCOUNT_PERIOD p with(nolock)
WHERE
	p.SITE_ID = @SiteID
	
-- Change In AR
UNION ALL
SELECT
	p.ACCT_YEAR AS [Year]
	, p.ACCT_PERIOD AS Period
	, 3 as 'Order'
	, 'Change In AR' as 'Description'
	, ISNULL(((SELECT SUM(CURR_BALANCE) FROM ACCOUNT_BALANCE WHERE ACCT_YEAR = p.ACCT_YEAR AND ACCT_PERIOD = p.ACCT_PERIOD AND ACCOUNT_ID LIKE @ChangeInARPattern)*@ChangeInARMultiplier), 0) as 'Value'
FROM
	ACCOUNT_PERIOD p with(nolock)
WHERE
	p.SITE_ID = @SiteID
	
-- Change In AP
UNION ALL
SELECT
	p.ACCT_YEAR AS [Year]
	, p.ACCT_PERIOD AS Period
	, 4 as 'Order'
	, 'Change In AP' as 'Description'
	, ISNULL(((SELECT SUM(CURR_BALANCE) FROM ACCOUNT_BALANCE WHERE ACCT_YEAR = p.ACCT_YEAR AND ACCT_PERIOD = p.ACCT_PERIOD AND ACCOUNT_ID LIKE @ChangeInAPPattern)*@ChangeInAPMultiplier), 0) as 'Value'
FROM
	ACCOUNT_PERIOD p with(nolock)
WHERE
	p.SITE_ID = @SiteID
	
-- Prepaid Expenses
UNION ALL
SELECT
	p.ACCT_YEAR AS [Year]
	, p.ACCT_PERIOD AS Period
	, 5 as 'Order'
	, 'Prepaid Expenses' as 'Description'
	, ISNULL(((SELECT SUM(CURR_BALANCE) FROM ACCOUNT_BALANCE WHERE ACCT_YEAR = p.ACCT_YEAR AND ACCT_PERIOD = p.ACCT_PERIOD AND ACCOUNT_ID LIKE @PrepaidExpensesPattern)*@PrepaidExpensesMultiplier), 0) as 'Value'
FROM
	ACCOUNT_PERIOD p with(nolock)
WHERE
	p.SITE_ID = @SiteID
	
-- Dividends Paid
UNION ALL
SELECT
	p.ACCT_YEAR AS [Year]
	, p.ACCT_PERIOD AS Period
	, 6 as 'Order'
	, 'Dividends Paid' as 'Description'
	, ISNULL(((SELECT SUM(CURR_BALANCE) FROM ACCOUNT_BALANCE WHERE ACCT_YEAR = p.ACCT_YEAR AND ACCT_PERIOD = p.ACCT_PERIOD AND ACCOUNT_ID LIKE @DividendsPaidPattern)*@DividendsPaidMultiplier), 0) as 'Value'
FROM
	ACCOUNT_PERIOD p with(nolock)
WHERE
	p.SITE_ID = @SiteID
	
	
-- Overall sorting	
ORDER BY
	p.ACCT_YEAR DESC
	, p.ACCT_PERIOD
	, [Order]