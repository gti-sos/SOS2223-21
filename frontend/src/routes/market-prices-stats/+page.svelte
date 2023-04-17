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

    let visible = true;
    let open = false;
    const toggle = () => ( open = !open );

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
    let search_province = "";
    let search_year = "";
    let search = {
        pib_current_price_lower: "",
        pib_current_price_over: "",
        pib_percentage_structure_lower: "",
        pib_percentage_structure_over: "",
        pib_variation_rate_lower: "",
        pib_variation_rate_over: "",
        from: "",
        to: "",
    }
    let message = "";
    let color_alert;
    let result = "";
    let resultStatus = "";
    let pagina = 1; 

    async function getMks() {
        let limit = 10;
        let offset = (pagina - 1) * limit;
        let query = `?limit=${limit}&offset=${offset}`;
        var params = query;
        var params_ids = "";
        for (const [key, value] of Object.entries(search)) {     
                    if (value != ""){
                    params += "&" + key + "=" + value;}
        }
        resultStatus = result = "";
        if(search_province && search_year){
            params_ids = "/" + search_province + "/" + search_year + params;
        }else{
            if(search_province){
                params_ids = "/" + search_province + params;
            }else{
                if(search_year){
                    params_ids = params + "&year=" + search_year ;
                }else{
                    params_ids = params;
                }
            }
        }
        const res = await fetch(API + params_ids, {
            method: "GET",
        });
        try {
            const data = await res.json();
            result = JSON.stringify(data, null, 2);
            if(!Array.isArray(data)){
                mks = [data];
            }else{
                mks = data;
            }
        } catch (error) {
            console.log(`Error parsing result: ${error}`);
        }
        const status = await res.status;
        resultStatus = status;
        if (status == 400) {
            message = "Ha habido un error en la petición";
            color_alert = "danger";
        }
        if (status == 500) {
            message = "Ha habido un error en la petición";
            color_alert = "danger";
        }
        if (status == 404) {
            message = "No se ha encontrado el recurso";
            color_alert = "danger";
        }
        open = false;
    }
    async function loadInitialData() {
        resultStatus = result = "";
        const res = await fetch(API+"/loadInitialData", {
            method: "GET",
        });
        const status = await res.status;
        resultStatus = status;
        if (status == 500) {
            message = "Ha habido un error en la petición";
            color_alert = "danger";
        }
        if (status == 201) {
            message = "Datos iniciales cargados correctamente";
            color_alert = "success";
            getMks();
        } 
        if (status == 400){
            message = "Ya hay datos cargados";
            color_alert = "danger";
        }
        open = false;
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
                year: parseInt(newMks.year),
                pib_current_price: newMks.pib_current_price,
                pib_percentage_structure: newMks.pib_percentage_structure,
                pib_variation_rate: newMks.pib_variation_rate,
            }),
        });
        const status = await res.status;
        resultStatus = status;
        if (status == 201) {
            message = "Recurso creado correctamente";
            color_alert = "success";
            open = false;
            getMks();
        }else{
            if (status == 400) {
                message = "Hay que insertar datos o faltan campos";
                color_alert = "danger";
                open = false;
            }else{
                if(status == 409){
                    message = "El recurso ya existe o la provincia tiene que ser de Andalucía";
                    color_alert = "danger";
                    open = false;
                }
            }
        }
    }
    async function deleteMks() {
        resultStatus = result = "";
        const res = await fetch(API, {
            method: "DELETE",
        });
        const status = await res.status;
        resultStatus = status;
        if (status == 200) {
            message = "Recursos borrados correctamente";
            color_alert = "success";
            open = false;
            getMks();
        }
    }
    async function deleteMks_one(province, year) {
        resultStatus = result = "";
        const res = await fetch(API + "/" + province + "/" + year, {
            method: "DELETE",
        });
        const status = await res.status;
        resultStatus = status;
        if (status == 200) {
            message = "Recurso borrado correctamente";
            color_alert = "success";
            open = false;
            getMks();
        }
    }
    async function previousPage() {
        if (pagina > 1) { 
        pagina--;
        getMks()
        }else{
            message = "Estás en la primera página";
            color_alert = "danger";
            open = false;
        }
    }
    async function nextPage() {
        if (mks.length >= 10) {
            pagina++;
            getMks();
         }else{
            message = "No hay más páginas";
            color_alert = "danger";
            open = false;
         }
                      
    }
</script>
    <div class="cabecera">
    <Row >
        <Col xs="7">
            <h4>
                Producto interior bruto a precios de mercado 
                <Button color="danger" on:click={toggle}>Borrar recursos</Button>
                <Modal isOpen={open} {toggle}>
                    <ModalHeader {toggle}>Vas a borrar todos los recursos de la base de datos</ModalHeader>
                    <ModalBody>¿Estás seguro?</ModalBody>
                    <ModalFooter>
                        <Button color="primary" on:click={deleteMks}>Proceder</Button>
                        <Button color="secondary" on:click={toggle}>Cancelar</Button>
                    </ModalFooter>
                </Modal>
                <Button color="info" on:click={loadInitialData}>Cargar datos iniciales</Button>
            </h4>
        </Col>
        <Col xs="4"> 
            {#if message != ""}
                <Alert fade={true} isOpen={visible} on:keypress toggle={() => (visible = false)} color={color_alert} dismissible>{message}</Alert>
            {/if}
        </Col>
    </Row>
</div>
<Table bordered striped>
    <thead>
        <tr>
            <th>Provincia</th>
            <th>Año</th>
            <th>Desde</th>
            <th>Hasta</th>
            <th>PIB P.C menor</th>
            <th>PIB P.C mayor</th>
            <th>PIB E.P menor</th>
            <th>PIB E.P mayor</th>
            <th>PIB TdeV menor</th>
            <th>PIB TdeV mayor</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><input bind:value={search_province} /></td>
            <td><input bind:value={search_year} /></td>
            <td><input bind:value={search.from} /></td>
            <td><input bind:value={search.to} /></td>
            <td><input bind:value={search.pib_current_price_lower} /></td>
            <td><input bind:value={search.pib_current_price_over} /></td>
            <td><input bind:value={search.pib_percentage_structure_lower} /></td>
            <td><input bind:value={search.pib_percentage_structure_over} /></td>
            <td><input bind:value={search.pib_variation_rate_lower} /></td>
            <td><input bind:value={search.pib_variation_rate_over} /></td>
            <td>
                <Button color="success" on:click={getMks}>Buscar</Button>
            </td>
        </tr>
    </tbody>
</Table>
<Table bordered striped>
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
            <td><input bind:value={newMks.province} /></td>
            <td><input bind:value={newMks.year} /></td>
            <td><input bind:value={newMks.pib_current_price} /></td>
            <td><input bind:value={newMks.pib_percentage_structure} /></td>
            <td><input bind:value={newMks.pib_variation_rate} /></td>
            <td><Button color="primary" on:click={createMks}>Crear recurso</Button></td>
        </tr>
        {#each mks as x}
            <tr>
                <td><a class="perso" href="/market-prices-stats/{x.province}/{x.year}">{x.province}</a></td>
                <td>{x.year}</td>
                <td>{x.pib_current_price}</td>
                <td>{x.pib_percentage_structure}</td>
                <td>{x.pib_variation_rate}</td>
                <td><Button color="danger" on:click={deleteMks_one(x.province, x.year)}>Borrar</Button></td>
                <td><Button on:click><a href="/market-prices-stats/{x.province}/{x.year}">Editar</a></Button></td>
                <td>&nbsp</td>
            </tr>
        {/each}
    </tbody>
</Table>

<div class="cabecera">
    <Row>
        <Col xs="5">
        </Col>
        <Col xs="4">
            <Button on:click={previousPage}>&lt;</Button>
            <span>Página: {pagina}</span>
            <Button on:click={nextPage}>&gt;</Button>
        </Col>
    </Row>
</div>

<style>
    a {
        text-decoration: none;
        color: white;
    }
    .perso {
        color: #1e90ff;
    }
    .perso:hover {
        color: rgb(21, 41, 124);
        text-decoration: underline;
    }
    h4 {
        margin-left: 2%;
        margin-top: 0.5%;
    }
    .cabecera {
        margin-top: 1%;
        margin-left: 1.5%;
        margin-bottom: 1%;
    }
    
</style>
