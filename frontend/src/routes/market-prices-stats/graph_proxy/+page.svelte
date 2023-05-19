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
    import {Button} from "sveltestrap";


    let data = [];
    let data_hired_people = [];
    let data_mixed = [];
    let message = "No hay datos para mostrar.";
    let result ="";
    let API_hired_people = "/api/proxy_jfs/?url=https://sos2223-23.ew.r.appspot.com/api/v2/hired-people";
    let API = "/api/v2/market-prices-stats";
    if (dev){
        API = "http://localhost:12345" + API;
        API_hired_people = "http://localhost:12345" + API_hired_people;
    }

    /*Type of data hired people
        {
            province: 'Cádiz',
            year: 2013,
            pib_percentage_structure: 13.895974721,
            pib_variation_rate: -4.897405357,
            pib_current_price: 19705098.5745508,
            gender: 'Mujeres',
            indefinite_contract: 4104,
            single_construction_contract: 12767,
            multiple_construction_contract: 4461,
            single_eventual_contract: 15074,
            multiple_eventual_contract: 10903
        }
    */
    onMount(async () => {
        await loadData();
    });
    async function loadHired(){
        await fetch(API_hired_people+'/loadInitialData', {
            method: "GET",
        });
        await loadData();
    }
    async function loadData(){
        await getData();
        await getData_hired_people();
        await mixData();
        if(data_mixed.length > 0) loadChartData(data_mixed);
        
    }
    async function mixData(){
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data_hired_people.length; j++) {
                if (data[i].province == data_hired_people[j].province && data[i].year == data_hired_people[j].year){
                    data_mixed.push({
                        "province": data[i].province,
                        "year": data[i].year,
                        "pib_percentage_structure": data[i].pib_percentage_structure,
                        "pib_variation_rate": data[i].pib_variation_rate,
                        "pib_current_price": data[i].pib_current_price,
                        "gender": data_hired_people[j].gender,
                        "indefinite_contract": data_hired_people[j].indefinite_contract,
                        "single_construction_contract": data_hired_people[j].single_construction_contract,
                        "multiple_construction_contract": data_hired_people[j].multiple_construction_contract,
                        "single_eventual_contract": data_hired_people[j].single_eventual_contract,
                        "multiple_eventual_contract": data_hired_people[j].multiple_eventual_contract
                    });
                }
            }
        }
        data_mixed = data_mixed.filter(function(d) {
            return d.pib_current_price > 20000000;
        });
        data_mixed.sort(function(a, b) {
            return a.year - b.year;
        });
    }
   
    async function getData(){
        const res = await fetch(API, {
            method: "GET",
        });
        try{
            const dataReceived = await res.json();
            result = JSON.stringify(dataReceived, null, 2);
            data = dataReceived;
        }catch(error){
            console.log(error);
        } 
       
    }async function getData_hired_people(){
        const res = await fetch(API_hired_people, {
            method: "GET",
        });
        try{
            const dataReceived = await res.json();
            result = JSON.stringify(dataReceived, null, 2);
            data_hired_people = dataReceived;
        }catch(error){
            console.log(error);
        } 
       
    }
    async function loadChartData(areas) {
        Morris.Area({
            element: 'morrischart',
            data: areas,
            xkey: 'year',
            ykeys: ['single_eventual_contract','indefinite_contract'],
            labels: [],
            fillOpacity: 0.6,
            pointFillColors:['#ffffff'],
            pointStrokeColors: ['black'],
            behaveLikeLine: true,
            parseTime: false,
            lineColors:['#1e90ff','green'],
            hoverCallback: function(index, options, content) {
                var data = options.data[index];
                var tooltip = '<div class="morris-hover-row-label">' + data.year + ", "+data.gender + '</div>';
                tooltip += '<div class="morris-hover-point" style="color: ' + options.lineColors[index % options.lineColors.length] + '">';
                tooltip += 'Contratos únicos eventuales: ' + data.single_eventual_contract + '<br>';
                tooltip += 'Contrratos indefinidos: ' + data.indefinite_contract + '<br>';
                tooltip += 'PIB: ' + data.pib_current_price.toFixed(2) + '€ <br>';
                tooltip += '</div>';
                return tooltip;
            }
        });
    }
</script>   
<main>
    <h3>Gráfico de integración entre la API hired-people utilizando proxy y market-prices-stats</h3>
    <h4>Se mostrará la comparación de <strong>contratos indefinidos</strong> y <strong>contratos únicos eventuales</strong>, separados por mujeres y hombres, en los años en los que el <strong>precio del PIB</strong> fue mayor a <strong>20 millones</strong>.</h4>

    {#if data_mixed.length === 0}
        <p>{message}</p>
    {/if}
    <div id="morrischart" style="height: 250px;"></div>
    <h5>Gráfico realizado con <a href="http://morrisjs.github.io/morris.js/index.html">Morris.js</a></h5>
    {#if data_mixed.length == 0}
        <Button on:click={loadHired} color="warning">Cargar datos</Button>
    {/if}
</main>
<style>
    main{
        margin: 0 auto;
        width: 80%;
    }
    h3,h4 {
        text-align: center;
        margin-top: 1%;
    }
    p{
        text-align: center;
        margin-top: 1%;
        background-color: #1e90ff;
        color: white;
        margin-top: 1%;
    }

</style>