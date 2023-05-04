<svelte:head>
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/morris.js/0.5.1/morris.css">
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/raphael/2.1.0/raphael-min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/morris.js/0.5.1/morris.min.js"></script>
</svelte:head>
<script>
    //@ts-nocheck
    import { onMount } from 'svelte';
    import { dev } from "$app/environment";

    let data = [];
    let result ="";
    
    let API = "/api/v2/market-prices-stats/graph";
    if (dev) API = "http://localhost:12345" + API;

    async function getData(){
        const res = await fetch(API, {
            method: "GET",
        });
        try{
            const dataReceived = await res.json();
            result = JSON.stringify(dataReceived, null, 2);
            data = dataReceived;
            // Get unique list of provinces and years
            const provinces = [...new Set(data.map(item => item.province))];
            const years = [...new Set(data.map(item => item.year))];
            // Create series data for each province
            const seriesData = provinces.map(province => {
                const provinceData = data.filter(item => item.province === province);
                return {
                    name: province,
                    data: years.map(year => {
                        const yearData = provinceData.find(item => item.year === year);
                        return yearData ? yearData.pib_current_price : null;
                    })
                };
            });
            loadChartData(provinces, years, seriesData);
        }catch(error){
            console.log(error);
        } 
       
    }
    async function loadChartData() {
        Morris.Line({
            // ID of the element in which to draw the chart.
            element: 'container',
            // Chart data records -- each entry in this array corresponds to a point on
            // the chart.
            data: [
                { year: '2008', value: 20 },
                { year: '2009', value: 10 },
                { year: '2010', value: 5 },
                { year: '2011', value: 5 },
                { year: '2012', value: 20 }
            ],
            // The name of the data record attribute that contains x-values.
            xkey: 'year',
            // A list of names of data record attributes that contain y-values.
            ykeys: ['value'],
            // Labels for the ykeys -- will be displayed when you hover over the
            // chart.
            labels: ['Value']
        });
    }
    onMount(async () => {
        getData();
    });
    
</script>   
<main>
    <div id="container" style="height: 250px;"></div>
</main>