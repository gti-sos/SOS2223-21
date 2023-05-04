<script>
    import {Icon,ButtonDropdown,DropdownItem,DropdownMenu,DropdownToggle,Nav,NavItem,NavLink,} from "sveltestrap";
</script>

<div>
    <Nav>
        <h2>SOS2223-21 </h2>
        <NavLink href="/"><h6>Inicio</h6> <Icon name="house-fill"/></NavLink>
        <NavItem><ButtonDropdown>
                <DropdownToggle color="" style="font-weight:bold" caret>Front-ends</DropdownToggle>
                <DropdownMenu>
                    <DropdownItem header>Tipos:</DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem><a href="/market-prices-stats">market-prices-stats</a></DropdownItem>
                    <DropdownItem><a href="/workingplaces-stats">workingplaces-stats</a></DropdownItem>
                    <DropdownItem><a href="/salaried-stats">salaried-stats</a></DropdownItem>
                </DropdownMenu>
            </ButtonDropdown>
        </NavItem>
        <NavLink href="/integrations"><h6>Integraciones</h6></NavLink>
        <NavLink href="/analytics"><h6>Analítica</h6></NavLink>
        <NavLink href="/graphics"><h6>Gráficos</h6></NavLink>
        <NavLink href="/about"><h6>Acerca de</h6></NavLink>
    </Nav>
</div>

<style>
    a {
        color: #1e90ff;
        text-decoration: none;
        font-weight: bold;
    }
    div {
        background-color: #1e90ff;
        color: #ffffff;
        padding: 5px;   
    }
    h2 {
        font-size: 25px;
        font-weight: normal;
        margin-right: 1%;
        margin-left: 1%;
    }
    h6{
        color: white;
    }
</style>
