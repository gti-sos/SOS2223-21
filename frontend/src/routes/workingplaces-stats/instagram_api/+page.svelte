<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import {Button,Table, Form, FormGroup, Label, Input} from "sveltestrap"; 
    let datam = [];
    var client_id_Ins = ""; 
    var client_secret_Ins = ""; 
    var acces_token;
    var refresh_token;

    const auth = "https://instagram.com/oauth/authorize"
    const token = "https://api.instagram.com/oauth/access_token";
    //let redirect_uri = "https://localtest.me:12345/workingplaces-stats/instagram_api"
    let response;
    let redirect_uri = "https://sos2223-21.ew.r.appspot.com/workingplaces-stats/instagram_api"
    let code;

    let userId;


    onMount(async () => {
        LocalStorageCharger();
    });

    async function LocalStorageCharger(){
        console.log(redirect_uri);
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code');
        client_id_Ins = localStorage.getItem("client_id_Ins");
        client_secret_Ins = localStorage.getItem("client_secret_Ins");
        userId = localStorage.getItem("userId");
        if ( code ){
            asignacion_code();
            
        }
        else{
            acces_token = localStorage.getItem("acces_token");
            if (acces_token){
              getCanciones();
            }
            }
        }
        async function getAuth(){
        localStorage.setItem("client_id_Ins", client_id_Ins);
        localStorage.setItem("client_secret_Ins", client_secret_Ins);
        localStorage.setItem("userId", userId);
        let url = auth+"?client_id=" + client_id_Ins+ "&response_type=code"+ "&redirect_uri=" + redirect_uri+"&scope=user_profile";
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

        const postData = `client_id=${client_id_Ins}&client_secret=${client_secret_Ins}&code=${code}&grant_type=authorization_code&redirect_uri=${redirect_uri}`;
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

      getUsuarios();
    }
    async function getUsuarios() {
      const authToken = acces_token;
      const response = await fetch(`https://graph.instagram.com/{userId}`, {
        headers: {
          'Client-ID': client_id,
          'Authorization': `Bearer ${authToken}`
        }
      });
        let datos = await response.json();
        datam = datos.data;
    }
     

    
</script>
<main>
<div>
            <Form>
                    <Label for="clientId">Client Id:</Label>
                    <Input type="text" name="text" id="clientId" bind:value={client_id_Ins}/>
                    <Label for="clientSecret">Client Secret:</Label>
                    <Input type="text" name="text" id="clientSecret" bind:value={client_secret_Ins}/>
                    <Label for="userId">userId:</Label>
                    <Input type="text" name="text" id="userId" bind:value={userId}/>
                    <Button color="primary" on:click={getAuth}>Pedir autorización</Button>
                    <Button color="primary" on:click={getUsuarios}>Actualizar Usuarios</Button>
                
            </Form>       
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