<script>
    // @ts-nocheck

    import { onMount } from "svelte";
    import { dev } from "$app/environment";
    import {
        Button,
        Table,
        Modal,
        ModalBody,
        ModalFooter,
        ModalHeader,
        Alert, Col, Row
    } from "sveltestrap";

    let open = false;
    const toggle = () => (open = !open);

    onMount(async () => {
        getData();
    });

    let API = "/api/v2/workingplaces-stats";

    if (dev) API = "http://localhost:12345" + API;

    let data = [];
    let newData = {
        province: "Granada",
        year: 2045,
        work_place: 224.61,
        percentage_structure: 11.67,
        variation_rate: -0.3259,
    };
    let message = "";
    let color_alert;
    let result = "";
    let resultStatus = "";

   async function getData() {
        resultStatus = result = "";
        const res = await fetch(API, {
            method: "GET",
        });
        try {
            const data = await res.json();
            result = JSON.stringify(data, null, 2);
            dataWP = data;
        } catch (error) {
            console.log(`Error parsing result: ${error}`);
        }
        const status = await res.status;
        resultStatus = status;
        if (status == 400) {
            message = "Ha habido un error en la petición";
            color_alert = "danger";
        }
    }

    async function createData() {
        resultStatus = result = "";
        const res = await fetch(API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                province: newData.province,
                year: parseInt(newData.year),
                pib_current_price: newData.pib_current_price,
                pib_percentage_structure: newData.pib_percentage_structure,
                pib_variation_rate: newData.pib_variation_rate,
            }),
        });
        const status = await res.status;
        resultStatus = status;
        if (status == 201) {
            message = "Recurso creado correctamente";
            color_alert = "success";
            getData();
        }else{
            if (status == 400) {
                message = "Hay que insertar datos o faltan campos";
                color_alert = "danger";
            }else{
                if(status == 409){
                    message = "El recurso ya existe o la provincia tiene que ser de Andalucía";
                    color_alert = "danger";
                }
            }
        }
    }
    async function delete_All() {
        resultStatus = result = "";
        const res = await fetch(API, {
            method: "DELETE",
        });
        const status = await res.status;
        resultStatus = status;
        if (status == 200) {
            message = "Recursos borrados correctamente";
            color_alert = "success";
            getData();
        }
    }
    async function delete_Specif(province, year) {
        resultStatus = result = "";
        const res = await fetch(API + "/" + province + "/" + year, {
            method: "DELETE",
        });
        const status = await res.status;
        resultStatus = status;
        if (status == 200) {
            message = "Recurso borrado correctamente";
            color_alert = "success";
            getData();
        }
    }
</script>
    <div class="Headboard">
    <Row >
        <Col xs="7">
            <h2>
                Lugares de trabajo por Provincia
                <Button color="danger" on:click={toggle}>Borrar recursos</Button>
                <Modal isOpen={open} {toggle}>
                    <ModalHeader {toggle}>Procede a borrar todos los recursos</ModalHeader>
                    <ModalBody>¿Esta seguro?</ModalBody>
                    <ModalFooter>
                        <Button color="primary" on:click={delete_All}>Proceder</Button>
                        <Button color="secondary" on:click={toggle}>Cancelar</Button>
                    </ModalFooter>
                </Modal>
            </h2>
        </Col>
        <Col xs="4"> 
            {#if message != ""}
            <Alert fade={true} color={color_alert} dismissible>{message}</Alert>
        {/if}
        </Col>
    </Row>
</div>
<Table bordered striped>
    <thead>
        <tr>
            <th>Provincia</th>
            <th>Año</th>
            <th>Lugares de trabajo</th>
            <th>Estructura porcentual</th>
            <th>Tasas de variación</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><input bind:value={newData.province} /></td>
            <td><input bind:value={newData.year} /></td>
            <td><input bind:value={newData.work_place} /></td>
            <td><input bind:value={newData.percentage_structure} /></td>
            <td><input bind:value={newData.variation_rate} /></td>
            <td
                ><Button color="primary" on:click={createData}
                    >Crear recurso</Button
                ></td
            >
        </tr>

        {#each data as x}
            <tr>
                <td
                    ><a
                        class="perso"
                        href="/workingplaces-stats/{x.province}/{x.year}"
                        >{x.province}</a
                    ></td
                >
                <td>{x.year}</td>
                <td>{x.work_place}</td>
                <td>{x.percentage_structure}</td>
                <td>{x.variation_rate}</td>
                <td
                    ><Button
                        color="danger"
                        on:click={delete_Specif(x.province, x.year)}
                        >Borrar</Button
                    ></td
                >
                <td
                    ><Button on:click
                        ><a href="/workingplaces-stats/{x.province}/{x.year}"
                            >Editar</a
                        ></Button
                    ></td
                >
                <td>&nbsp</td>
            </tr>
        {/each}
    </tbody>
</Table>

<style>
    a {
        text-decoration: none;
        color: white;
    }
    .perso {
        color: #1e90ff;
    }
    .perso:hover {
        color: rgb(21, 41, 124);
        text-decoration: underline;
    }
    h2 {
        margin-left: 2%;
        margin-top: 0.5%;
    }
    .Headboard {
        margin-top: 1%;
        margin-left: 1.5%;
        margin-bottom: 1%;
    }
    *[bind^=""] {
        background-color: #f2f2f2;
    }
</style>
