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
    let year = parseInt($page.params.year);

    let API = "/api/v2/market-prices-stats" + "/" + province + "/" + year;

    if (dev) API = "http://localhost:12345" + API;

    let updatedMks_province = province;
    let updatedMks_year = year;
    let updatedMks_pib_current_price = 0;
    let updatedMks_pib_percentage_structure = 0;
    let updatedMks_pib_variation_rate = 0;

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

<h1>Resource details</h1>

<Table>
    <thead>
        <tr>
            <th>Province</th>
            <th>Year</th>
            <th>PIB Current Price</th>
            <th>PIB Percentage Structure</th>
            <th>PIB Variation Rate</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>{updatedMks_province} </td>
            <td>{updatedMks_year} </td>
            <td><input bind:value={updatedMks_pib_current_price} /></td>
            <td><input bind:value={updatedMks_pib_percentage_structure} /></td>
            <td><input bind:value={updatedMks_pib_variation_rate} /></td>
            <td><Button on:click={updateMks}>Update</Button></td>
        </tr>
    </tbody>
</Table>

{#if resultStatus != ""}
    <p>Depuración:</p>
    <pre>
{resultStatus}
{result}
    </pre>
{/if}
