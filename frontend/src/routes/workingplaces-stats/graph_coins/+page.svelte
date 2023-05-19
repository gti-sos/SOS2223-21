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

    let key_series = "";
    onMount(async () => {
        
    });

    //let API = "/api/v2/market-prices-stats";

    async function getBaseballStats(){
        console.log("Cargando")
        const url = 'https://coinranking1.p.rapidapi.com/coin/Qwsogvtv82FCd/history?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=1h';
        const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '36d3625373msh78ecb94c357d9c0p1b9765jsn85546ad5f4c9',
            'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com'
        }
        };

        try {
            const response = await fetch(url, options);
            resultado = await response.json();
            console.log(resultado.data.history);
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

            for (let an in resultado.data.history){
                
                data.labels.push(parseFloat(resultado.data.history[an].price));
                data.series.push(resultado.data.history[an].timestamp);
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

            chart = new Chartist.Line('.ct-chart', {
                    labels: data.labels.slice(-10),
                    series: [data.series.slice(-10)]
                    }, {
                    lineSmooth: Chartist.Interpolation.simple({
                        divisor: 2
                    }),
                    fullWidth: true,
                    chartPadding: {
                        right: 20
                    },
                    low: 0
                    });
                    

    };

</script>
<main>
    <div><h1>Grafica del bitcoin en las ultimas 5 semanas</h1></div>
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