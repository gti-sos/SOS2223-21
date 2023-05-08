<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import {Button,Table, Form, FormGroup, Label, Input} from "sveltestrap"; 
    import axios from "axios"; 

    var client_id = ""; 
    var client_secret = ""; 
    let result = "";
    let resultStatus = "";
    var access_token = null;
    var refresh_token = null;

    const AUTHORIZE = "https://accounts.spotify.com/authorize"
    const TOKEN = "https://accounts.spotify.com/api/token";
    const PLAYLISTS = "https://api.spotify.com/v1/me/playlists";
    let redirect_uri = "http://localhost:12345/market-prices-stats/spotify"

    let playlists = [];
    let show_token_section = false;
    let show_playlists_section = false;

    onMount(async () => {
        onPageLoad();
    });

    async function onPageLoad(){
        client_id = localStorage.getItem("client_id");
        client_secret = localStorage.getItem("client_secret");
        if ( window.location.search.length > 0 ){
            handleRedirect();
        }
        else{
            access_token = localStorage.getItem("access_token");
            if ( access_token == null ){
                show_token_section = true;
            }
            else {
                show_token_section = false;
                show_playlists_section = true;
                refreshPlaylists();
            }
        }
    }
    async function handleRedirect(){
        let code = getCode();
        fetchAccessToken( code );
        window.history.pushState("", "", redirect_uri); // remove param from url
    }
    async function getCode(){
        let code = null;
        const queryString = window.location.search;
        if ( queryString.length > 0 ){
            const urlParams = new URLSearchParams(queryString);
            code = urlParams.get('code')
        }
        return code;
    }
    async function fetchAccessToken( code ){
        console.log(code); ///BORRAR
        let body = "grant_type=authorization_code";
        body += "&code=" + code; 
        body += "&redirect_uri=" + encodeURI(redirect_uri);
        body += "&client_id=" + client_id;
        body += "&client_secret=" + client_secret;
        callAuthorizationApi(body);
    }
    
    async function callAuthorizationApi(body) {
        result = resultStatus = "";
        const data = await axios.post(TOKEN, body, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(client_id + ":" + client_secret)
            }
        });
        console.log(data);
            //.then(response => handleAuthorizationResponse(response))
            //.catch(err => console.log(err));
    }
    async function handleAuthorizationResponse(data){
        const status = data.status;
        resultStatus = status;
        console.log(data);
        if(resultStatus == 200){
            const data = await res.json();
            result = JSON.stringify(data, null, 2);
            console.log(result);
            if ( result.access_token != undefined ){
                access_token = result.access_token;
                localStorage.setItem("access_token", access_token);
            }
            if ( result.refresh_token  != undefined ){
                refresh_token = result.refresh_token;
                localStorage.setItem("refresh_token", refresh_token);
            }
            onPageLoad();
        }else{
            console.log(res);
        }
    }
    
        
    async function callApi(method, url, body) {
        result = resultStatus = "";
        const res = await fetch(url, {
            method: method,
            headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + access_token
            },
            body: body
        });
        const status = await res.status;
        resultStatus = status;
        if(status == 200){
            const data = await res.json();
            result = JSON.stringify(data, null, 2);
            console.log(result);
            playlists = [];
            result.items.forEach(item => addPlaylist(item)); //or item.name??
        }else if (status === 401 ){
            refreshAccessToken();
        }else{
            console.log(res);
            alert(res); //?????
        }
    }
    async function addPlaylist(item){
        playlists.push({
            id: item.id,
            name: item.name,
            tracks: item.tracks.total
        });
    }
    async function refreshAccessToken(){
        refresh_token = localStorage.getItem("refresh_token");
        let body = "grant_type=refresh_token";
        body += "&refresh_token=" + refresh_token;
        body += "&client_id=" + client_id;
        callAuthorizationApi(body);
    }
    async function refreshPlaylists(){
        callApi( "GET", PLAYLISTS, null);
    }
    async function requestAuthorization(){
        localStorage.setItem("client_id", client_id);
        localStorage.setItem("client_secret", client_secret); // In a real app you should not expose your client_secret to the user
        let url = AUTHORIZE;
        url += "?client_id=" + client_id;
        url += "&response_type=code";
        url += "&redirect_uri=" + encodeURI(redirect_uri);
        url += "&show_dialog=true";
        url += "&scope=playlist-read-private";
        window.location.href = url; // Show Spotify's authorization screen
    }
    
</script>
<main>
    <div class="container" style="margin-top: 1%;">
        {#if show_token_section == true}
            <div class="row" style="margin-bottom: 1%;">
                <h2>
                    Listar tus playlist de spotify usando OAUTH2.0
                </h2>
                <p>
                    Para poder usar esta funcionalidad, tienes que ir a la página de desarrolladores de spotify: <a href="https://developer.spotify.com/dashboard/applications">https://developer.spotify.com/dashboard/applications</a> y añadir <strong>https://sos2223-21.ew.r.appspot.com/market-prices-stats/spotify</strong> en el campo "Redirect URIs".
                </p>
            </div>
            <Form>
                <FormGroup>
                    <Label for="clientId">Client Id</Label>
                    <Input type="textarea" name="text" id="clientId" bind:value={client_id}/>
                </FormGroup>
                <FormGroup>
                    <Label for="clientSecret">Client Secret</Label>
                    <Input type="textarea" name="text" id="clientSecret" bind:value={client_secret}/>
                </FormGroup>
                <FormGroup>
                    <Button color="primary" on:click={requestAuthorization}>Request Authorization</Button>
                </FormGroup>
                
            </Form> 
        {/if}
        {#if show_playlists_section == true}
            <div class="row">
                <div class="col-md-6">
                    <Table  bordered striped>
                        <thead>
                            <tr>
                                <th> <h3 style="margin-right: 1%;">Playlists</h3> <Button color="warning" on:click={refreshPlaylists}>Refresh Playlists</Button></th>
                            </tr>
                        </thead>
                        <tbody>
                            {#if playlists.length == 0}
                                <td colspan="6"><p class="text-center">No hay datos.</p></td>
                            {:else}
                                {#each playlists as x}
                                    <tr>
                                        <td>{x.name +"("+x.tracks+")" }</td>
                                    </tr>
                                {/each}
                            {/if}
                        </tbody>
                    </Table>
                </div>
            </div>
        {/if}  
    </div>
</main>
<style>
    th {
        background-color: #1e90ff;
        color: white;
        font-weight: bold;
        display: flex;
    }
</style>