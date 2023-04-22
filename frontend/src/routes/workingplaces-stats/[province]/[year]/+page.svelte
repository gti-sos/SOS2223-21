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
    let mensaje_visible = false;
    let message = "";
    let color_alert;
    let result = "";
    let resultStatus = "";

    function contador_mensaje() {
        let mensaje_visible = true;
        setTimeout(function() {
            message ="";
            mensaje_visible = false;
            console.log("finalziacion");
        }, 5000);
    }
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
            contador_mensaje();
        }else{
            if(status == 400){
                message = "Ha habido un error en la petición";
                color_alert = "danger";
                contador_mensaje();
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
    <Col md>
        <div class="wpcab" >
            <row>
                <h2>
                    Actualizacion de recurso 
                </h2>
            </row>
        </div>
        <div class="wpcab">
                    <Button color="primary" on:click={volverAtras}>Volver Atras</Button>
                    <Modal isOpen={open} {toggle}>
                        <ModalHeader {toggle}>Procede a la actualización de los datos de este recurso</ModalHeader>
                        <ModalBody>¿Esta seguro de realizar esta acción?</ModalBody>
                        <ModalFooter>
                            <Button color="secondary" on:click={actualizaDATA}>Proceder</Button>
                            <Button color="secondary" on:click={toggle}>Cancelar</Button>
                        </ModalFooter>
                    </Modal>
        </div>
        <div class ="mesage">
                {#if message != ""}
                    {#if mensaje_visible=true}
                        <Alert fade={true} color={color_alert}  dismissible>{message}</Alert>
                    {/if}
                {/if}
        </div>
    </Col>
    
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
                <td style="color: #888;">{ac_province}</td>
                <td style="color: #888;">{ac_year}  </td>
                <td><input bind:value={ac_work_place} style="color: #888;" /></td>
                <td><input bind:value={ac_percentage_structure} style="color: #888;" /></td>
                <td><input bind:value={ac_variation_rating} style="color: #888;" /></td>
                <td><Button color="primary" on:click={toggle}>Actualizar</Button></td>
            </tr>
        </tbody>
    </Table>
</div>
<style>
    .h2 {
        margin-left: 2%;
        margin-top: 0.5%;
    }
    .wpcab{
        margin-left: 8.5%;
        margin-right: 8.5%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .button {
    padding: 1%;
    }
    .spanp{
        margin-right: 1%;   
        margin-left: 1%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .filter-square {
        margin-top: 1.5%;
        margin-left: 8.5%;
        margin-right: 8.5%;
        background-color: #f1f1f1;
        padding: 20px;
        border: 1px solid #ccc;
    }
    .objetoscenter{
        margin-right: 1%;   
        margin-left: 1%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .butoncenter{
        margin-top: 1%;
        margin-right: 1%;   
        margin-left: 1%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .mesage {
        margin-left: 8.5%;
        margin-right: 8.5%;
        padding: 20px;
    }
    .pagina{
        margin-right: 1%;   
        margin-left: 1%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .cabecera {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%; /* 100% del ancho de la pantalla */
    }
    .pages {
        display: flex;
        justify-content: center;   
        margin-bottom: 2%; 
    }
    .wp {
        margin-left: 8.5%;
        margin-right: 8.5%;
    }
    .colordefault{
    }
    
</style>