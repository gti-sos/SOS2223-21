<svelte:head>
    <title>Workingplaces-stats</title>
</svelte:head>
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
        province: "",
        year: "",
        work_place: "",
        percentage_structure: "",
        variation_rating: "",
    };
    let busquedas = false;
    let message = "";
    let color_alert;
    let result = "";
    let resultStatus = "";
    let pagina = 1; // Inicializamos la variable 'pagina' en 1
    let mensaje_visible = false;
    
    function contador_mensaje() {
        let mensaje_visible = true;
        setTimeout(function() {
            mensaje_visible = false;
            message ="";
            
            console.log("finalziacion");
        }, 5000);
    }
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
            contador_mensaje()
        } else if (status == 200) {
            message = "Datos iniciales cargados correctamente";
            color_alert = "success";
            contador_mensaje()
            getData();
        } else if (status == 201){
            message = "Ya hay datos cargados";
            color_alert = "danger";
            contador_mensaje()
        }
    }
    async function Busqueda() {
             if (busquedas == true){
                busquedas = false;
             }         else{
                busquedas = true
             }         
    }
    async function sumarPagina() {
         if (Object.keys(dataWP).length >= 10) {
            pagina++;
            getData();
         }else{
            message = "Ya no hay más datos, estas en la ultima pagina";
            color_alert = "danger";
            contador_mensaje();
         }
                      
    }
    async function restarPagina() {
        if (pagina > 1) { // Evitamos que la página sea menor que 1
        pagina--;
        getData()
        }
    }
    async function getData() {
        
        let i = 0;
        let limit = 10;
        let offset = (pagina-1)*limit;
        var params = "?offset="+offset+"&"+"limit="+limit;
        for (const [key, value] of Object.entries(queryparams)) {     
                    if (value != ""){
                    params += "&" + key + "=" + value;}
        }
        
        console.log(params);
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
            dataWP = [];
        }
        const status = await res.status;
        resultStatus = status;
        if (status == 404) {
            if (message ==="Recursos borrados correctamente"){
                mensaje_visible=false;
                console.log(message);
                setTimeout(function() {mensaje_visible = false;
                    message = "No hay datos, carga los datos iniciales o crea uno tu mismo!!";
                    color_alert = "info";
                    contador_mensaje();
                     },5000);
                     
                }else{
                    mensaje_visible = false;
                    message = "No hay datos, carga los datos iniciales o crea uno tu mismo!!";
                    color_alert = "info";
                    contador_mensaje();    }   
            }
    }
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
            contador_mensaje();
            getData();
        }else{
            if (status == 400) {
                message = "Hay que insertar datos o hay campos vacios";
                color_alert = "danger";
                contador_mensaje();
            }else{
                if(status == 409){
                    message = "El recurso ya existe o la provincia no pertenece a Andalucia";
                    color_alert = "danger";
                    contador_mensaje();
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
            
            message = "Recursos borrados correctamente";
            color_alert = "success";
            contador_mensaje();    
            getData();      
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
            contador_mensaje();
        }
    }
</script>
    <div class="cabecera">
    <Col md>
        <div class="wpcab" >
            <row>
                <h2>
                    Puestos De Trabajo Totales de Mercado 
                </h2>
            </row>
        </div>
        <div class="wpcab">
                    <Button color="danger" on:click={toggle}>Borrar recursos</Button>
                    <Button color="info" on:click={LoadInitial}>Cargar Datos Iniciales</Button>
                    <Button color="secondary" on:click={Busqueda}>Busquedas</Button>
                    <Modal isOpen={open} {toggle}>
                        <ModalHeader {toggle}>Procede a borrar todos los datos</ModalHeader>
                        <ModalBody>¿Estás seguro?</ModalBody>
                        <ModalFooter>
                            <Button color="secondary" on:click={deleteDATA}>Proceder</Button>
                            <Button color="secondary" on:click={toggle}>Cancelar</Button>
                        </ModalFooter>
                    </Modal>
        </div>
        {#if busquedas == true}
            <div class="filter-square">
                    <div class ="objetoscenter">
                        <h6>
                            Filtros Generales
                        </h6>
                    </div>
                    <div class ="objetoscenter">
                    <tr>
                        <td><input placeholder="Provincia"  bind:value={queryparams.province} style="color: #888;" /></td>
                        <td><input placeholder="Año"  bind:value={queryparams.year} style="color: #888;" /></td>
                        <td><input placeholder="Lugares De Trabajo"  bind:value={queryparams.work_place} style="color: #888;" /></td>
                        <td><input placeholder="Estructura porcentual"  bind:value={queryparams.percentage_structure} style="color: #888;" /></td>
                        <td><input placeholder="Tasas de variación"  bind:value={queryparams.variation_rating} style="color: #888;" /></td>
                    </tr>
                    </div>
                     <div class ="objetoscenter">
                        <h6>
                    Filtro por rango de Año
                    </h6>
                     </div>
                    <div class ="objetoscenter">
                    
                    <tr>
                        <td><input placeholder="Año Minimo"  bind:value={queryparams.from} style="color: #888;" /></td>
                        <td><input placeholder="Año Maximo"  bind:value={queryparams.to} style="color: #888;" /></td>
                    </tr>
                    </div>
                    <div class ="butoncenter">
                    <td><Button color="primary" on:click={getData}>Filtrar</Button></td>
                    </div>
            </div>
        {/if}
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
                <td><input placeholder="Provincia"  bind:value={newBody.province} style="color: #888;" /></td>
                <td><input placeholder="Año" bind:value={newBody.year} style="color: #888;" /></td>
                <td><input placeholder="Puestos de Trabajo" bind:value={newBody.work_place} style="color: #888;" /></td>
                <td><input placeholder="Estructura porcentual" bind:value={newBody.percentage_structure} style="color: #888;" /></td>
                <td><input placeholder="Tasas de variación" bind:value={newBody.variation_rating} style="color: #888;" /></td>
                <td><Button color="primary" on:click={createDATA}
                        >Crear</Button></td>
            </tr>

            {#if dataWP.length == 0}
                    <td colspan="6"><p class="text-center">No existen datos, inserte o cargue los datos iniciales.</p></td>
                {:else}
                    {#each dataWP as x}
                        <tr class="WorkingplaceRow">
                            <td><a class="cuadricula" href="/workingplaces-stats/{x.province}/{x.year}">{x.province}</a></td>
                            <td>{x.year}</td>
                            <td>{x.work_place}</td>
                            <td>{x.percentage_structure}</td>
                            <td>{x.variation_rating}</td>
                            <td><Button
                                    color="danger"
                                    on:click={deleteDATA_Spef(x.province, x.year)}
                                    >Borrar</Button
                                ></td>
                            <td><a href="/workingplaces-stats/{x.province}/{x.year}" id="editar-btn">Editar</a></td>
                        </tr>
                    {/each}
            {/if}
        </tbody>
    </Table>
    <div class="pages">
                    <button on:click={restarPagina}>&lt;</button>
                    <span class="spanp">Página: {pagina}</span>
                    <button on:click={sumarPagina}>&gt;</button>  
 </div>
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
    .spanp{
        margin-right: 1%;   
        margin-left: 1%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    #editar-btn {
        display: inline-block; /* Ajusta el elemento a un ancho mínimo */
        vertical-align: middle;
        background-color: #1E3A8A; /* Color de fondo azul oscuro */
        color: #FFFFFF; /* Color de texto blanco */
        padding: 7.5px 12.5px; /* Espaciado interno del botón */
        border: none; /* Borde sin estilo */
        border-radius: 5px; /* Bordes redondeados */
        text-decoration: none;
        cursor: pointer; /* Cambia el cursor al pasar por encima */
    }
  
  #editar-btn:hover {
        background-color: #3F65B6; /* Color de fondo iluminado */
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