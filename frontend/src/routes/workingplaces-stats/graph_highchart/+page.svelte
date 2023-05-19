<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>
<script>
    //@ts-nocheck
    import { onMount } from 'svelte';
    import { dev } from "$app/environment";

    let data = [];
    let result ="";

    let years = [];
    let provinces = [];
    let total = [];

    
    let API = "/api/v2/workingplaces-stats";
    if (dev) API = "http://localhost:12345" + API;

    onMount(async () => {
        getData();
    });
    function processData(apiResponse) {
        const total = {
            provinces: [],
            years: [],
            data: []
        };

        apiResponse.forEach(({ province, year, work_place }) => {
            if (!total.provinces.includes(province)) {
            total.provinces.push(province);
            total.data.push({
                province,
                work_place: []
            });
            }
            if (!total.years.includes(year)) {
            total.years.push(year);
            }
            const dataIndex = total.data.findIndex(d => d.province === province);
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
    async function loadChartData(total) {
      //total (name, data)
  Highcharts.chart('container', {
    chart: {
      polar: true, // establece el tipo de gráfico como radar
      width: 1200,
      height: 600,
      backgroundColor: '#E0E0E0'
    },
    title: {
      text: 'Puestos De Trabajo Totales de Mercado de las provincias de Andalucía desde 2008 hasta 2019'
    },
    pane: {
      startAngle: 0,
      endAngle: 360
    },
    xAxis: {
      categories: years,
      tickmarkPlacement: 'on',
      lineWidth: 0,
      labels: {
        style: {
          fontSize: '10px'
        }
      }
    },
    yAxis: {
      gridLineInterpolation: 'polygon',
      lineWidth: 0,
      min: 0
    },
    tooltip: {
      shared: true,
      pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y:,.0f}</b><br/>'
    },
    legend: {
      align: 'right',
      verticalAlign: 'top',
      y: 70,
      layout: 'vertical'
    },
    series: total
  });
}


   
    
</script>   
<main>
    <figure class="highcharts-figure">
        <div id="container"></div>
    </figure>
</main>