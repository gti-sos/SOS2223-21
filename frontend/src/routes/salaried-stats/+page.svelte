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
    const toggle = () => (open = !open);

    onMount(async () => {
        getsrc();
    });

    let API = "/api/v2/salaried-stats";

    if (dev) API = "http://localhost:12345" + API;

    let mks = [];
    let newMks = {
        province: "Almería",
        year: 2010,
        remuneration_of_employees: 149627412,
        remuneration_percentage_structure: 100,
        remuneration_variation_rate: 298281107,
    };
    let search_province = "";
    let search_year = "";
    let search = {
        remuneration_of_employees: "",
        remuneration_percentage_structure: "",
        remuneration_variation_rate: "",
        from: "",
        to: "",
    }
    let message = "";
    let color_alert;
    let result = "";
    let resultStatus = "";
    let pagina = 1; 

    async function getsrc() {
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
                    params_ids = "/" + search_year + params;
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
            getsrc();
        } 
        if (status == 400){
            message = "Ya hay datos cargados";
            color_alert = "danger";
        }
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
                remuneration_of_employees: newMks.remuneration_of_employees,
                remuneration_percentage_structure: newMks.remuneration_percentage_structure,
                remuneration_variation_rate: newMks.remuneration_variation_rate,
            }),
        });
        const status = await res.status;
        resultStatus = status;
        if (status == 201) {
            message = "Recurso creado correctamente";
            color_alert = "success";
            getsrc();
        }else{
            if (status == 400) {
                message = "Hay que insertar datos o faltan campos";
                color_alert = "danger";
            }else{
                if(status == 409){
                    message = "El recurso ya existe o la provincia tiene que ser de Andalucía";
                    color_alert = "danger";
                }
            }
        }
    }
    async function deleteSrc() {
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
            getsrc();
        }
    }
    async function deleteSrc_one(province, year) {
        resultStatus = result = "";
        const res = await fetch(API + "/" + province + "/" + year, {
            method: "DELETE",
        });
        const status = await res.status;
        resultStatus = status;
        if (status == 200) {
            message = "Recurso borrado correctamente";
            color_alert = "success";
            getsrc();
        }
    }
    async function previousPage() {
        if (pagina > 1) { 
        pagina--;
        getsrc()
        }else{
            message = "Estás en la primera página";
            color_alert = "danger";
        }
    }
    async function nextPage() {
        if (mks.length >= 10) {
            pagina++;
            getsrc();
         }else{
            message = "No hay más páginas";
            color_alert = "danger";
         }
                      
    }
</script>
    <div class="cabecera">
    <Row >
        <Col xs="7">
            <h4>
                Salarios
                <Button color="danger" on:click={toggle}>Borrar recursos</Button>
                <Modal isOpen={open} {toggle}>
                    <ModalHeader {toggle}>Vas a borrar todos los recursos de la base de datos</ModalHeader>
                    <ModalBody>¿Estás seguro?</ModalBody>
                    <ModalFooter>
                        <Button color="primary" on:click={deleteSrc}>Proceder</Button>
                        <Button color="secondary" on:click={toggle}>Cancelar</Button>
                    </ModalFooter>
                </Modal>
                <Button color="info" on:click={loadInitialData}>Cargar datos iniciales</Button>
            </h4>
        </Col>
        <Col xs="4"> 
            {#if message != ""}
            <Alert fade={true} color={color_alert} dismissible>{message}</Alert>
        {/if}
        </Col>
    </Row>
</div>
<Table bordered striped>
    <thead>
        <tr>
            <th>Provincia</th>
            <th>Año</th>
            <th>Remuneracion de empleados</th>
            <th>Estructura porcentual</th>
            <th>Tasas de variacion</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><input bind:value={search_province} /></td>
            <td><input bind:value={search_year} /></td>
            <td><input bind:value={search.remuneration_of_employees} /></td>
            <td><input bind:value={search.remuneration_percentage_structure} /></td>
            <td><input bind:value={search.remuneration_variation_rate} /></td>
            <td>
                <Button color="success" on:click={getsrc}>Buscar</Button>
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
            <td><input bind:value={newMks.remuneration_of_employees} /></td>
            <td><input bind:value={newMks.remuneration_percentage_structure} /></td>
            <td><input bind:value={newMks.remuneration_variation_rate} /></td>
            <td><Button color="primary" on:click={createMks}>Crear recurso</Button></td>
        </tr>
        {#each mks as x}
            <tr>
                <td><a class="perso" href="/salaried-stats/{x.province}/{x.year}">{x.province}</a></td>
                <td>{x.year}</td>
                <td>{x.remuneration_of_employees}</td>
                <td>{x.remuneration_percentage_structure}</td>
                <td>{x.remuneration_variation_rate}</td>
                <td><Button color="danger" on:click={deleteSrc_one(x.province, x.year)}>Borrar</Button></td>
                <td><Button on:click><a href="/salaried-stats/{x.province}/{x.year}">Editar</a></Button></td>
                <td>&nbsp</td>
            </tr>
        {/each}
    </tbody>
</Table>
<Row>
    <Col class="wp">
          
    </Col>
</Row>
<div class="cabecera">
    <Row>
        <Col xs="5">
        </Col>
        <Col xs="4">
            <button on:click={previousPage}>&lt;</button>
            <span>Página: {pagina}</span>
            <button on:click={nextPage}>&gt;</button>
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
