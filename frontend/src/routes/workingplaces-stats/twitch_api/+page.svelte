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
//@ts-nocheck
import { onMount } from 'svelte';
import { dev } from "$app/environment";

let API = "https://sos2223-21.ew.r.appspot.com/workingplaces-stats/twitch_api";
if (dev) {
  console.log("No entra");
  API = "http://localhost:12345/workingplaces-stats/twitch_api";
  }

const client_id = "4qkk4s8gvz74xfj00i1b61fycu6tmb";
const client_secret = "ugbnb9eyo0cva0kdwci4d2n8nikkn6";

let playlistId;



let data = [];
let result = "";
let provincia = "";
let accessToken;
let refreshToken;

let code;

const parameters =`response_type=code&client_id=${client_id}&redirect_uri=${API}&scope=channel%3Amanage%3Apolls+channel%3Aread%3Apolls&state=c3ab8aa609ea11e793ae92361f002671`;
const url_auth = `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${client_id}&redirect_uri=${API}&scope=channel%3Amanage%3Apolls+channel%3Aread%3Apolls&state=c3ab8aa609ea11e793ae92361f002671`
const parameters_post =`client_id=${client_id}&client_secret=${client_secret}&code=${code}&grant_type=authorization_code&redirect_uri=${API}`;



onMount(async () => {
  asignacion_code();
  if(!code){
    console.log("code:", code);
      inicio();
    }
});

async function asignacion_code(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    code = urlParams.get('code');
}

async function handleSubmit(event) {
    event.preventDefault();
    getToken();
    
  }
async function inicio(){
  if (typeof window !== 'undefined') {
    window.location.replace(url_auth);
}

  
}
async function getToken() {
    
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    code = urlParams.get('code');
    const grantType = 'authorization_code';
    const postData = `client_id=${client_id}&client_secret=${client_secret}&code=${code}&grant_type=authorization_code&redirect_uri=${API}`;
 
    const response = await fetch('https://id.twitch.tv/oauth2/token', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: postData
  });

  const data = await response.json();
  accessToken = data.access_token;
  refreshToken = data.refresh_token;
  ObtenerCanciones();
}
async function ObtenerCanciones() {
  const authToken = accessToken;

  const responsePlaylist = await fetch(`https://api.twitch.tv/helix/soundtrack/playlist?id=${playlistId}`, {
    headers: {
      'Client-ID': client_id,
      'Authorization': `Bearer ${authToken}`
    }
  });
     let datos = await responsePlaylist.json();
     data = datos.data;
 
}



</script>   
<main>
<div>
<form on:submit={handleSubmit}>
  <label>
    Playlist ID:
    <input type="text" bind:value={playlistId}>
  </label>
  <button type="submit">Buscar</button>
</form>
</div>
<div class="Contenedor">
{#each data as dato}
    <div class="Enganche">
        <img src={dato.album.image_url} alt={dato.album.name} />
        <a href="#">Título: {dato.album.name}</a>
    </div>
{/each}
</div>

</main>
<style>
.Contenedor {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.Enganche {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 10px;
}

.Enganche img {
  max-width: 100px;
  height: auto;
  margin-right: 10px;
}

.Enganche a {
  font-size: 18px;
  text-decoration: none;
  color: #333;
}

</style>