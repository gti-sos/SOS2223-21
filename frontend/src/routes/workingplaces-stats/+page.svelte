<script>
    // @ts-nocheck

    import { onMount } from "svelte";
    import { dev } from "$app/environment";
    import {
        Button,
        Table,
        Modal,
        ModalBody,
        ModalFooter,
        ModalHeader,
        Alert, Col, Row
    } from "sveltestrap";

    let open = false;
    const toggle = () => (open = !open && getData());

    onMount(async () => {
        getData();
    });

    let API = "/api/v2/workingplaces-stats";

    if (dev) API = "http://localhost:12345" + API;

    let dataWP = [];
    let newBody = {
        province: "",
        year: "",
        work_place: "",
        percentage_structure: "",
        variation_rating: "",
    };
    let queryparams = {
        from: "",
        to: "",
        offset: "",
        limit: "",
    };
    let message = "";
    let color_alert;
    let result = "";
    let resultStatus = "";

    async function LoadInitial() {
        resultStatus = result = "";
        const res = await fetch(API+"/loadInitialData", {
            method: "GET",
        });
        try {
            const data = await res.json();
            result = JSON.stringify(data, null, 2);
            dataWP = data;
        } catch (error) {
            console.log(`Error parsing result: ${error}`);
        }
        const status = await res.status;
        resultStatus = status;
        if (status == 400) {
            message = "Ha habido un error en la petición";
            color_alert = "danger";
        } else if (status == 200) {
            message = "Datos iniciales cargados correctamente";
            color_alert = "success";
            getData();
        } else if (status == 201){
            message = "Ya hay datos cargados";
            color_alert = "danger";
        }
    }

    async function getData() {
        var params = "?";
        let i = 0;
        for (const [key, value] of Object.entries(queryparams)) {
            
            if (i==0){
            params += key + "=" + value;
            i+=1;
            }
            else{
                params += "&" + key + "=" + value;
            }
        }

        console.log(params);
        if (queryparams){
        resultStatus = result = "";
        const res = await fetch(API+params, {
            method: "GET",
        });
        try {
            const data = await res.json();
            result = JSON.stringify(data, null, 2);
            dataWP = data;
        } catch (error) {
            console.log(`Error parsing result: ${error}`);
        }
        const status = await res.status;
        resultStatus = status;
    }else{
        resultStatus = result = "";
        const res = await fetch(API, {
            method: "GET",
        });
        try {
            const data = await res.json();
            result = JSON.stringify(data, null, 2);
            dataWP = data;
        } catch (error) {
            console.log(`Error parsing result: ${error}`);
        }
        const status = await res.status;
        resultStatus = status;

    }}


    async function createDATA() {
        resultStatus = result = "";
        const res = await fetch(API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                province: newBody.province,
                year: parseInt(newBody.year),
                work_place: newBody.work_place,
                percentage_structure: newBody.percentage_structure,
                variation_rating: newBody.variation_rating,
            }),
        });
        const status = await res.status;
        resultStatus = status;
        if (status == 201) {
            message = "Recurso creado correctamente";
            color_alert = "success";
            getData();
        }else{
            if (status == 400) {
                message = "Hay que insertar datos o hay campos vacios";
                color_alert = "danger";
            }else{
                if(status == 409){
                    message = "El recurso ya existe o la provincia no pertenece a Andalucia";
                    color_alert = "danger";
                }
            }
        }
    }
    function volverAtras (){
        return history.back()
    }
    async function deleteDATA() {
        resultStatus = result = "";
        const res = await fetch(API, {
            method: "DELETE",
        });
        const status = await res.status;
        resultStatus = status;
        if (status == 200) {
              open = false;
            getData();
            message = "Recursos borrados correctamente";
            color_alert = "success";
          
            
            
        }
    }
    async function deleteDATA_Spef(province, year) {
        resultStatus = result = "";
        const res = await fetch(API + "/" + province + "/" + year, {
            method: "DELETE",
        });
        const status = await res.status;
        resultStatus = status;
        if (status == 200) {
            getData();
            message = "Recurso borrado correctamente";
            color_alert = "success";
            
        }
    }
</script>
    <div class="cabecera">
    <Col md>
        <Row >
                <h2>
                    Puestos De Trabajo Totales de Mercado 
                    <Button color="danger" on:click={toggle}>Borrar recursos</Button>
                    <Button color="secondary" on:click={LoadInitial}>Cargar Datos Iniciales</Button>
                    <Button color="secondary" on:click={volverAtras}>Volver Atras</Button>
                    <Modal isOpen={open} {toggle}>
                        <ModalHeader {toggle}>Procede a borrar todos los datos</ModalHeader>
                        <ModalBody>¿Estás seguro?</ModalBody>
                        <ModalFooter>
                            <Button color="secondary" on:click={deleteDATA}>Proceder</Button>
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
    </Col>
</div>
<div  class = "wp">
    <Table>
        <thead>
            <tr>
                <th>From</th>
                <th>To</th>
                <th>Limit</th>
                <th>Offset</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><input placeholder="From"  bind:value={queryparams.from} style="color: #888;" /></td>
                <td><input placeholder="To"  bind:value={queryparams.to} style="color: #888;" /></td>
                <td><input placeholder="Limit"  bind:value={queryparams.limit} style="color: #888;" /></td>
                <td><input placeholder="Offset"  bind:value={queryparams.offset} style="color: #888;" /></td>
                <td><Button color="primary" on:click={getData}
                        >Filtrar</Button></td>
            </tr>
        </tbody>
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
                <td><input placeholder="Provincia"  bind:value={newBody.province} style="color: #888;" /></td>
                <td><input placeholder="Año" bind:value={newBody.year} style="color: #888;" /></td>
                <td><input placeholder="Puestos de Trabajo" bind:value={newBody.work_place} style="color: #888;" /></td>
                <td><input placeholder="Estructura porcentual" bind:value={newBody.percentage_structure} style="color: #888;" /></td>
                <td><input placeholder="Tasas de variación" bind:value={newBody.variation_rating} style="color: #888;" /></td>
                <td><Button color="primary" on:click={createDATA}
                        >Crear</Button></td>
            </tr>

            {#each dataWP as x}
                <tr>
                    <td><a class="cuadricula">{x.province}</a></td>
                    <td>{x.year}</td>
                    <td>{x.work_place}</td>
                    <td>{x.percentage_structure}</td>
                    <td>{x.variation_rating}</td>
                    <td
                        ><Button
                            color="danger"
                            on:click={deleteDATA_Spef(x.province, x.year)}
                            >Borrar</Button
                        ></td
                    >
                    <td><Button on:click><a href="/workingplaces-stats/{x.province}/{x.year}">Editar</a></Button></td>
                </tr>
            {/each}
        </tbody>
    </Table>
</div>
<style>
    a {
        text-decoration: none;
        color: white;
    }
    .cuadricula {
        color: #1e90ff;
    }
    .cuadricula:hover {
        color: rgb(21, 41, 124);
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
