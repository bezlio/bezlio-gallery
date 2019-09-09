define(function () {
    /**
     * Returns a ds of a new order for the selected customer
     * @param {Object[]} bezl - A reference to the calling Bezl
     */
    function NewOrder (bezl) {

        bezl.dataService.add('newOrder','brdb','Epicor10','SalesOrder_NewOrderByCustomer',
        { "Connection": bezl.vars.connection, 
            "Company": bezl.vars.company, 
            "CustNum": bezl.vars.selectedCustomer.CustNum,
        },0);

        bezl.vars.newOrder = true;

    }

    function SubmitOrder (bezl) {
        // Update our order head info
        bezl.vars.ds.OrderHed.forEach(oh => {
            oh.BTCustNum = oh.CustNum;

            oh.ShipToCustNum = oh.CustNum;

            oh.TermsCode = bezl.vars.selectedCustomer.TermsCode;

            oh.ShipToNum = bezl.vars.selectedShipTo.ShipToNum;

            if (bezl.vars.selectedCustomer.Attention) {
                oh.PrcConNum = bezl.vars.selectedCustomer.Attention;
            }

            if (bezl.vars.selectedShipTo.Attention) {
                oh.ShpConNum = bezl.vars.selectedShipTo.Attention;
            }

            if (bezl.vars.PONumber) {
                oh.PONum = bezl.vars.PONumber;
            }
            if (bezl.vars.OrderDate) {
                oh.OrderDate = bezl.vars.OrderDate;
            }
            if (bezl.vars.NeedBy) {
                oh.NeedByDate = bezl.vars.NeedBy;
            }
            if (bezl.vars.ShipBy) {
                oh.RequestDate = bezl.vars.ShipBy; 
            }

            if (bezl.vars.ShipVia) {
                oh.ShipViaCode = bezl.vars.ShipVia;
            }

            if (bezl.vars.OrderComment) {
                oh.OrderComment = bezl.vars.OrderComment;
            }

            if (bezl.vars.NotifyEmail && bezl.vars.NotifyEmail != '') {
                oh.NotifyFlag = true;
                oh.NotifyEMail = bezl.vars.NotifyEmail;
            }

            if (bezl.vars.ShipToNum == 'CreateNew') {
                oh.CustAllowOTS = true;
                oh.UseOTS = true;
                oh.OTSSaveAs = 'T';
                oh.OTSShipToNum = bezl.vars.selectedShipTo.ID;
                oh.OTSName = bezl.vars.selectedShipTo.Name;
                oh.OTSAddress1 = bezl.vars.selectedShipTo.Address1;
                oh.OTSAddress2 = bezl.vars.selectedShipTo.Address2;
                oh.OTSAddress3 = bezl.vars.selectedShipTo.Address3;
                oh.OTSCity = bezl.vars.selectedShipTo.City;
                oh.OTSState = bezl.vars.selectedShipTo.State;
                oh.OTSZIP = bezl.vars.selectedShipTo.Zip;
            }

            oh.OrderHeld = true;
        });

        // This will take the structure from our bezl vars and stuff it into the ds specific to Epicor
        bezl.vars.partList.forEach(p => {
            bezl.vars.ds.OrderDtl.push({
                OpenLine: true,
                VoidLine: false,
                Company: bezl.vars.company,
                OrderNum: 0,
                OrderLine: 0,
                LineType: 'PART',
                PartNum: p.PartNum,
                LineDesc: p.PartDescription,
                OrderComment: p.Comment,
                IUM: p.UOM,
                RevisionNum: '',
                SellingQuantity: p.Qty,
                UnitPrice: p.UnitPrice,
                DocUnitPrice: p.UnitPrice,
                MktgCampaignID: 'CURR',
                MktgEvntSeq: 1,
                CustNum: bezl.vars.selectedCustomer.CustNum,
                LockQty: false,
                RowMod: 'U',
                ShortChar10: ''
            })
        });
        // Now we will submit the order for processing
        bezl.dataService.add('submitOrder','brdb','Epicor10','SalesOrder_SubmitNewOrder',
                            { "Connection": bezl.vars.connection, 
                            "Company": bezl.vars.company, 
                            "ds": JSON.stringify(bezl.vars.ds)
                            },0);

        bezl.vars.submitOrder = true;

    }

    return {
        newOrder: NewOrder,
        submitOrder: SubmitOrder
    }
});