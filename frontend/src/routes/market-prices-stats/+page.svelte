<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import { dev } from "$app/environment";

    let API = "/api/v1/market-prices-stats";

    if (dev) API = "http://localhost:12345" + API;

    let mks = [];

    let result = "";
    let resultStatus = "";

    async function getMks() {
        resultStatus = result = "";
        const res = await fetch(API, {
            method: "GET",
        });
        try {
            const data = await res.json(); //dats siendo objeto
            result = JSON.stringify(data, null, 2);
            mks = data;
        } catch (error) {
            console.log(`Error parsing result: ${error}`);
        }
        const status = await res.status;
        resultStatus = status;
    }
    //cuando cargue al componente que llame a la funcion
    onMount(async () => {
        getMks();
    });
</script>
<h1>Market-prices-stats</h1>
<ul>
    {#each mks as mks}
        <li>{mks.name}</li>
    {/each}
</ul>

{#if resultStatus != ""}
    <p>Result:</p>
    <pre>
    {resultStatus}
    {result}
        </pre>
{/if}
