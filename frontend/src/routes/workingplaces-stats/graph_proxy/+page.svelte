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
        console.log("Entramos")
        getData();
    });
    let API = "http://localhost:12345/api/v2/workingplaces-stats/proxy/?url=https://sos2223-22.appspot.com/api/v2/jobs-companies-innovation-stats";
    
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
            console.log(dataWP);
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
    function volverAtras (){
        return history.back()
    }
    
</script>
    <div class="cabecera">
        <div class="wpcab" >
            <row>
                <h2>
                    Puestos De Trabajo Totales de Mercado 
                </h2>
                En el caso de que no haya datos es necesario cargarlos aqui: <a href="https://sos2223-22.appspot.com/frontAcb">FrontendAcb(SOSG22)</a>
            </row>
        </div>
       </div> 
<div  class = "wp">
    <Table>
            <thead>
                <tr>
                    <th>Territorio</th>
                    <th>Año</th>
                    <th>Trabajos en la Industria	</th>
                    <th>Compañias con Innovaciones</th>
                    <th>Empleo temporal</th>
                </tr>
            </thead>  
    
            {#if dataWP.length == 0}
                    <td colspan="6"><p class="text-center">No existen datos, inserte o cargue los datos iniciales.</p></td>
                {:else}
                    {#each dataWP as x}
                        <tr>
                            <td><a class="cuadricula">{x.territory}</a></td>
                            <td>{x.year}</td>
                            <td>{x.jobs_industry}</td>
                            <td>{x.companies_with_innovations}</td>
                            <td>{x.temporary_employment}</td>
                        </tr>
                    {/each}
            {/if}
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