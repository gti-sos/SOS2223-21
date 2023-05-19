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
    import { onMount } from 'svelte';
    import { dev } from "$app/environment";

    let data = [];
    let result ="";

    let yearsm = [];
    let datam = [];
    let provinces = [];
    const provinc =["Andalucía", "Jaén", "Almería", "Sevilla", "Huelva", "Málaga", "Cádiz", "Córdoba", "Granada"];
    let total;
    let provincia = '';

    
    let API = "/api/v2/workingplaces-stats";
    if (dev) API = "http://localhost:12345" + API;

    let chart;

    onMount(async () => {
        chart = new Chartist.Line('.ct-chart', {
                    labels: [2008, 2008, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017,2018,2019],
                    series: [[20080, 20080, 20100, 20110, 20120, 20130, 20140, 20150, 20160, 20170,20180,20190]]
                    }, {
                    low: 1,
                    showArea: true
                    });
        getData();
           })
 
    async function getData(){
        if (provincia != ''){
        const res = await fetch(API, {
            method: "GET",
        });
        try{
            const dataReceived = await res.json();
            result = JSON.stringify(dataReceived, null, 2);
            data = dataReceived;
            console.log(data.length);
            let proc = [];
            if (data.length != 0) {
                loadDat(provincia, data);
                chart = new Chartist.Line('.ct-chart', {
                    labels: yearsm,
                    series: [datam]
                    }, {
                    low: 0,
                    showArea: true
                    });
            }
            
           
        }catch(error){
            console.log(error);
        } }
     
    }
    

    function loadDat(provinciado, data){
           let yearso = [];
           let datao = [];
        let filtrado = data.filter(x => x.province === provinciado);
        for (let a in filtrado) {
            yearso.push(filtrado[a].year);
            datao.push(filtrado[a].work_place);
        }

        yearsm = yearso;
        datam = datao;
    }

    function guardarProvincia() {
      provincia = document.getElementById('select-provincia').value;
      getData();
  }
    
   


   
    
</script>   
<main>
    <div class = "centrado">
    <h1>Grafica sobre puestos de trabajo segun la provincia seleccionada</h1>
    <div>
      <label for="select-provincia">Provincia:</label>
      <select id="select-provincia" name="provincia">
        <option value="Andalucía">Andalucía</option>
        <option value="Almería">Almería</option>
        <option value="Cádiz">Cádiz</option>
        <option value="Córdoba">Córdoba</option>
        <option value="Granada">Granada</option>
        <option value="Huelva">Huelva</option>
        <option value="Jaén">Jaén</option>
        <option value="Málaga">Málaga</option>
        <option value="Sevilla">Sevilla</option>
      </select>
      <button on:click={guardarProvincia}>Seleccionar</button>
    </div>
    <div class="ct-chart"></div>
    </div>
</main>
<style>
.centrado {
        margin-top: 1.5%;
        margin-left: 8.5%;
        margin-right: 8.5%;
        background-color: #f1f1f1;
        padding: 20px;
        border: 1px solid #ccc;
    }
</style>