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
    let message = "";
    let result ="";

    let API_jobs = "https://sos2223-22.appspot.com/api/v2/jobs-companies-innovation-stats";
    let API = "/api/v2/workingplaces-stats/graph";

    if (dev){
        API = "http://localhost:12345" + API;
        API_jobs = "http://localhost:12345" + API_jobs;
    }

    /*
    Type of data hired people
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
       
    }
    
</script>   
<main>
    <h3>Gráfico de integración entre la API hired-people utilizando proxy y market-prices-stats</h3>
    <h4>Se mostrará la comparación de <strong>contratos indefinidos</strong> y <strong>contratos únicos eventuales</strong>, separados por mujeres y hombres, en los años en los que el <strong>precio del PIB</strong> fue mayor a <strong>20 millones</strong>.</h4>

    {#if message != ""}
        <p>{message}</p>
    {/if}
    <div id="morrischart" style="height: 250px;"></div>
    <h5>Gráfico realizado con <a href="http://morrisjs.github.io/morris.js/index.html">Morris.js</a></h5>

</main>
<style>

</style>