<script>
    // @ts-nocheck

    import { onMount } from "svelte";
    import { dev } from "$app/environment";
    import { Button, Table } from "sveltestrap";
    import { page } from "$app/stores";

    onMount(async () => {
        getMks_one();
    });

    let province = $page.params.province;
    let year = $page.params.year;

    let API = "/api/v2/market-prices-stats" + "/" + province + "/" + year;

    if (dev) API = "http://localhost:12345" + API;

    let updatedMks_province = province;
    let updatedMks_year = year;
    let updatedMks_pib_current_price = "";
    let updatedMks_pib_percentage_structure = "";
    let updatedMks_pib_variation_rate = "";

    let result = "";
    let resultStatus = "";

    async function getMks_one() {
        resultStatus = result = "";
        const res = await fetch(API, {
            method: "GET",
        });
        try {
            const data = await res.json();
            result = JSON.stringify(data, null, 2);
            updatedMks_province = data.province;
            updatedMks_year = data.year;
            updatedMks_pib_current_price = data.pib_current_price;
            updatedMks_pib_percentage_structure = data.pib_percentage_structure;
            updatedMks_pib_variation_rate = data.pib_variation_rate;
        } catch (error) {
            console.log(`Error parsing result: ${error}`);
        }
        const status = await res.status;
        resultStatus = status;
    }

    async function updateMks() {
        resultStatus = result = "";
        const res = await fetch(API, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                province: updatedMks_province,
                year: updatedMks_year,
                pib_current_price: updatedMks_pib_current_price,
                pib_percentage_structure: updatedMks_pib_percentage_structure,
                pib_variation_rate: updatedMks_pib_variation_rate,
            }),
        });
        const status = await res.status;
        resultStatus = status;
        if (status == 200) {
            getMks_one();
        }
    }
</script>

<h2>Detalles del recurso</h2>

<Table>
    <thead>
        <tr>
            <th>Provincia</th>
            <th>Año</th>
            <th>PIB Precios corrientes</th>
            <th>PIB Estructura porcentual</th>
            <th>PIB Tasas de variación</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>{updatedMks_province} </td>
            <td>{updatedMks_year} </td>
            <td><input bind:value={updatedMks_pib_current_price} /></td>
            <td><input bind:value={updatedMks_pib_percentage_structure} /></td>
            <td><input bind:value={updatedMks_pib_variation_rate} /></td>
            <td><Button color="primary" on:click={updateMks}>Actualizar</Button></td>
        </tr>
    </tbody>
</Table>

{#if resultStatus != ""}
    <h6>Depuración:</h6>    
    <pre>
    {resultStatus}
{result}
    </pre>
{/if}

<style>
    h6{
        margin-left: 1%;
    }
    h2{
        margin-left: 1%;
        margin-top: 0.5%;
    }
</style>
