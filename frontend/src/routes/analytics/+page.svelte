<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>
<script>
    //@ts-nocheck
    import { onMount } from 'svelte';
    import { dev } from "$app/environment";

    let data_marketprice = [];
    let data_workingplace = [];
    let data = [];
    
    let API = "/api/";

    if (dev) API = "http://localhost:12345" + API;

    onMount(async () => {
        await getData_marketprice();
    });
    /*type data of working place
        {
            "province": "Cádiz",
            "year": 2012,
            "work_place": 379486,
            "percentage_structure": 13.50658466,
            "variation_rating": -4.338334644
        }
    */
    async function getData_marketprice(){
        const res = await fetch(API+'v3/market-prices-stats', {
            method: "GET",
        });
        try{
            const dataReceived = await res.json();
            data_marketprice = dataReceived;
            await getData_workingplace();
        }catch(error){
            console.log(error);
        }      
    }
    async function getData_workingplace(){
        await fetch(API+'v2/workingplaces-stats/loadInitialData', {
            method: "GET",
        });
        const res = await fetch(API+'v2/workingplaces-stats', {
            method: "GET",
        });
        try{
            const dataReceived = await res.json();
            data_workingplace = dataReceived;
            data = await mixData(data_marketprice, data_workingplace);
            const provinces = [...new Set(data.map(item => item.province))];
            const years = [...new Set(data.map(item => item.year))];
            const seriesData = provinces.map(province => {
                const provinceData = data.filter(item => item.province === province);
                return {
                    name: province,
                    data: years.map(year => {
                        const yearData = provinceData.find(item => item.year === year);
                        return yearData ? yearData.work_place : null;
                    })
                };
            });
            await loadChartData(years, seriesData);
        }catch(error){
            console.log(error);
        }      
    }
    async function mixData(data_marketprice, data_workingplace){
        let data_mixed = [];
        for (var i = 0; i < data_marketprice.length; i++) {
            for (var j = 0; j < data_workingplace.length; j++) {
                if (data_marketprice[i].province == data_workingplace[j].province && data_marketprice[i].year == data_workingplace[j].year){
                    data_mixed.push({
                        "province": data_marketprice[i].province,
                        "year": data_marketprice[i].year,
                        "pib_percentage_structure": data_marketprice[i].pib_percentage_structure,
                        "pib_variation_rate": data_marketprice[i].pib_variation_rate,
                        "pib_current_price": data_marketprice[i].pib_current_price,
                        "work_place": data_workingplace[j].work_place,
                    });
                }
            }
        }
        data_mixed.sort(function(a, b) {
            return a.year - b.year;
        });
        return data_mixed;
    }
    async function loadChartData(years, seriesData) {
        Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Precios de mercado y puestos de trabajo por provincia y años combinado'
            },
            xAxis: {
                categories: years,
                crosshair: true
            },
            yAxis: {
                title: {
                text: 'Puestos de trabajo'
                }
            },
            tooltip: {
                formatter: function () {
                const point = this.point;
                const year = this.x;
                const provinceData = data.find(item => item.province === point.series.name && item.year === year);
                const pibCurrentPrice = provinceData ? provinceData.pib_current_price.toFixed(2) + '€' : '-';
                const pibPercentageStructure = provinceData ? provinceData.pib_percentage_structure.toFixed(2) + '%' : '-';
                const pibVariationRate = provinceData ? provinceData.pib_variation_rate.toFixed(2) + '%' : '-';
                return `<b>${point.series.name}</b><br>` +
                        `Year: ${year}<br>` +
                        `Work places: ${point.y.toLocaleString()}<br>` +
                        `PIB: ${pibCurrentPrice}<br>` +
                        `PIB percentage structure: ${pibPercentageStructure}<br>` +
                        `PIB variation rate: ${pibVariationRate}`;
                }
            },
            series: seriesData
        });
    }
   
    
</script>   
<main>
    <figure class="highcharts-figure">
        <div id="container"></div>
    </figure>
</main>