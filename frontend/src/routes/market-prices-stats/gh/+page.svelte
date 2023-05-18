<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import {Button,Table, Form, FormGroup, Label, Input } from "sveltestrap"; 

    var client_id_gh = ''; 
    var client_secret_gh = ''; 
    var access_token_gh = null;

    const AUTHORIZE = 'https://github.com/login/oauth/authorize';
    let redirect_uri = "https://sos2223-21.ew.r.appspot.com/market-prices-stats/gh"
    //let redirect_uri = 'http://localhost:12345/market-prices-stats/gh';
    const USER_INFO = 'https://api.github.com/user';

    let API = "/api/v2/market-prices-stats";

    let user_info = {};
    let followers = [];
    let following = [];
    let show_token_section = false;
    let show_gh_section = false;

    onMount(async () => {
        onPageLoad();
    });

    async function onPageLoad(){
        client_id_gh = localStorage.getItem("client_id_gh");
        client_secret_gh = localStorage.getItem("client_secret_gh");
        if ( window.location.search.length > 0 ){
            handleRedirect();
        }
        else{
            access_token_gh = localStorage.getItem("access_token_gh");
            if ( access_token_gh == null ){
                show_token_section = true;
            }
            else {
                show_token_section = false;
                show_gh_section = true;
                refreshGh();
            }
        }
    }
    async function handleRedirect(){
        let code = await getCode();
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
        let params = "?client_id=" + client_id_gh;
        params += "&client_secret=" + client_secret_gh;
        params += "&code=" + code; 
        params += "&redirect_uri=" + encodeURI(redirect_uri);
        callAuthorizationApi(params);
    }
    
    async function callAuthorizationApi(params) {
        await fetch(API +'/getAccessTokenGH'+params, {
            method: 'GET'
        }).then(response => {
            handleAuthorizationResponse(response);
        }).catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }
    async function handleAuthorizationResponse(data){
        const status = await data.status;
        if(status == 200){
            const data_res = await data.json();
            if ( data_res.access_token != undefined ){
                access_token_gh = data_res.access_token;
                localStorage.setItem("access_token_gh", access_token_gh);
            }
            onPageLoad();
        }else{
            console.log(status);
        }
    }
    async function callApi(method,url) {
        const res = await fetch(API+'/getGH_info'+'?access_token='+access_token_gh+'&url='+url, {
            method: method
        });
        const status = await res.status;
        if(status == 200){
            const data = await res.json();
            user_info = data;
            followers = [];
            following = [];
            followers = await addFollowers(user_info.followers_url);
            following = await addFollowing('https://api.github.com/users/'+user_info.login+'/following');
        }else{
            console.log(status);
        }
    }
    async function addFollowers(url){
        let list_followers = [];
        const res = await fetch(url, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + access_token_gh
            }
        });
        const status = await res.status;
        if(status == 200){
            const data = await res.json();
            data.forEach(item =>{
                list_followers.push({
                    id: item.id,
                    name: item.login,
                    url_image: item.avatar_url,
                    profile_url: item.html_url
                });
            });
        }else{
            console.log(status);
        }
       return list_followers;
    };
    async function addFollowing(url){
        let list_following = [];
        const res = await fetch(url, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + access_token_gh
            }
        });
        const status = await res.status;
        if(status == 200){
            const data = await res.json();
            data.forEach(item =>{
                list_following.push({
                    id: item.id,
                    name: item.login,
                    url_image: item.avatar_url,
                    profile_url: item.html_url
                });
            });
        }else{
            console.log(status);
        }
       return list_following;
    };
    async function refreshGh(){
        callApi("GET", USER_INFO);
    }
    async function requestAuthorization(){
        localStorage.setItem("client_id_gh", client_id_gh);
        localStorage.setItem("client_secret_gh", client_secret_gh); 
        let url = AUTHORIZE;
        url += "?client_id=" + client_id_gh;
        url += "&redirect_uri=" + encodeURI(redirect_uri);
        window.location.href = url; // redirect user to GitHub authorization page
    }
    async function revokeAccess(){
        localStorage.removeItem("access_token_gh");
        localStorage.removeItem("client_id_gh");
        localStorage.removeItem("client_secret_gh");
        show_token_section = true;
        show_gh_section = false;
        client_id_gh = ''; 
        client_secret_gh = ''; 
        access_token_gh = null;
    }
    
</script>
<main>
    <div class="container" style="margin-top: 1%;">
        {#if show_token_section == true}
            <div class="row" style="margin-bottom: 1%;">
                <h3>
                    Listar tus seguidores y seguidos de github usando OAUTH
                </h3>
                <p>
                    Para poder usar esta funcionalidad, tienes que ir al apartado de desarrolladores de github: <a href="https://github.com/settings/developers">https://github.com/settings/developers</a>,crear una APP de OAUTH para obtener Client Id y Secret, y añadir <strong>https://sos2223-21.ew.r.appspot.com/market-prices-stats/gh</strong> en el campo "Authorization callback URL".
                </p>
            </div>
            <Form>
                <FormGroup>
                    <Label for="clientId">Client Id</Label>
                    <Input type="textarea" name="text" id="clientId" bind:value={client_id_gh}/>
                </FormGroup>
                <FormGroup>
                    <Label for="clientSecret">Client Secret</Label>
                    <Input type="textarea" name="text" id="clientSecret" bind:value={client_secret_gh}/>
                </FormGroup>
                <FormGroup>
                    <Button color="primary" on:click={requestAuthorization}>Pedir autorización</Button>
                </FormGroup>
                
            </Form> 
        {/if}
        {#if show_gh_section == true}
            <div class="row">
                <div class="col-md-6" style="display: flex;">
                    <h3>Github info para el usuario:</h3> <img src={user_info.avatar_url} alt="Imagen de {user_info.login}" /><a href={user_info.html_url}><h3>{user_info.login}</h3></a>
                </div>
            </div>
            <div class="row">
                <h3>Biografía: {user_info.bio}</h3>
            </div>     
            <Button color="warning" on:click={refreshGh}>Recargar</Button>
            <Button color="danger" on:click={revokeAccess}>Limpiar credenciales</Button>
            <div class="row" style="margin-top: 1%;">
                <div class="col-md-6">
                    <Table  bordered striped>
                        <thead>
                            <tr>
                                <th> Seguidos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#if following.length === 0}
                                <td colspan="6"><p class="text-center">No hay datos.</p></td>
                            {:else}
                                {#each following as x}
                                    <tr>
                                        <td>
                                            <img src={x.url_image} alt="Imagen de {x.name}" /><a href={x.profile_url}>{x.name}</a>
                                        </td>
                                    </tr>
                                {/each}
                            {/if}
                        </tbody>
                    </Table>
                </div>
                <div class="col-md-6">
                    <Table  bordered striped>
                        <thead>
                            <tr>
                                <th>Seguidores</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#if followers.length === 0}
                                <td colspan="6"><p class="text-center">No hay datos.</p></td>
                            {:else}
                                {#each followers as x}
                                    <tr>
                                        <td>
                                            <img src={x.url_image} alt="Imagen de {x.name}" /><a href={x.profile_url}>{x.name}</a>
                                        </td>
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
    img{
        width: 50px;
        height: 50px;
        margin-right: 1%;
        border-radius: 25%;
    }
</style>