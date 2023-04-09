    <div class="Headboard">
    <Row >
        <Col xs="7">
            <h2>
                Producto interior bruto a precios de mercado 
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
