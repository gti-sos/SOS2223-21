<script>
    // @ts-nocheck

    import { onMount } from "svelte";
    import { dev } from "$app/environment";
    import {
        Modal,
        ModalBody,
        ModalHeader,
        ModalFooter,
        Button,
        Table,
        Alert, Col, Row
    } from "sveltestrap";    
    import { page } from "$app/stores";

    onMount(async () => {
        getData_Spef();
    });
    let open = false;
    const toggle = () => (open = !open);

    let province = $page.params.province;
    let year = $page.params.year;

    let API = "/api/v2/workingplaces-stats" + "/" + province + "/" + year;

    if (dev) API = "http://localhost:12345" + API;

    let ac_province = province;
    let ac_year = year;
    let ac_work_place = "";
    let ac_percentage_structure = "";
    let ac_variation_rating = "";

    let message = "";
    let color_alert;
    let result = "";
    let resultStatus = "";


    async function getData_Spef() {
        resultStatus = result = "";
        const res = await fetch(API, {
            method: "GET",
        });
        try {
            const data = await res.json();
            result = JSON.stringify(data, null, 2);
            ac_province = data.province;
            ac_year = data.year;
            ac_work_place = data.work_place;
            ac_percentage_structure = data.percentage_structure;
            ac_variation_rating = data.variation_rating;
        } catch (error) {
            console.log(`Error parsing result: ${error}`);
        }
        const status = await res.status;
        resultStatus = status;
        if(status == 404){
            message = `No existe ningún recurso para la provincia: ${ac_province}, en el año: ${ac_year}.`;
            color_alert = "danger";
        }else{
            if(status == 400){
                message = "Ha habido un error en la petición";
                color_alert = "danger";
            }
        }
    }

    function volverAtras (){
        return history.back()
    }

    async function actualizaDATA() {
        resultStatus = result = "";
        const res = await fetch(API, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                province: ac_province,
                year: ac_year,
                work_place: ac_work_place,
                percentage_structure: ac_percentage_structure,
                variation_rating: ac_variation_rating,
            }),
        });
        const status = await res.status;
        resultStatus = status;
        if (status == 200) {
            message = "Recurso actualizado correctamente";
            color_alert = "success";
            open = false;
            getData_Spef();
        }else{
            if(status == 404){
            message = `No hay ningún recurso para esta provincia y este año.`;
            color_alert = "danger";
            }else{
                if(status == 400){
                    message = "Ha ocurrido un fallo en la aplicacion";
                    color_alert = "danger";
                }else{
                    if(status == 409){
                        message = "La provincia debe estar dentro de Andalucia";
                        color_alert = "danger";
                    }
                }
            }
        }
    }
        
</script>

    <div class="cabecera">
    <Row >
            <h2>
                Actualizacion del Recurso 
                <Button color="primary" on:click={volverAtras}>Volver Atras</Button>
                <Modal isOpen={open} {toggle}>
                    <ModalHeader {toggle}>Procede a la actualización de los datos de este recurso</ModalHeader>
                    <ModalBody>¿Esta seguro de realizar esta acción?</ModalBody>
                    <ModalFooter>
                        <Button color="secondary" on:click={actualizaDATA}>Proceder</Button>
                        <Button color="secondary" on:click={toggle}>Cancelar</Button>
                    </ModalFooter>
                </Modal>
            </h2>
    </Row>
    <Row> 
            {#if message != ""}
            <Alert fade={true} color={color_alert} dismissible>{message}</Alert>
        {/if}
    </Row>
    
</div>
<div  class = "wp">
    <Table>
        <thead>
            <tr>
                <th>Provincia</th>
                <th>Año</th>
                <th>Lugares De Trabajo</th>
                <th>Estructura porcentual</th>
                <th>Tasas de variación</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><input bind:value={ac_province} style="color: #888;" /></td>
                <td><input bind:value={ac_year} style="color: #888;" /></td>
                <td><input bind:value={ac_work_place} style="color: #888;" /></td>
                <td><input bind:value={ac_percentage_structure} style="color: #888;" /></td>
                <td><input bind:value={ac_variation_rating} style="color: #888;" /></td>
                <td><Button color="primary" on:click={toggle}>Actualizar</Button></td>
            </tr>
        </tbody>
    </Table>
</div>
<style>
    a {
        text-decoration: none;
        color: black;
    }
    .perso {
        color: #1e90ff;
    }
    .perso:hover {
        color: rgb(21, 41, 124);
        text-decoration: underline;
    }
    h2 {
        margin-left: 2%;
        margin-top: 0.5%;
    }
    .cabecera {
        display: flex;
        justify-content: center;
        align-items: center;

        width: 100%; /* 100% del ancho de la pantalla */
    }
    .wp {
        margin-left: 8.5%;
        margin-right: 8.5%;
    }
    .colordefault{

    }
    
</style>