<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import {Button,Table, Form, FormGroup, Label, Input} from "sveltestrap"; 

    var client_id = '457748f50b8331da0e26'; 
    var client_secret = 'f2678bb58c81c17850e17f0ae5fc3cf6c75eaed8'; 
    var access_token = null;

    const AUTHORIZE = 'https://github.com/login/oauth/authorize';
    const TOKEN = 'https://github.com/login/oauth/access_token';
    //let redirect_uri = "https://sos2223-21.ew.r.appspot.com/market-prices-stats/graphql"
    let redirect_uri = 'http://localhost:12345/market-prices-stats/gh';
    
    let oauth_api = 'http://localhost:12345/market-prices-stats/oauth_server'

    let followers = [];
    let result = "";
    let resultStatus = "";
    let show_token_section = false;
    let show_playlists_section = false;

    onMount(async () => {
        onPageLoad();
    });

    async function onPageLoad(){
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
    async function requestAuthorization(){
        window.location.href = AUTHORIZE + "?client_id=" + client_id;
    }
    async function handleRedirect(){
        let code = getCode();
        console.log(code);
        //fetchAccessToken( code );
        window.history.pushState("", "", redirect_uri); // remove param from url
    }
    async function getCode(){
        let code = null;
        const queryString = window.location.search;
        if ( queryString.length > 0 ){
            const urlParams = new URLSearchParams(queryString);
            code = urlParams.get('code');
        }
        return code;
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
                            {#if followers.length == 0}
                                <td colspan="6"><p class="text-center">No hay datos.</p></td>
                            {:else}
                                {#each followers as x}
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