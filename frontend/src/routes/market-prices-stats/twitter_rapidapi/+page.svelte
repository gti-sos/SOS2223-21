<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import {Button, Form, FormGroup, Label, Input, Table } from "sveltestrap"; 

    let result = null;
    let show_section = true;
    let key_series = "";
    let twitter_username = "omarmhaimdat";

    onMount(async () => {
        onPageLoad();
    });

    async function onPageLoad(){
        if ( result != null){
            show_section = false;
        } 
    }
   
    async function requestInfo(){
        const res = await fetch('https://twitter154.p.rapidapi.com/user/details'+'?username='+twitter_username, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': key_series,
                'X-RapidAPI-Host': 'twitter154.p.rapidapi.com'
            }
        });
        const status = await res.status;
        if(status == 200){
            const data = await res.json();
            console.log(data);
            result = await formatData(data);
            onPageLoad();
        }else{
            console.log(status);
        }
    };
    async function formatData(data){
        let formated_serie = {
            profile_url: `https://twitter.com/${data.username}`,
            username: data.username,
            user_image: data.profile_pic_url,
            user_banner: data.profile_banner_url,
            name: data.name,
            favourites: data.favourites_count,
            followers: data.follower_count,
            following: data.following_count,
            tweets: data.number_of_tweets,
            blue_verified: data.is_blue_verified
        };
        return formated_serie;
    }
    async function resetInfo(){
        show_section = true;
        twitter_username = "";
        result = [];
    }
    
   
</script>
<main>
    <div class="container" style="margin-top: 1%;">
        {#if show_section == true}
            <div class="row" style="margin-bottom: 1%;">
                <h2>
                    Ver información de usuario de twitter a través de API de rapidApi
                </h2>
                <p>
                    Para poder usar esta funcionalidad, tienes que ir a la API de rapidApi: <a href="https://rapidapi.com/omarmhaimdat/api/twitter154">/omarmhaimdat/api/twitter154</a> y añadir de forma <strong>gratuita</strong> una RapidApiKey propia.
                </p>
                <p>
                    Una vez tengas la RapidApiKey, añadela en el campo de abajo y el nombre de usuario de twitter que quieras buscar. Por ejemplo: <a href="https://twitter.com/omarmhaimdat">@omarmhaimdat</a>
                </p>
            </div>
            <Form>
                <FormGroup>
                    <Label for="key_serie">Key de RapidApi Twitter154</Label>
                    <Input type="textarea" name="text" id="key_serie" bind:value={key_series}/>
                </FormGroup>
                <FormGroup>
                    <Label for="username">Usuario de twitter</Label>
                    <Input type="textarea" name="text" id="username" bind:value={twitter_username}/>
                </FormGroup>
                <FormGroup>
                    <Button color="primary" on:click={requestInfo}>Buscar info</Button>
                </FormGroup>
                
            </Form> 
        {:else}
        <div class="row" style="display: flex;">
           <h4>
                Información del usuario: <a href={result.profile_url}>{result.username}</a>
            </h4> 
        </div>    
        <div class="row" id="photos">
            <img  class="profile_pic" src={result.user_image} alt="user_image"/>            
            <img  class="banner" src={result.user_banner} alt="user_banner"/>
        </div>
        <Table  bordered striped>
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Nombre</th>
                    <th>Tweets</th>
                    <th>Favoritos</th>
                    <th>Seguidores</th>
                    <th>Siguiendo</th>
                    <th>Verificado Blue</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{result.username}</td>
                    <td>{result.name}</td>
                    <td>{result.tweets}</td>
                    <td>{result.favourites}</td>
                    <td>{result.followers}</td>
                    <td>{result.following}</td>
                    <td>{result.blue_verified}</td>
                </tr>
            </tbody>
        </Table>
            
        <Button color="warning" on:click={resetInfo}>Buscar otro usuario</Button>   
        {/if}
    </div>
</main>
<style>
    #photos{
        margin-bottom: 1%;
        display: flex;
        align-items: center;
    }
    .profile_pic{
        width: 6%;
        border-radius: 20% !important;
    }
    .banner{
        width: 40%;
    }
    th {
        background-color: #1e90ff;
        color: white;
        font-weight: bold;
    }
</style>