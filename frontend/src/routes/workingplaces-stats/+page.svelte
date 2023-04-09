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

    let dataWP = [];
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


</script>
    <div class="Headboard">
    <Row >
        <Col xs="7">
            <h2>
                Puestos de trabajo totales 
                <Button color="danger" on:click={toggle}>Borrar recursos</Button>
                <Modal isOpen={open} {toggle}>
                    <ModalHeader {toggle}>Proce a borrar todos los recursos</ModalHeader>
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
    
</style>
