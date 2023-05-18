<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import { dev } from "$app/environment";
    import {
        Button,
        Table,
        Alert
    } from "sveltestrap";    
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
    let message = "";
    let color_alert;
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
        if(status == 404){
            message = `No existe ningún recurso para la provincia: ${updatedMks_province}, en el año: ${updatedMks_year}.`;
            color_alert = "danger";
            setTimeout(() => {
                message = "";
                color_alert = "";
            }, 3200);
        }else{
            if(status == 400){
                message = "Ha habido un error en la petición";
                color_alert = "danger";
                setTimeout(() => {
                message = "";
                color_alert = "";
                }, 3200);
            }
        }
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
                pib_current_price: parseFloat(updatedMks_pib_current_price),
                pib_percentage_structure: parseFloat(updatedMks_pib_percentage_structure),
                pib_variation_rate: parseFloat(updatedMks_pib_variation_rate),
            }),
        });
        const status = await res.status;
        resultStatus = status;
        if (status == 200) {
            message = "Recurso actualizado correctamente";
            color_alert = "success";
            getMks_one();
            setTimeout(() => {
                message = "";
                color_alert = "";
            }, 3200);
        }else{
            if(status == 404){
            message = `No existe ningún recurso para la provincia: ${updatedMks_province}, en el año: ${updatedMks_year}.`;
            color_alert = "danger";
            setTimeout(() => {
                message = "";
                color_alert = "";
            }, 3200);
            }else{
                if(status == 400){
                    message = "Ha habido un error en la petición";
                    color_alert = "danger";
                    setTimeout(() => {
                        message = "";
                        color_alert = "";
                    }, 3200);
                }else{
                    if(status == 409){
                        message = "La provincia tiene que ser de Andalucía";
                        color_alert = "danger";
                        setTimeout(() => {
                            message = "";
                            color_alert = "";
                        }, 3200);
                    }
                }
            }
        }
    }
        
</script>
<main>
    <div class="container" style="margin-top: 1%;">
        <div class="row" style="margin-bottom: 1%;">
            <div class="col-md-6">
                <h4>
                    Detalles del recurso
                    <Button color="info" on:click><a href="/market-prices-stats">Volver</a></Button>
                </h4>
            </div>
            <div class="col-md-6">
                {#if message != ""}
                    <Alert color={color_alert}>{message}</Alert>
                {/if}
            </div>
        </div>
        <Table  bordered striped>
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
    </div>
</main>



<style>
    a {
        text-decoration: none;
        color: white;
    }
    th {
        background-color: #1e90ff;
        color: white;
        font-weight: bold;
    }
</style>