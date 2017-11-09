
select
	case when CurrentStage = 'LEAD' then 'Lead' else 
		case when CurrentStage = 'OPPO' then 'Opportunity'else
			case when CurrentStage = 'QUOT' then 'Sales' end 
		end 
	end as [Stage],
	sum(QuoteAmt) As [Value]
from quotehed
	where company = 'epic03'
	group by CurrentStage