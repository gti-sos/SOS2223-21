<svelte:head>
    <link rel="stylesheet" href="//cdn.jsdelivr.net/chartist.js/latest/chartist.min.css">
    <script src="https://cdn.jsdelivr.net/chartist.js/latest/chartist.min.js"></script>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>
<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import {Button, Form, FormGroup, Label, Input } from "sveltestrap"; 
    let chart;
    let result = null;
    let resultado;
    let show_section = true;
    let show_graph_button = true;
    let key_series = "";
    let imdb_id = "tt0903747";
    onMount(async () => {
        
    });

    //let API = "/api/v2/market-prices-stats";

    async function getBaseballStats(){
        console.log("Cargando")
        const url = 'https://api-nba-v1.p.rapidapi.com/teams/statistics?id=1&season=2020';
        const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': key_series,
            'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
        }
        };

        try {
            const response = await fetch(url, options);
            resultado = await response.json();
        } catch (error) {
            console.error(error);
        }
        loadChart()
    };

    async function loadChart(){
             var data = {
            labels: [],
            series: []
            };

            for (let an in resultado.response[0]){
                if (an != "ftp" && an != "tpp" && an != "fgp"){
                data.labels.push(an);
                data.series.push(resultado.response[0][an]);}
            }
            console.log(data);
                   

            var options = {
            labelInterpolationFnc: function(value) {
                return value[0]
            }
            };

            var responsiveOptions = [
            ['screen and (min-width: 640px)', {
                chartPadding: 30,
                labelOffset: 100,
                labelDirection: 'explode',
                labelInterpolationFnc: function(value) {
                return value;
                }
            }],
            ['screen and (min-width: 1024px)', {
                labelOffset: 80,
                chartPadding: 20
            }]
            ];

            chart = new Chartist.Pie('.ct-chart', data, options, responsiveOptions);

    };

</script>
<main>
    <div><h1>Estadisticas de la NBA equipo Atlanta Hawks temporada 2020</h1></div>
    <div class="container" style="margin-top: 1%;">
            <Form>
                <FormGroup>
                    <Label for="key_serie">Key de RapidApi Streaming Availability</Label>
                    <Input type="textarea" name="text" id="key_serie" bind:value={key_series}/>
                </FormGroup>
                <FormGroup>
                    <Button color="primary" on:click={getBaseballStats}>Mostrar Estadisticas</Button>
                </FormGroup>
                
            </Form> 
    </div>
    <div class="ct-chart">
    </div>
</main>
<style>
.ct-chart {
  width: 800px; /* Ajusta el ancho del contenedor del gráfico */
  height: 600px; /* Ajusta la altura del contenedor del gráfico */
}

</style>