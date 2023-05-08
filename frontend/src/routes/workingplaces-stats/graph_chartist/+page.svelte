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

    let years = [];
    let provinces = [];
    let total = [];

    
    let API = "/api/v2/workingplaces-stats/graph";
    if (dev) API = "http://localhost:12345" + API;

    let chart;

    onMount(async () => {

        getData();
        chart = new Chartist.Line('.ct-chart', {
                  labels: ['2008', '2009', '2010', '2012', '2013', '2014', '2015', '2016'],
                  // Naming the series with the series object array notation
                  series: [{
                    name: 'Andalucia',
                    data: [5, 2, -4, 2, 0, -2, 5, -3]
                  }, {
                    name: 'Cadiz',
                    data: [4, 3, 5, 3, 1, 3, 6, 4]
                  }, {
                    name: 'Malaga',
                    data: [2, 4, 3, 1, 4, 5, 3, 2]
                  }]
                }, {
                  fullWidth: true,
                  series: {
                    'series-1': {
                      lineSmooth: Chartist.Interpolation.step()
                    },
                    'series-2': {
                      lineSmooth: Chartist.Interpolation.simple(),
                      showArea: true
                    },
                    'Malaga': {
                      showPoint: false
                    }
                  }
                }, [
                  ['screen and (max-width: 320px)', {
                    series: {
                      'series-1': {
                        lineSmooth: Chartist.Interpolation.none()
                      },
                      'series-2': {
                        lineSmooth: Chartist.Interpolation.none(),
                        showArea: false
                      },
                      'Malaga': {
                        lineSmooth: Chartist.Interpolation.none(),
                        showPoint: true
                      }
                    }
                  }]
                ]);
           })
 
  
    function processData(apiResponse) {
        const total = {
            provinces: [],
            years: [],
            data: []
        };

        apiResponse.forEach(({ province, year, work_place }) => {
            // Agregar la provincia a la lista de provincias si aún no está
            if (!total.provinces.includes(province)) {
            total.provinces.push(province);
            // Agregar un nuevo objeto al array de datos
            total.data.push({
                province,
                work_place: []
            });
            }

            // Agregar el año a la lista de años si aún no está
            if (!total.years.includes(year)) {
            total.years.push(year);
            }

            // Buscar el índice del objeto de datos correspondiente a la provincia
            const dataIndex = total.data.findIndex(d => d.province === province);
            // Agregar el valor de work_place al array de work_place correspondiente al año
            total.data[dataIndex].work_place.push(work_place);
        });

        return total;
    }
    async function getData(){
        const res = await fetch(API, {
            method: "GET",
        });
        try{
            const dataReceived = await res.json();
            result = JSON.stringify(dataReceived, null, 2);
            data = dataReceived;
        
            data.forEach(function(x) {
                if (!provinces.includes(x.province)) {
                    provinces.push(x.province);
                }
                if (!years.includes(x.year)) {
                    years.push(x.year);
                }
            });
            
            total = provinces.reduce((acc, province) => {
                const P_Data = data.filter(x => x.province === province);
                const P_Year = years.reduce((yearsAcc, year) => {
                    const yearData = P_Data.find(x => x.year === year);
                    yearsAcc.push(yearData ? yearData.work_place : null);
                    return yearsAcc;
                }, []);
                acc.push({ name: province, data: P_Year });
                return acc;
                }, []);
            loadChartData(total);
        }catch(error){
            console.log(error);
        } 
     
    }
    
   


   
    
</script>   
<main>
    <div class="ct-chart"></div>
</main>