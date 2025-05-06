<script>
import axios from 'axios';
import cryptoJS from 'crypto-js';
import Cookies from 'js-cookie';
export default{
    data(){
        return{
        us:'',
        nombre:'',    
        estado_tik:[
            {name:'cerrado C.S',code:'option 1'},
            {name:'postergado',code:'option 2'},
            {name:'en proceso',code:'option 3'},
            {name:'cerrado S.S',code:'option 4'},
        ], 
        Equipo:null,
        clave:'extensis23435'   
        }
    },
    mounted(){
        this.getData();
        this.getEquipo();
    },
    methods:{
        getData(){
            this.us= cryptoJS.AES.decrypt(Cookies.get('us'),this.clave).toString(cryptoJS.enc.Utf8);
            this.nombre= cryptoJS.AES.decrypt(Cookies.get('nombre'),this.clave).toString(cryptoJS.enc.Utf8);
        },
        getEquipo(){
            try {
                axios.get('https://mittril.com/fusioA/public/index.php/tik_equipo')
                .then(response=>{
                    this.Equipo=response.data.entry;
                    console.log(this.Equipo);
                })
                .catch(error=>{
                    console.log(error)                   
                })
            } catch (error) {
                
            }
        }
    },
    
}

// quitado de tabla v-model:filters="filters1" despues  :rowHover despues de loading :filters="filters1" despues de f:filters1 :globalFilterFields="['name', 'country.name', 'representative.name', 'balance', 'status']"
</script>

<template>
<Fluid>
    <div class="flex mt-8">
            <div class="grid grid-cols-2 gap-4">
                <div class="card flex flex-col gap-4 w-full">
                    <div class="font-semibold text-xl">Crear ticket</div>
                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="firstname2">Usuario</label><i class="pi pi-user"></i>
                            <InputText id="firstname2" type="text" v-model="us" disabled />
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="lastname2">Nombre</label><i class="pi pi-id-card"></i>
                            <InputText id="lastname2" type="text" v-model="nombre" disabled />
                        </div>
                    </div>
                    <hr class=" bg-blue-700 h-1 rounded-full" />
                    
                    
                        <div class=" space-y-2 w-full">
                            <label for="tipo">Tipo</label><i class="pi pi-hashtag"></i>
                            <InputText id="tipo" type="text"  />
                        </div>
                        <div class="space-y-2  w-full">
                            <label for="modelo">Modelo</label><i class="pi pi-hashtag"></i>
                            <InputText id="modelo" type="text"  />
                        </div>
                        <div class="space-y-2  w-full">
                            <label for="marca">Marca</label><i class="pi pi-hashtag"></i>
                            <InputText id="marca" type="text"  />
                        </div>
                        <div class=" space-y-2 w-full">
                            <label for="PLOTEO">PLOTEO</label><i class="pi pi-hashtag"></i>
                            <InputText id="PLOTEO" type="text"  />
                        </div>
                
                    <div class="grid grid-cols-2 lg:grid-cols-2 sm:grid-cols-2 gap-2">
                        <div class="space-y-2  w-full">
                            <label for="cod_reg">COD REG</label><i class="pi pi-hashtag"></i>
                            <InputText id="cod_reg" type="text"  />
                        </div>
                        <div class="space-y-2  w-full">
                            <label for="rg_nuevo">RG NUEVO</label><i class="pi pi-hashtag"></i>
                            <InputText id="rg_nuevo" type="text"  />
                        </div>
                    </div>
                    
                    <div class="flex flex-wrap gap-2">
                        <Button label="Crear Equipo" icon="pi pi-stop" severity="success" raised />
                    </div>                
                </div>
            <!-- tabla lista de equipos-->
            <div class="card flex flex-col gap-4 w-full">
                <div class="font-semibold text-xl mb-4">Lista Equipos</div>
        <DataTable
            :value="Equipo"
            :paginator="true"
            :rows="10"
            dataKey="cod_equipo"
            :rowHover="true"            
            filterDisplay="menu"
            :loading="loading1"
            showGridlines
        >
            <template #header>
                <div class="flex justify-between">
                    
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText  placeholder="Keyword Search" />
                    </IconField>
                </div>
            </template>
            <template #empty> No existe equipo . </template>
            <template #loading> cargando datos equipo. Porfavor espere. </template>
            <Column field="tipo" header="Tipo" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.tipo }}
                </template>
                <!--<template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
                </template>-->
            </Column>
            <Column header="modelo"  style="min-width: 12rem">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ data.modelo }}</span>
                    </div>
                </template>
                <!--<template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Search by country" />
                </template>
                <template #filterclear="{ filterCallback }">
                    <Button type="button" icon="pi pi-times" @click="filterCallback()" severity="secondary"></Button>
                </template>
                <template #filterapply="{ filterCallback }">
                    <Button type="button" icon="pi pi-check" @click="filterCallback()" severity="success"></Button>
                </template>-->
            </Column>
            <Column header="marca"  style="min-width: 14rem">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ data.marca }}</span>
                    </div>
                </template>
                <!--<template #filter="{ filterModel }">
                    <MultiSelect v-model="filterModel.value" :options="representatives" optionLabel="name" placeholder="Any">
                        <template #option="slotProps">
                            <div class="flex items-center gap-2">
                                <img :alt="slotProps.option.name" :src="`https://primefaces.org/cdn/primevue/images/avatar/${slotProps.option.image}`" style="width: 32px" />
                                <span>{{ slotProps.option.name }}</span>
                            </div>
                        </template>
                    </MultiSelect>
                </template>-->
            </Column>
            <Column header="PLOTEO"  style="min-width: 12rem">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ data.PLOTEO }}</span>
                    </div>
                </template>
                <!--<template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Search by country" />
                </template>
                <template #filterclear="{ filterCallback }">
                    <Button type="button" icon="pi pi-times" @click="filterCallback()" severity="secondary"></Button>
                </template>
                <template #filterapply="{ filterCallback }">
                    <Button type="button" icon="pi pi-check" @click="filterCallback()" severity="success"></Button>
                </template>-->
            </Column>
            <Column header="COD_REG"  style="min-width: 12rem">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ data.COD_REG }}</span>
                    </div>
                </template>
                <!--<template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Search by country" />
                </template>
                <template #filterclear="{ filterCallback }">
                    <Button type="button" icon="pi pi-times" @click="filterCallback()" severity="secondary"></Button>
                </template>
                <template #filterapply="{ filterCallback }">
                    <Button type="button" icon="pi pi-check" @click="filterCallback()" severity="success"></Button>
                </template>-->
            </Column>
            <Column header="RG_NUEVO"  style="min-width: 12rem">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ data.RG_NUEVO }}</span>
                    </div>
                </template>
                <!--<template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Search by country" />
                </template>
                <template #filterclear="{ filterCallback }">
                    <Button type="button" icon="pi pi-times" @click="filterCallback()" severity="secondary"></Button>
                </template>
                <template #filterapply="{ filterCallback }">
                    <Button type="button" icon="pi pi-check" @click="filterCallback()" severity="success"></Button>
                </template>-->
            </Column>
            <!--<Column header="Date" filterField="date" dataType="date" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ formatDate(data.date) }}
                </template>
                <template #filter="{ filterModel }">
                    <DatePicker v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
                </template>
            </Column>-->
            <!--<Column header="Balance" filterField="balance" dataType="numeric" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ formatCurrency(data.balance) }}
                </template>
                <template #filter="{ filterModel }">
                    <InputNumber v-model="filterModel.value" mode="currency" currency="USD" locale="en-US" />
                </template>
            </Column>-->
        </DataTable>

                
            </div>
            </div>
        </div>

</Fluid>    

</template>
