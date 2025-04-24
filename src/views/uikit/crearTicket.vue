<script>
import axios from 'axios';
import cryptoJS from 'crypto-js';
import Cookies from 'js-cookie';
export default{
    data(){
        return{
        us:'',
        nombre:'',    
        dropdownItems:[
            { name: 'Option 1', code: 'Option 1' },
            { name: 'Option 2', code: 'Option 2' },
            { name: 'Option 3', code: 'Option 3' }
        ],  
        estado_tik:[
            {name:'cerrado C.S',code:'option 1'},
            {name:'postergado',code:'option 2'},
            {name:'en proceso',code:'option 3'},
            {name:'cerrado S.S',code:'option 4'},
        ],
        regionales:null,
        localidad:[
            {name:'ciudad',code:'option 1'},
            {name:'provincia',code:'option 2'},
        ],
        PLOTEO:[
            {name:'pacena',code:'option 1'},
            {name:'pepsi',code:'option 2'},
            {name:'huari',code:'option 3'},
            {name:'Prost',code:'option 4'},
            {name:'H20',code:'option 5'}
        ],
        Marca:[
            {name:'metalfrio',code:'option 1'},
            {name:'imbera',code:'option 2'},
            {name:'otro',code:'option 3'}
        ],
        Tipo:[
            {name:'Choppera Cervezas',code:'101'},
            {name:'Heladera Cerveza',code:'102'},
            {name:'EDF Cervezas',code:'103'},
            {name:'EDF Gaseosas',code:'104'},
            {name:'Dispenser Gaseosas',code:'105'},
            {name:'Gondola',code:'106'},
            {name:'Camara de frio Cervezas',code:'107'},
            {name:'otro',code:'108'}
        ],
        op_solicitada:'',            
        equipo:'', 
        servicio:'',   
        clave:'extensis23435'   
        }
    },
    mounted(){
        this.getData();
        this.getRegionales();
        this.getEquipo();
        this.getServicio();
    },
    methods:{
        getData(){
            this.us= cryptoJS.AES.decrypt(Cookies.get('us'),this.clave).toString(cryptoJS.enc.Utf8);
            this.nombre= cryptoJS.AES.decrypt(Cookies.get('nombre'),this.clave).toString(cryptoJS.enc.Utf8);
        },
        getRegionales(){
            try {
                axios.get('https://mittril.com/fusioA/public/index.php/tik_regionales')
                .then(response=>{
                    
                    const data= response.data.entry;
                    this.regionales=data
                    console.log(this.regionales)
                })
                .catch(error=>{
                    console.log(error)                   
                })
            } catch (error) {
                
            }
        },
        getEquipo(){
            try {
                axios.get('https://mittril.com/fusioA/public/index.php/tik_equipo')
            .then(response=>{
                this.equipo= response.data.entry
            })
            .catch(error=>{
                console.log(error)
            })
            } catch (error) {
                
            }
        },
        getServicio(){
            try {
                axios.get(`https://mittril.com/fusioA/public/index.php/tik_listado_servicio/${1}`)
                .then(response=>{
                    console.log(response.data.entry)
                    this.servicio=response.data.entry.filter(item=> item.op_realizada !== '');
                    console.log(this.servicio)
                    this.op_solicitada= response.data.entry.filter(item=> item.op_solicitada !== null)
                    console.log(this.op_solicitada)
                })
            } catch (error) {
                
            }
        }
    },
    
}

</script>

<template>
<Fluid>
    <div class="flex mt-8">
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
                <div class="grid grid-cols-3 lg:grid-cols-3 sm:grid-cols-2 gap-2">
                    <div class=" space-y-2 w-full">
                        <label for="estado">Estado ticket</label><i class="pi pi-arrows-h"></i>
                        <Select id="estado"  :options="estado_tik" optionLabel="name" placeholder="Selecciona" class="w-full"></Select>
                    </div>
                    <div class="space-y-2  w-full">
                        <label for="phone">Fecha(asignado)</label><i class="pi pi-calendar"></i>
                        <DatePicker :showIcon="true" :showButtonBar="true" v-model="calendarValue"></DatePicker>
                    </div>
                    <div class="space-y-2  w-full">
                        <label for="phone">Fecha(Cerrado)</label><i class="pi pi-calendar"></i>
                        <DatePicker :showIcon="true" :showButtonBar="true" v-model="calendarValue"></DatePicker>
                    </div>
                </div>
                <div class="grid grid-cols-3 lg:grid-cols-3 sm:grid-cols-2 gap-2">
                    <div class=" space-y-2 w-full">
                        <label for="talonario">NRO. Talonario</label><i class="pi pi-hashtag"></i>
                        <InputText id="talonario" type="text"  />
                    </div>
                    <div class="space-y-2  w-full">
                        <label for="regional">Regional</label><i class="pi pi-sitemap"></i>
                        <Select id="regional"  :options="regionales" optionLabel="regional" placeholder="Selecciona" class="w-full"></Select>
                    </div>
                    <div class="space-y-2  w-full">
                        <label for="localidad">Localidad</label><i class="pi pi-sitemap"></i>
                        <Select id="localidad"  :options="localidad" optionLabel="name" placeholder="Selecciona" class="w-full"></Select>
                    </div>
                </div>
                <div class="grid grid-cols-2 lg:grid-cols-2 sm:grid-cols-2 gap-2">
                    <div class=" space-y-2 w-full">
                        <label for="PDV">Cod PDV</label><i class="pi pi-hashtag"></i>
                        <InputText id="PDV" type="text"  />
                    </div>
                    <div class="space-y-2  w-full">
                        <label for="fantasia">Nom. Fantansia</label><i class="pi pi-users"></i>
                        <InputText id="fantasia" type="text"  />
                    </div>
                </div>
                <div class="grid grid-cols-3 lg:grid-cols-3 sm:grid-cols-2 gap-2">
                    <div class=" space-y-2 w-full">
                        <label for="tipo">Tipo</label><i class="pi pi-arrow-circle-down"></i>
                        <Select id="tipo"  :options="Tipo" optionLabel="name" placeholder="Selecciona" class="w-full"></Select>
                    </div>
                    <div class="space-y-2  w-full">
                        <label for="PLOTEO">PLOTEO</label><i class="pi pi-arrow-circle-down"></i>
                        <Select id="PLOTEO"  :options="PLOTEO" optionLabel="name" placeholder="Selecciona" class="w-full"></Select>
                    </div>
                    <div class="space-y-2  w-full">
                        <label for="Marca">Marca</label><i class="pi pi-arrow-circle-down"></i>
                        <Select id="Marca"  :options="Marca" optionLabel="name" placeholder="Selecciona" class="w-full"></Select>
                    </div>
                </div>
                <div class="grid grid-cols-2 lg:grid-cols-2 sm:grid-cols-2 gap-2">
                    <div class=" space-y-2 w-full">
                        <label for="modelo">Modelo</label><i class="pi pi-arrow-circle-down"></i>
                        <Select id="modelo"  :options="equipo" optionLabel="modelo" placeholder="Selecciona" class="w-full"></Select>
                    </div>
                    <div class="space-y-2  w-full">
                        <label for="RG">Cod. RG</label><i class="pi pi-code"></i>
                        <InputText id="RG" type="text"  />
                    </div>
                </div>
                <div class="grid grid-cols-2 lg:grid-cols-2 sm:grid-cols-2 gap-2">
                    <div class=" space-y-2 w-full">
                        <label for="solicitada">Op. Solicitada</label><i class="pi pi-wrench"></i>
                        <Select id="solicitada"  :options="op_solicitada" optionLabel="op_solicitada" placeholder="Selecciona" class="w-full"></Select>
                    </div>
                    <div class="space-y-2  w-full">
                        <label for="reliazada">Op. Realizada</label><i class="pi pi-wrench"></i>
                        <Select id="realizada"  :options="servicio" optionLabel="op_realizada" placeholder="Selecciona" class="w-full"></Select>
                    </div>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-1 sm:grid-cols-1 gap-2">
                    <div class=" space-y-2 w-full">
                        <label for="repuestos">Repuestos</label><i class="pi pi-code"></i>
                        <InputText id="repuestos" type="text"  />
                    </div>
                </div>
                <div class="flex flex-wrap">
                    <label for="descripcion">Descripcion</label>
                    <Textarea id="descripcion" rows="4"/>
                </div>

                <div class="flex flex-wrap gap-2">
                    <Button label="Crear ticket" icon="pi pi-ticket" severity="success" raised />
                </div>                
            </div>
        </div>

</Fluid>    

</template>
