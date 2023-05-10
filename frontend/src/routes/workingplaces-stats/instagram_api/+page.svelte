<svelte:head>
    <link rel="stylesheet" href="//cdn.jsdelivr.net/chartist.js/latest/chartist.min.css">
    <script src="https://cdn.jsdelivr.net/chartist.js/latest/chartist.min.js"></script>
</svelte:head>
<script>
    import axios from 'axios';
    import { onMount } from 'svelte';
    import { Buffer } from 'buffer';
    import { dev } from "$app/environment";


    let data = [];
    let result ="";

    let yearsm = [];
    let datam = [];
    let provinces = [];
    const provinc =["Andalucía", "Jaén", "Almería", "Sevilla", "Huelva", "Málaga", "Cádiz", "Córdoba", "Granada"];
    let total;
    let provincia = '';


    const API_KEY="AOzAKuZ3990S8VmtMZNyR95wF";
    const API_KEY_SECRET="4ULlw9W6BA8w5BB12GkLn1JgJlHLdu5Gu8t4RRsbd7fF1YMJuQ"
    
    const Bearer_Token="AAAAAAAAAAAAAAAAAAAAAM56nQEAAAAAq1h4XuQI%2Fc0Y9a7AOiXfalBlXM8%3D8GJLI7zX4KN0XPXXrDEzqFQPe6JHkQmQGS5l06ucyxMqluZTuf"
    const Access_Token="1655988662847385601-4MEUQhWTmcniw9eFz8zXOvOmzf8Wsn"

    const Access_Token_Secret="SIavPCJs28dar46mxOHSCGKVsobbY4h5r0nkIcx5IGhFk"

    const clientId = "dzE1ajJWSkpsWnVmMUxySTliOGE6MTpjaQ";
    const clientSecret = "BODZ_3PwiNC5uXmNvjPktxFcS3YhpwJJxb02LQabrmhpXc1MAj";

    let API = "/api/v2/workingplaces-stats/graph";
    
    if (dev) API = "http://localhost:12345" + API;

    let chart;

    onMount(async () => {
        console.log("no entra")
        getDatas();
           })
 
    function getDatas(){
        const getTokenEndpoint = "https://api.twitter.com/oauth2/token";

        const authString = `${clientId}:${clientSecret}`;
        const authEncoded = Buffer.from(authString).toString('base64');

        const headers = {
        "Authorization": `Basic ${authEncoded}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        };

        const data = "grant_type=client_credentials";

        axios.post(getTokenEndpoint, data, { headers })
        .then((response) => {
            const accessToken = response.data.access_token;
            console.log(accessToken);

            // hacer una solicitud a la API de Twitter usando el token de acceso
            const endpointUrl = "https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=TwitterAPI&count=2";
            const headers = {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            };

            axios.get(endpointUrl, { headers })
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
        })
        .catch((error) => {
            console.log(error);
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