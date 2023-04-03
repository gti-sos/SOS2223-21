<script>
    // @ts-nocheck

    import { onMount } from "svelte";
    import { dev } from "$app/environment";
    import { Button, Table } from "sveltestrap";

    onMount(async () => {
        getMks();
    });

    let API = "/api/v2/market-prices-stats";

    if (dev) API = "http://localhost:12345" + API;

    let mks = [];
    let newMks = {
        province: "Cádiz",
        year: 2008,
        pib_current_price: 22456384.0557261,
        pib_percentage_structure: 14.333319967,
        pib_variation_rate: -0.36179259,
    };

    let result = "";
    let resultStatus = "";

    async function getMks() {
        resultStatus = result = "";
        const res = await fetch(API, {
            method: "GET",
        });
        try {
            const data = await res.json();
            result = JSON.stringify(data, null, 2);
            mks = data;
        } catch (error) {
            console.log(`Error parsing result: ${error}`);
        }
        const status = await res.status;
        resultStatus = status;
    }
    
    async function createMks() {
        resultStatus = result = "";
        const res = await fetch(API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                province: newMks.province,
                year: newMks.year,
                pib_current_price: newMks.pib_current_price,
                pib_percentage_structure: newMks.pib_percentage_structure,
                pib_variation_rate: newMks.pib_variation_rate,
            }),
        });
        const status = await res.status;
        resultStatus = status;
        if (status == 201) {
            getMks();
        }
    }
    async function deleteMks() {
        resultStatus = result = "";
        const res = await fetch(API, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                province: newMks.province,
                year: newMks.year,
                pib_current_price: newMks.pib_current_price,
                pib_percentage_structure: newMks.pib_percentage_structure,
                pib_variation_rate: newMks.pib_variation_rate,
            }),
        });
        const status = await res.status;
        resultStatus = status;
        if (status == 200) {
            getMks();
        }
    }
    async function editMks() {
        resultStatus = result = "";
        const res = await fetch(API, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                province: newMks.province,
                year: newMks.year,
                pib_current_price: newMks.pib_current_price,
                pib_percentage_structure: newMks.pib_percentage_structure,
                pib_variation_rate: newMks.pib_variation_rate,
            }),
        });
        const status = await res.status;
        resultStatus = status;
        if (status == 200) {
            getMks();
        }
    }
</script>

<h1>mks</h1>

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
            <td><input bind:value={newMks.province} /></td>
            <td><input bind:value={newMks.year} /></td>
            <td><input bind:value={newMks.pib_current_price} /></td>
            <td><input bind:value={newMks.pib_percentage_structure} /></td>
            <td><input bind:value={newMks.pib_variation_rate} /></td>
            <td><Button on:click={createMks}>Create</Button></td>
        </tr>

        {#each mks as x}
            <tr>
                <td><a href="/market-prices-stats/{x.province}/{x.year}">{x.province}</a></td>
                <td>{x.year}</td>
                <td>{x.pib_current_price}</td>
                <td>{x.pib_percentage_structure}</td>
                <td>{x.pib_variation_rate}</td>
                <td><Button on:click={deleteMks}>Delete</Button></td>
                <td><Button on:click><a href="/market-prices-stats/{x.province}/{x.year}">Edit</Button></td>
                <td>&nbsp</td>
            </tr>
        {/each}
    </tbody>
</Table>

{#if resultStatus != ""}
    <p>Depuración:</p>
    <pre>
{resultStatus}
{result}
    </pre>
{/if}
