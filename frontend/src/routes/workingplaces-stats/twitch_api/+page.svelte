<svelte:head>
    <link rel="stylesheet" href="//cdn.jsdelivr.net/chartist.js/latest/chartist.min.css">

</svelte:head>
<script>
    import { onMount } from 'svelte';
import { dev } from "$app/environment";

const client_id = "4qkk4s8gvz74xfj00i1b61fycu6tmb";
const client_secret = "ugbnb9eyo0cva0kdwci4d2n8nikkn6";

let code;

let playlistId;

let data = [];
let result = "";
let provincia = "";
let accessToken;
let refreshToken;
let API = "http://localhost:12345/workingplaces-stats/twitch_api";
if (dev) API = "http://localhost:12345/workingplaces-stats/twitch_api";

const URL_BASE = `https://id.twitch.tv/oauth2/authorize?{parameters}`;
const parameters =`response_type=code&client_id=${client_id}&redirect_uri=${API}&scope=channel%3Amanage%3Apolls+channel%3Aread%3Apolls&state=c3ab8aa609ea11e793ae92361f002671`;

const parameters_post =`client_id=${client_id}&client_secret=${client_secret}&code=${code}&grant_type=authorization_code&redirect_uri=${API}`;
onMount(async () => {});

function handleSubmit(event) {
    event.preventDefault();
    console.log(playlistId);
  }
async function getToken() {
    console.log("Comienzo");
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get('code');

    const grantType = 'authorization_code';
    const redirectUri = 'http://localhost:12345/workingplaces-stats/twitch_api';
    const postData = `client_id=${client_id}&client_secret=${client_secret}&code=${code}&grant_type=authorization_code&redirect_uri=${redirectUri}`;
 
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

  console.log(accessToken, refreshToken);
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
<div>
<a href="https://id.twitch.tv/oauth2/authorize?{parameters}">Connect with Twitch</a>
</div>
<div>
<a href="" on:click={getToken}>obtener token</a>
</div>
<div>
<a href="" on:click={ObtenerCanciones}>obtener Canciones</a>
</div>
{#each data as dato}
    <div>
        <img src={dato.album.image_url} alt={dato.album.name} />
        <a href="#">Título: {dato.album.name}</a>
    </div>
{/each}


</main>
<style>
</style>