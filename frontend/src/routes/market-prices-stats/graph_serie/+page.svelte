<svelte:head>
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/morris.js/0.5.1/morris.css">
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/raphael/2.1.0/raphael-min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/morris.js/0.5.1/morris.min.js"></script>
</svelte:head>
<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import {Button, Form, FormGroup, Label, Input } from "sveltestrap"; 

    let result = null;
    let show_section = true;
    let show_graph_button = true;
    let key_series = "";
    let imdb_id = "tt0903747";
    onMount(async () => {
        onPageLoad();
    });

    //let API = "/api/v2/market-prices-stats";

    async function onPageLoad(){
        if ( result != null){
            show_section = false;
        } 
    }
   
    async function requestSerie(){
        const res = await fetch('https://streaming-availability.p.rapidapi.com/v2/get/basic'+'?country=us&imdb_id='+imdb_id, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': key_series,
                'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
            }
        });
        // const res = await fetch(API+'/graph_serie'+'?country=us&imdb_id='+imdb_id, {
        //     method: 'GET'
        // });
        const status = await res.status;
        if(status == 200){
            const data = await res.json();
            result = await formatData(data);
            onPageLoad();
        }else{
            console.log(status);
        }
    };
    async function formatData(data){
        let formated_serie = {
            id: imdb_id,
            name: data.result.title,
            url_image: data.result.posterURLs.original,
            serie_url: `https://www.imdb.com/title/${imdb_id}`,
            rating: data.result.imdbRating,
            seasons: []
        };
        for (let i = 0; i < data.result.seasons.length; i++) {
            let season = {
                season_number: i+1,
                episodes: data.result.seasons[i].episodes.length
            };
            formated_serie.seasons.push(season);
        }  
        return formated_serie;
    }
    async function resetSeries(){
        show_section = true;
        imdb_id = "";
        result = [];
        show_graph_button = true;
    }
    async function loadChartData(seriesData) {
        Morris.Bar({
            element: 'morrischart',
            data: seriesData,
            xkey: 'season_number',
            ykeys: ['episodes'],
            labels: [],
            barColors: ['#1e90ff'],
            stacked: true,
            parseTime: false,
            hoverCallback: function(index, options, content) {
                var data = options.data[index];
                var tooltip = '<div class="morris-hover-row-label">' + 'Temporada: ' +data.season_number + '</div>';
                tooltip += '<div class="morris-hover-point" style="color: ' + options.barColors[index % options.barColors.length] + '">';
                tooltip += 'Episodios: ' + data.episodes + '<br>';
                tooltip += '</div>';
                return tooltip;
            }
        });
    }
    async function showGraph(){
        show_graph_button = false;
        await loadChartData(result.seasons);
    }
</script>
<main>
    <div class="container" style="margin-top: 1%;">
        {#if show_section == true}
            <div class="row" style="margin-bottom: 1%;">
                <h2>
                    Gráfico para ver los episodios por temporada de una serie
                </h2>
                <p>
                    Para poder usar esta funcionalidad, tienes que ir a la API de rapidApi: <a href="https://rapidapi.com/movie-of-the-night-movie-of-the-night-default/api/streaming-availability">/streaming-availability</a> y añadir de forma <strong>gratuita</strong> una RapidApiKey propia.
                </p>
                <p>
                    Para buscar la serie deseada tienes que ir a la página de <a href="https://www.imdb.com/">IMDB</a> y buscar la serie deseada. Una vez en la página de la serie, copiar el id de la serie que se encuentra en la url. Por ejemplo, para la serie Breaking Bad, la url es: <a href="https://www.imdb.com/title/tt0903747/">https://www.imdb.com/title/tt0903747/</a>, por lo que el id de la serie es: <strong>tt0903747</strong>.
                </p>
            </div>
            <Form>
                <FormGroup>
                    <Label for="key_serie">Key de RapidApi Streaming Availability</Label>
                    <Input type="textarea" name="text" id="key_serie" bind:value={key_series}/>
                </FormGroup>
                <FormGroup>
                    <Label for="serie">Imdb serie id</Label>
                    <Input type="textarea" name="text" id="serie" bind:value={imdb_id}/>
                </FormGroup>
                <FormGroup>
                    <Button color="primary" on:click={requestSerie}>Buscar serie</Button>
                </FormGroup>
                
            </Form> 
        {:else}
        <div class="row" style="display: flex;">
           <h4>
                Gráfico para ver los episodios por temporada de la serie: <a href={result.serie_url}>{result.name}</a><a href={result.url_image}><img src={result.url_image} alt={result.name}/></a>,puntuación en <a href="https://www.imdb.com/">IMDB</a>: {result.rating}/100
            </h4> 
        </div> 
        <div id="morrischart" style="height: 250px;"></div>
        <h5>Gráfico realizado con <a href="http://morrisjs.github.io/morris.js/index.html">Morris.js</a></h5>
        {#if show_graph_button == true}
        <Button color="info" on:click={showGraph}>Generar gráfico</Button>   
        {/if}
        <Button color="warning" on:click={resetSeries}>Buscar otra serie</Button>   
        {/if}
    </div>
</main>
<style>
    img{
        width: 65px;
        height: 100px;
        margin-right: 1%;
        margin-left: 1%;
        border-radius: 15%;
    }
</style>