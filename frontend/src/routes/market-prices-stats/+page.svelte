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
        Alert
    } from "sveltestrap";

    let open = false;
    let open_create = false;

    let visible = true;

    const toggle = () => ( open = !open );
    const toggle_create = () => ( open_create = !open_create );


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
        const status = await res.status
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
        if( status == 200){
            const data = await res.json();
            result = JSON.stringify(data, null, 2);
            if(!Array.isArray(data)){
                mks = [data];
            }else{
                mks = data;
            }
        }
        visible = true;
     
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
        visible = true;
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
            getMks();
        }
        if (status == 400) {
            message = "Hay que insertar datos o faltan campos";
            color_alert = "danger";       
        }
        if(status == 409){
            message = "El recurso ya existe o la provincia tiene que ser de Andalucía";
            color_alert = "danger";
        } 
        open_create = false;
        visible = true;
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
        visible = true;
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
            getMks();
        }
        visible = true;
    }
    async function previousPage() {
        if (pagina > 1) { 
        pagina--;
        getMks()
        }else{
            message = "Estás en la primera página";
            color_alert = "danger";
        }
        visible = true;
    }
    async function nextPage() {
        if (mks.length >= 10) {
            pagina++;
            getMks();
        }else{
            message = "No hay más páginas";
            color_alert = "danger";
        } 
        visible = true;             
    }
    let show_search = false;
    const toggle_search = () => ( show_search = !show_search );
    async function searchMks() {
       show_search = true;
    }
   
</script>
<main>
    <div class="container" style="margin-top: 1%;">
        <div class="row" style="margin-bottom: 1%;">
            <div class="col-md-6">
                <h4>
                    Producto interior bruto a precios de mercado 
                </h4>
                <div display="flex">
                    <Button color="danger" on:click={toggle}>Borrar recursos</Button>
                    <Modal isOpen={open} {toggle}>
                        <ModalHeader {toggle}>Vas a borrar todos los recursos de la base de datos</ModalHeader>
                        <ModalBody>¿Estás seguro?</ModalBody>
                        <ModalFooter>
                            <Button color="primary" on:click={deleteMks}>Proceder</Button>
                            <Button color="secondary" on:click={toggle}>Cancelar</Button>
                        </ModalFooter>
                    </Modal>
                    <Button color="warning" on:click={loadInitialData}>Cargar datos iniciales</Button>
                    <Button color="primary" on:click={toggle_create}>Crear recurso</Button>
                    <Modal isOpen={open_create} {toggle_create}>
                        <ModalHeader {toggle_create}>Ingrese los datos del recurso a crear</ModalHeader>
                        <ModalBody>
                            <div class="row" id="create">
                                <div class="col-md">
                                    <p>Provincia</p>
                                    <input style="width: 100%;" bind:value={newMks.province}>
                                </div>
                                <div class="col-md">    
                                    <p>Año</p>
                                    <input bind:value={newMks.year}>
                                </div>
                            </div>
                            <div class="row" id="create">
                                <div class="col-md">
                                    <p>PIB Precios corrientes</p>
                                    <input bind:value={newMks.pib_current_price}>
                                </div>
                                <div class="col-md">    
                                    <p>PIB Estructura porcentual</p>
                                    <input bind:value={newMks.pib_percentage_structure} required>
                                </div>
                            </div>
                            <div class="row" id="create">
                                <div class="col-md">
                                    <p>PIB Tasa de variación</p>
                                    <input bind:value={newMks.pib_variation_rate} required>
                                </div>   
                            </div>
                        </ModalBody>
                        <ModalFooter style="justify-content: center">
                            <div class="row">
                                <div class="col-md">
                                    <Button color="primary" on:click={createMks}>Crear</Button>
                                </div>
                                <div class="col-md">
                                    <Button color="secondary" on:click={toggle_create}>Cancelar</Button>
                                </div>   
                            </div>
                        </ModalFooter>
                    </Modal>
                    <Button color="success" on:click={searchMks}>Buscar</Button>         
                </div>
            </div>
            <div class="col-md-6">
                {#if message != ""}
                    {#if visible}
                        <Alert color={color_alert} isOpen={visible} toggle={() => (visible = false)} dismissible>{message}</Alert>
                    {/if}
                {/if}
            </div>
        </div>
        {#if show_search}
            <div id="borde">
                <div class="row" id="search">
                    <div class="col-md">
                       <p>Provincia</p>
                        <input bind:value={search_province}>
                    </div>
                    <div class="col-md">
                        <p>Año</p>
                        <input bind:value={search_year}>
                    </div>
                    <div class="col-md">
                        <p>Desde</p>
                        <input bind:value={search.from}>
                    </div>
                    <div class="col-md">
                        <p>Hasta</p>
                        <input bind:value={search.to}>
                    </div>
                </div>
                <div class="row" id="search">
                    <div class="col-md">
                       <p>PIB Precios corrientes menor</p>
                        <input bind:value={search.pib_current_price_lower}>
                    </div>
                    <div class="col-md">
                        <p>PIB Precios corrientes mayor</p>
                        <input bind:value={search.pib_current_price_over}>
                    </div>
                    <div class="col-md">
                        <p>PIB Estructura porcentual menor</p>
                        <input bind:value={search.pib_percentage_structure_lower}>
                    </div>
                    <div class="col-md">
                        <p>PIB Estructura porcentual mayor</p>
                        <input bind:value={search.pib_percentage_structure_over}>
                    </div>
                </div>
                <div class="row" id="search">
                    <div class="col-md">
                       <p>PIB Tasa de Variación menor</p>
                        <input bind:value={search.pib_variation_rate_lower}>
                    </div>
                    <div class="col-md">
                        <p>PIB Tasa de Variación mayor</p>
                        <input bind:value={search.pib_variation_rate_over}>
                    </div>
                </div>
                <div class="row" id="search">
                    <div class="col-md-2">
                        <Button color="primary" on:click={getMks}>Realizar búsqueda</Button>
                    </div>
                    <div class="col-md-2">
                        <Button color="secondary" on:click={toggle_search}>Cancelar</Button>
                    </div>   
                </div>
            </div>
            
        {/if}
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
                {#if mks.length == 0}
                    <td colspan="6"><p class="text-center">No hay ningún dato.</p></td>
                {:else}
                    {#each mks as x}
                        <tr>
                            <td><a class="ahref_perso" href="/market-prices-stats/{x.province}/{x.year}">{x.province}</a></td>
                            <td>{x.year}</td>
                            <td>{x.pib_current_price}</td>
                            <td>{x.pib_percentage_structure}</td>
                            <td>{x.pib_variation_rate}</td>
                            <td><Button color="danger" on:click={deleteMks_one(x.province, x.year)}>Borrar</Button>
                            <Button><a  href="/market-prices-stats/{x.province}/{x.year}">Editar</a></Button></td>
                        </tr>
                    {/each}
                {/if}
            </tbody>
        </Table>
        <div class="pages">
            <Button on:click={previousPage}>&lt;</Button>
            <span class="pages_span">Página: {pagina}</span>
            <Button on:click={nextPage}>&gt;</Button> 
        </div>
    </div>
</main>
<style>
    #borde{
        border: 2px solid #999999;
        margin-bottom: 2%;
        border-radius: 5px;
    }
    #borde div.row{
        margin-left: 1%;
        margin-right: 1%;
    }
    #search {
        display: flex;
        justify-content: center;
        margin-bottom: 1%;
        margin-top: 1%;
    }
    #search p {
        margin: 0;
        padding-left: 2%;
        background-color: #1e90ff;
        color: white;
    }
    #search input {
        margin: 0;
        width: 100%;
    }
    #create {
        display: flex;
        justify-content: center;
        margin-bottom: 2%;
    }
    #create p {
        margin: 0;
        padding-left: 3%;
        background-color: #1e90ff;
        color: white;
    }
    #create input {
        margin: 0;
        width: 100%;
    }
    .pages_span{
        margin-right: 1%;   
        margin-left: 1%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .pages {
        display: flex;
        justify-content: center;    
    }
    th {
        background-color: #1e90ff;
        color: white;
        font-weight: bold;
    }
    a {
        text-decoration: none;
        color: white;
    }
    .ahref_perso {
        color: #1e90ff;
    }
    .ahref_perso:hover {
        color: rgb(21, 41, 124);
        text-decoration: underline;
    }
    
</style>
