<svelte:head>
    <link rel="stylesheet" href="//cdn.jsdelivr.net/chartist.js/latest/chartist.min.css">
    <script src="https://cdn.jsdelivr.net/chartist.js/latest/chartist.min.js"></script>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>
<script>
    import axios from 'axios';
    import { onMount } from 'svelte';
    import { dev } from "$app/environment";


    let data = [];
    let result ="";

    let yearsm = [];
    let datam = [];
    let provinces = [];
    const provinc =["Andalucía", "Jaén", "Almería", "Sevilla", "Huelva", "Málaga", "Cádiz", "Córdoba", "Granada"];
    let total;
    let provincia = '';


    let API_KEY="AOzAKuZ3990S8VmtMZNyR95wF";
    let API_KEY_SECRET="4ULlw9W6BA8w5BB12GkLn1JgJlHLdu5Gu8t4RRsbd7fF1YMJuQ"
    
    let Bearer_Token="AAAAAAAAAAAAAAAAAAAAAM56nQEAAAAAq1h4XuQI%2Fc0Y9a7AOiXfalBlXM8%3D8GJLI7zX4KN0XPXXrDEzqFQPe6JHkQmQGS5l06ucyxMqluZTuf"
    let Access_Token="1655988662847385601-4MEUQhWTmcniw9eFz8zXOvOmzf8Wsn"

    let Access_Token_Secret="SIavPCJs28dar46mxOHSCGKVsobbY4h5r0nkIcx5IGhFk"

    let clientId = "dzE1ajJWSkpsWnVmMUxySTliOGE6MTpjaQ";
    let client_secret = "BODZ_3PwiNC5uXmNvjPktxFcS3YhpwJJxb02LQabrmhpXc1MAj";

    let API = "/api/v2/workingplaces-stats/graph";
    
    if (dev) API = "http://localhost:12345" + API;

    let chart;

    onMount(async () => {
        console.log("no entra")
        getDatas();
           })
 
    function getDatas(){
        const API_ENDPOINT = 'https://api.twitter.com/1.1/statuses/home_timeline.json';
        

        const oauth = {
            consumer_key: API_KEY,
            consumer_secret: API_KEY_SECRET,
            token: Access_Token,
            token_secret: Access_Token_Secret,
        };

        const options = {
            params: {
            count: 10
            },
            headers: {
            Authorization: `Bearer ${Bearer_Token}`
            }
        };

        axios.get(API_ENDPOINT, options)
            .then(response => {
            console.log(response.data);
            })
            .catch(error => {
            console.error(error);
            });
    }

   


   
    
</script>   
<main>

</main>
<style>
.centrado {
        margin-top: 1.5%;
        margin-left: 8.5%;
        margin-right: 8.5%;
        background-color: #f1f1f1;
        padding: 20px;
        border: 1px solid #ccc;
    }
</style>