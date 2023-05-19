<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import {Button,Table, Form, FormGroup, Label, Input} from "sveltestrap"; 
    let datam = [];
    var client_id = ""; 
    var client_secret = ""; 
    var acces_token;
    var refresh_token;

    const auth = "https://id.twitch.tv/oauth2/authorize"
    const token = "https://id.twitch.tv/oauth2/token";
    //let redirect_uri = "http://localhost:12345/workingplaces-stats/twitch_api"
    let response;
    let redirect_uri = "https://sos2223-21.ew.r.appspot.com/workingplaces-stats/twitch_api"
    let code;

    let playlistId;


    onMount(async () => {
        LocalStorageCharger();
    });

    async function LocalStorageCharger(){
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code');
        client_id = localStorage.getItem("client_id");
        client_secret = localStorage.getItem("client_secret");
        playlistId = localStorage.getItem("playlistId");
        if ( code ){
            asignacion_code();
            console.log("Hola");
        }
        else{
            acces_token = localStorage.getItem("acces_token");
            if (acces_token){
              getCanciones();
            }
            }
        }
        async function getAuth(){
        localStorage.setItem("client_id", client_id);
        localStorage.setItem("client_secret", client_secret);
        localStorage.setItem("playlistId", playlistId);
        let url = auth+"?client_id=" + client_id+ "&response_type=code"+ "&redirect_uri=" + redirect_uri;
        window.location.href = url;
    }

    async function asignacion_code(){
      console.log("entra en code")
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      code = urlParams.get('code');
      if (code){
        getToken();
      }
    }
    async function getToken() {
        console.log("entra en token")
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code');
        const grantType = 'authorization_code';

        const postData = `client_id=${client_id}&client_secret=${client_secret}&code=${code}&grant_type=authorization_code&redirect_uri=${redirect_uri}`;
        console.log(datam);
        response = await fetch(token, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: postData
      });

      const data = await response.json();
      acces_token = data.access_token;
      refresh_token = data.refresh_token;

      getCanciones();
    }
    async function getCanciones() {
      const authToken = acces_token;
      const responsePlaylist = await fetch(`https://api.twitch.tv/helix/soundtrack/playlist?id=${playlistId}`, {
        headers: {
          'Client-ID': client_id,
          'Authorization': `Bearer ${authToken}`
        }
      });
        let datos = await responsePlaylist.json();
        datam = datos.data;
    }
     

    
</script>
<main>
    <div>
            <Form>
                    <Label for="clientId">Client Id:</Label>
                    <Input type="text" name="text" id="clientId" bind:value={client_id}/>
                    <Label for="clientSecret">Client Secret:</Label>
                    <Input type="text" name="text" id="clientSecret" bind:value={client_secret}/>
                    <Label for="playlistId">Playlist ID:</Label>
                    <Input type="text" name="text" id="playlistId" bind:value={playlistId}/>
                    <Button color="primary" on:click={getAuth}>Pedir autorización</Button>
                    <Button color="primary" on:click={getCanciones}>Actualizar playlist</Button>
                
            </Form>    
            <div class="ImageContainer">
              {#each datam as dato}
                <div class="ImageBox">
                  <img class="Image" src={dato.album.image_url} alt={dato.album.name}>
                  <a class="Title" href="">{dato.album.name}</a>
                </div>
              {/each}
            </div>     
    </div>
</main>
<style>
  .ImageBox {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
  flex-basis: calc(33.33% - 20px);
}

.Image {
  max-width: 100px;
  height: auto;
  object-fit: cover;
}

.Title {
  margin-top: 5px;
  font-size: 18px;
  text-decoration: none;
  color: #333;
  text-align: center;
}
</style>