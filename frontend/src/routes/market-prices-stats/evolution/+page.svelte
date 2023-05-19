<svelte:head>
    <title>Evolution</title>
</svelte:head>
<script>
    // @ts-nocheck

    import { onMount } from "svelte";
    import {Button,Table} from "sveltestrap";

    
    onMount(async () => {
        getEvolution();
    });
   

    let API = "https://sos2223-13.appspot.com/api/v2/evolution";


    let evolution_data = [];
    let pagina = 1;
    async function getEvolution() {
        let limit = 10;
        let offset = (pagina - 1) * limit;
        let query = `?limit=${limit}&offset=${offset}`;
        var params = query;        
        const res = await fetch(API + params, {
            method: "GET",
        });
        const status = await res.status;
        if(status == 200){
            const data = await res.json();
            evolution_data = data;
        }
     
    }
    async function previousPage() {
        if (pagina > 1) { 
        pagina--;
        getEvolution()
        }
    }
    async function nextPage() {
        if (evolution_data.length >= 10) {
            pagina++;
            getEvolution();
        }            
    }
   
</script>
<main>
    <div class="container" style="margin-top: 1%;">
        <div class="row" style="margin-bottom: 1%;">
            <div class="col-md-6">
                <h4>
                    Datos evolución
                </h4>
            </div>
        </div>
        <Table  bordered striped>
            <thead>
                <tr>
                    <th>Periodo</th>
                    <th>Territorio</th>
                    <th>Total Población</th>
                    <th>Hombres</th>
                    <th>Mujeres</th>
                    <th>Menores 16 años</th>
                    <th>De 16 a 64 años</th> 
                    <th>A partir de 65 años</th>   
                </tr>
            </thead>
            <tbody>
                {#if evolution_data.length == 0}
                    <td colspan="8"><p class="text-center">No hay ningún dato.</p></td>
                {:else}
                    {#each evolution_data as x}
                        <tr>
                            <td>{x.period}</td>
                            <td>{x.territory}</td>
                            <td>{x.total_population}</td>
                            <td>{x.man}</td>
                            <td>{x.woman}</td>
                            <td>{x.under_sixteen_years}</td>
                            <td>{x.from_sixteen_to_sixty_four_years}</td>
                            <td>{x.sixty_five_and_over}</td>
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
        margin-bottom: 2%; 
    }
    th {
        background-color: #1e90ff;
        color: white;
        font-weight: bold;
    }
    
</style>
