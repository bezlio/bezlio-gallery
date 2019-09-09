define(function () {
    /**
     * Returns a ds of a new order for the selected customer
     * @param {Object[]} bezl - A reference to the calling Bezl
     */
    function NewOrder (bezl) {
        // I dont think we're going to do anything with this
    }

    function SubmitOrder (bezl) {
        // Set up our structure for creating the order
        bezl.vars.mergeDs = {CUSTOMER_ORDER: [
            {
                CUSTOMER_ID: bezl.vars.selectedCustomer.ID,
                SITE_ID: bezl.vars.company
            }
        ]}

        bezl.vars.mergeDs.CUSTOMER_ORDER.forEach( oh => {
            if (bezl.vars.PONumber) {
                oh.CUSTOMER_PO_REF = bezl.vars.PONumber;
            }
            if (bezl.vars.OrderDate) {
                oh.ORDER_DATE = bezl.vars.OrderDate;
            }
            if (bezl.vars.NeedBy) {
                oh.PROMISE_DATE = bezl.vars.NeedBy;
            }
            if (bezl.vars.ShipBy) {
                oh.DESIRED_SHIP_DATE = bezl.vars.ShipBy; 
            }

            if (bezl.vars.ShipVia) {
                oh.SHIP_VIA = bezl.vars.ShipVia;
            }

        })

        var parms = [];
        // Add the default load, empty because we are creating a new order
        parms.push({ "Key": "Load", "Value": JSON.stringify({customerID: ""}) });

        // Add a new order row
        parms.push({ "Key": "NewOrderRow", "Value": JSON.stringify({orderID: "<1>"}) });
        // This will take the structure from our bezl vars and stuff it into the ds specific to Visual

        // Create our order line table
        bezl.vars.mergeDs.CUST_ORDER_LINE = [];

        bezl.vars.partList.forEach(p => {
            // Add a new line in the chain
            parms.push({ "Key": "NewOrderLineRow", "Value": JSON.stringify({orderID: "<1>"}) });
            // Add our values to the merge DS
            bezl.vars.mergeDs.CUST_ORDER_LINE.push({
                PART_ID: p.PartNum,
                ORDER_QTY: p.Qty,
                USER_ORDER_QTY: p.Qty
            })
        });

        parms.push({ "Key": "MergeDataSet", "Value": JSON.stringify(bezl.vars.mergeDs) });
        parms.push({ "Key": "Save", "Value": JSON.stringify({}) });
        // Now we will submit the order for processing
        bezl.dataService.add('submitOrder','brdb','Visual8','ExecuteBOMethod',
        { "Connection": bezl.vars.connection, "BOName": "Lsa.Vmfg.Sales.CustomerOrder",
        "Parameters": parms },0);

        bezl.vars.submitOrder = true;

    }

    return {
        newOrder: NewOrder,
        submitOrder: SubmitOrder
    }
});