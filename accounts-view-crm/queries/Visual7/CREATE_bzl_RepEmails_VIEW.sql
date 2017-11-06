


--==== The following creates a list of Sales Rep emails
--==== Requirements are the following:
--====   1. Sales Rep maintenance must include Vendor ID
--====   2. Vendor entries must include Alternate Contacts
--====   3. Alternate contact emails must match Bezlio user accounts for Sales Reps

--==== This view can then be referenced by other Bezlio SQL scripts
--==== to limit data returned to only that owned by the Sales Rep user logged in



CREATE VIEW [dbo].[bzl_RepEmails]
AS
select sr.ID, c.EMAIL
from SALES_REP sr
	inner join VEND_CONTACT vc on sr.VENDOR_ID = vc.VENDOR_ID
	inner join CONTACT c on vc.CONTACT_ID = c.ID
where sr.VENDOR_ID is not null and c.EMAIL is not null
group by sr.ID, c.EMAIL
