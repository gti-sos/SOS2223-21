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
    
    let API = "/api/v2/market-prices-stats";
    if (dev) API = "http://localhost:12345" + API;

    onMount(async () => {
        await getData();
    });
    async function getData(){
        const res = await fetch(API, {
            method: "GET",
        });
        try{
            const dataReceived = await res.json();
            result = JSON.stringify(dataReceived, null, 2);
            data = dataReceived;
            const seriesData = data.filter(x => x.year == 2010);
            loadChartData(seriesData);
        }catch(error){
            console.log(error);
        } 
       
    }
    async function loadChartData(seriesData) {
        Morris.Line({
            element: 'morrischart',
            data: seriesData,
            xkey: 'province',
            ykeys: ['pib_current_price'],
            labels: [],
            lineColors: ['#1e90ff'],
            pointFillColors: ['#15297c'],
            parseTime: false,
            hoverCallback: function(index, options) {
                var data = options.data[index];
                var tooltip = '<div class="morris-hover-row-label">' + data.province + ", "+data.year + '</div>';
                tooltip += '<div class="morris-hover-point" style="color: ' + options.lineColors[index % options.lineColors.length] + '">';
                tooltip += 'PIB: ' + data.pib_current_price.toFixed(2) + '€ <br>';
                tooltip += 'Porcentaje de estructura: ' + data.pib_percentage_structure.toFixed(2) + '%<br>';
                tooltip += 'Tasa de variación: ' + data.pib_variation_rate.toFixed(2) + '%<br>';
                tooltip += '</div>';
                return tooltip;
            }
        });
    }
   
    
</script>   
<main>
    <h3>Gráfico que muestra la diferencia del precio del PIB de Andalucía por provincia en el año 2010</h3>
    <div id="morrischart" style="height: 250px;"></div>
    <h5>Gráfico realizado con <a href="http://morrisjs.github.io/morris.js/index.html">Morris.js</a></h5>

</main>
<style>
    main{
        margin: 0 auto;
        width: 80%;
    }
    h3{
        text-align: center;
        margin-top: 1%;
    }

</style>