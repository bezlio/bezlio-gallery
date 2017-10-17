define(["./app.js"], function (app) {
 
    function OnDataChange (bezl) {
        if (bezl.data.SummaryData != null && bezl.data.SummaryData.length > 0) {
                   
            // First loop through the data to come up with a few of the summary items we need to build the chart
            var maxAge = 0;
            var totalCost = 0;
            var locations = [];
            bezl.data.SummaryData.forEach(d => {   
                if (d.Age > maxAge) {
                    maxAge = d.Age;
                }

                var existing = locations.find(l => l.name == d.Location);
                if (!existing) {
                    locations.push({name: d.Location, totalCost: Math.round(d.Cost), data: [ { label: d.Product, value: d.Cost, sValue: d.Age } ]});
                } else {
                    existing.totalCost += d.Cost;
                    existing.data.push({ label: d.Product, value: Math.round(d.Cost), sValue: d.Age });
                }

                totalCost += d.Cost;
            });

            // Now set up the chart object how we want it
            bezl.vars.dataSource = {
            chart: {
                animation: 0,
                hideTitle: 1,
                plotToolText: '<div><b>$label</b><br/> <b>Cost: </b>$$dataValue<br/><b>Age: </b>$svalue days</div>',
                spacex: 0,
                spacey: 0,
                horizontalPadding: 1,
                verticalPadding: 1,
                hoveronallsiblingleaves: 1,
                plotborderthickness: .5,
                plotbordercolor: '666666',
                legendpadding: 0,
                legendItemFontSize: 10,
                legendItemFontBold: 1,
                showLegend: 1,
                legendPointerWidth: 8,
                legenditemfontcolor: '3d5c5c',
                algorithm: 'squarified',
                legendScaleLineThickness: 0,
                legendCaptionFontSize: 10,
                legendaxisbordercolor: 'bfbfbf',
                legendCaption: 'Age (Days)',
                theme: 'zune'
            },
            colorrange: {
                mapbypercent: 0,
                gradient: 1,
                minvalue: 0,
                code: 'ffffff',
                startlabel: 'Newer',
                endlabel: 'Older',
                color: [
                {
                    code: 'e24b1a',
                    maxvalue: maxAge,
                    label: 'AVERAGE'
                }
                ]
            },
            data: [
                {
                label: 'Total',
                fillcolor: "8c8c8c",
                value: totalCost,
                data: []
                }
            ]
            };

            // Next add in each location and its data
            locations.forEach(l => {
            bezl.vars.dataSource.data[0].data.push({
                label: l.name,
                value: l.totalCost,
                data: l.data
            });
            }); 
        
        
            try {
                FusionCharts.options.SVGDefinitionURL = 'absolute';
                if  (FusionCharts('d7b7e0b1-484e-441d-bd35-3946773136cc')) {
                    FusionCharts('d7b7e0b1-484e-441d-bd35-3946773136cc').dispose();
                } 

                bezl.vars.chart = new FusionCharts ({
                    type: 'treemap',
                    renderAt: $(bezl.container.nativeElement).find("#chartContainer")[0],
                    width: '100%',
                    height: (($(bezl.container.nativeElement)[0].clientHeight > 300) ? $(bezl.container.nativeElement)[0].clientHeight - 85 : 300),
                    id: 'd7b7e0b1-484e-441d-bd35-3946773136cc',
                    dataFormat:'json',
                    dataSource: bezl.vars.dataSource
                }).render();

                // Prevent the drill-down logic as it is too taxing on mobile devices
                bezl.vars.chart.addEventListener("beforeDrillDown", function(eventObj, dataObj) {
                    eventObj.preventDefault();
                    eventObj.stopPropagation();
                });
            }
            catch(err) {
                console.log(err);
            }
        
            bezl.vars.refreshing = false;
        }
    }
  
    return {
        onDataChange: OnDataChange
    }
});
