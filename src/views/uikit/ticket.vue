<script>
import axios from 'axios';
import cryptoJS from 'crypto-js';
import Cookies from 'js-cookie';
export default{
    data(){
        return{
        clave:'extensis23435',    
        display:false,
        estado_tik:'',
        selectedUser:null,
        estado_tik_options:[
            {name:'cerrado C.S',code:'option 1'},
            {name:'postergado',code:'option 2'},
            {name:'en proceso',code:'option 3'},
            {name:'cerrado S.S',code:'option 4'},
        ],
        ticket:null,
        filtrado_estado:null,
        listUser:null,
        userSelected:null,
        ticketSelected:null   
        }
        
    },
    mounted(){
        this.getTicket();
        this.op=this.$refs.op;
    },  
    methods:{
        async getTicket(){
            try {
                const response= await axios.get('https://mittril.com/fusioA/public/index.php/tik_list_ticket')
                console.log(response.data.entry)
                
                this.ticket=response.data.entry;
            } catch (error) {
                console.log(error); 
            }
        },
        
        getTranscurrido(fechacreacion) {
            // Lógica para calcular el tiempo transcurrido
            const fecha= new Date(fechacreacion);
            const fechaActual = new Date();
            console.log(fechaActual)
            const diffTime = fechaActual - fecha;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            console.log(diffDays)
            return diffDays;
            
        },
        async aprobar(){
            const fecha_actual = new Date();
                        const us = cryptoJS.AES.decrypt(Cookies.get('us'), this.clave).toString(cryptoJS.enc.Utf8);
                        const ps = cryptoJS.AES.decrypt(Cookies.get('pass'), this.clave).toString(cryptoJS.enc.Utf8);

                        const anio = fecha_actual.getFullYear();
                        const mes = String(fecha_actual.getMonth() + 1).padStart(2, '0'); // Mes empieza en 0
                        const dia = String(fecha_actual.getDate()).padStart(2, '0');
                        const fecha_formateada = `${anio}/${mes}/${dia}`;
                        try {
                            const responseUpdateTicket= await axios.post('https://mittril.com/fusioA/public/index.php/tik_update_tk',{
                                us: us,
                                ps: ps,
                                cod_PDV: parseInt(this.ticketSelected.cod_fantasia),
                                cod_equipo: parseInt(this.ticketSelected.cod_equipo),
                                cod_transporte: null,
                                cod_usuario:us,
                                asignado:this.userSelected.nombre,
                                nro_talonario: parseInt(this.nro_talonario),
                                fecha_creacion: this.ticketSelected.fecha_creacion,
                                fecha_asignada: fecha_formateada,
                                fecha_cs: null,
                                fecha_ss: null,
                                status: null,
                                estado_tik: this.ticketSelected.estado_tik,
                                precio_servicio: null,
                                status_temp: null,
                                cobro: null,
                                dias_plazo: null,
                                resolucion: null,
                                postergacion: null,
                                op_solicitada: this.ticketSelected.op_solicitada,
                                op_realizada: this.ticketSelected.op_realizada,
                                descripcion: this.ticketSelected.descripcion,
                                canal: null,
                                carga_masiva: null,
                                estado_int: 1,
                                cod_ticket:parseInt(this.ticketSelected.cod_ticket)
                            })
                            
                            if (responseUpdateTicket.data.msg==='actualizado') {
                                this.$toast.add({
                                    severity:'success',
                                    summary:'Extensis',
                                    detail:`Ticket aprobado`,
                                    life:3000
                                })
                                this.getTicket();
                                this.close();
                            }else{
                                this.$toast.add({
                                    severity:'error',
                                    summary:'Extensis',
                                    detail:`Error al aprobar el ticket`,
                                    life:3000
                                })
                            }
                        } catch (error) {
                            console.log(error)
                            this.$toast.add({
                                severity:'error',
                                summary:'Extensis',
                                detail:`Error en el servidor`,
                                life:3000
                            })
                        }
        },
        open(seleccionado){
            this.display = true;
            this.getListUser();
            this.ticketSelected=seleccionado.data;
            console.log(seleccionado.data)
        },
        close(){
            this.display = false;
        },
        async getListUser(){
            try {
                const response = await axios.get(`https://mittril.com/fusioA/public/index.php/tik_list_usuario/OPERADOR`)
                console.log(response.data.entry)
                this.listUser=response.data.entry;
            } catch (error) {
                console.log(error);
            }
        },
        mensaje(){
            this.$toast.add({
                severity:'info',
                summary:'Ticket',
                detail:`usuario: ${this.userSelected.nombre} asignado al ticket`,
                life:3000
            })
        },
        
    },
    computed:{
        filtrado_estadotik(){
            /*const filtrado= this.ticket.filter((item) => item.estado_tik === this.estado_tik.name);
            return this.filtrado_estado=filtrado; */
            if(!this.estado_tik || !this.estado_tik.name) return this.ticket;
            return this.ticket ? this.ticket.filter((item)=> item.estado_tik===this.estado_tik.name) : [];
        },
        
    },
    watch:{
        
        userSelected(newval) {
            // Lógica para manejar el cambio en userSelected
            this.mensaje()
        }
    }
    
}

</script>

<template>
<div class="flex mt-3">
<div class="card flex flex-col gap-4 w-full">
    <div class="w-1/5 flex flex-col gap-4">
        <label for="estado" class=" font-semibold text-xl">Estado:</label>
        <Select id="estado"  :options="estado_tik_options" optionLabel="name" v-model="estado_tik" placeholder="Selecciona" class="w-full"></Select>
    </div>
    <div class=" flex-grow"></div>
    <div class="font-semibold text-xl mb-4">Lista Tickets</div>
        <DataTable
            :value="filtrado_estadotik"
            :paginator="true"
            :rows="10"
            dataKey="cod_ticket"
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
                        <InputText  placeholder="Busqueda" />
                    </IconField>
                </div>
            </template>
            <template #empty> No existe tickets . </template>
            <template #loading> cargando datos tickets. Porfavor espere. </template>
            <Column header="Estado"  style="min-width: 14rem">
                <template #body="{ data }">
                    <div class="items-center gap-2">
                        <div class=" rounded-md p-2 text-white w-1/2" :class=" data.estado_tik ==='cerrado S.S' ? 'bg-green-700' : data.estado_tik==='postergado' ? 'bg-orange-500' : data.estado_tik==='en proceso' ? 'bg-sky-600' : 'bg-green-700'">{{ data.estado_tik }}</div>
                        <p class=" text-sm">Ticket: {{ data.cod_ticket }}</p>
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
            <Column header="PDV N Fantasia "  style="min-width: 12rem">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ data.cod_PDV }}</span>
                        <br>
                        <span>{{ data.nombre_fantasia }}</span>
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
            <Column header="RG"  style="min-width: 12rem">
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
            <Column header="Remitente"  style="min-width: 14rem">
                <template #body="">
                    <div class="flex items-center gap-2">
                        <span></span>
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
            <Column header="Operacion"  style="min-width: 12rem">
                <template #body="{ data }">
                    <div class=" items-center gap-2">
                        <div class="w-full "> <span class=" font-bold text-green-800 dark:text-green-700">Solicitado:</span> {{ data.op_solicitada }}</div>
                        <p class="w-full "><span class=" font-bold text-green-800 dark:text-green-700">Realizado:</span> {{ data.op_realizada }}</p>
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
            <Column header="Region"  style="min-width: 12rem">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ data.regional }}</span>
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
            <Column header="Asignado"  style="min-width: 12rem">
                <template #body="{data}">
                    <div class="flex items-center gap-2">
                        <span>{{ data.asignado }}</span>
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
            <Column header="Acciones"  style="min-width: 12rem">
                <template #body="data">
                    <div class="flex items-center gap-2">
                        <button class="bg-yellow-500 p-4 rounded-md text-white" @click="open(data)">Aprobar <i class="pi pi-check"></i></button>
                        <button class=" bg-slate-700 p-4 rounded-md text-white">Detalles <i class="pi pi-window-maximize"></i></button>
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
            <div class="card">                
                <Dialog header="Aprobar Ticket" v-model:visible="display" :breakpoints="{ '960px': '75vw' }" :style="{ width: '30vw' }" :modal="true">
                    <h3 class=" font-bold text-xl">Lista operadores</h3>
                    <hr class=" bg-green-600">
                    <DataTable  :value="listUser" v-model:selection="userSelected" selectionMode="single" :paginator="true" :rows="5" >
                            <Column header="Nombre">
                                <template #body="slotProps">{{ slotProps.data.nombre }}</template>
                            </Column>
                            <Column header="Tipo">
                                <template #body="slotProps">{{ slotProps.data.tipo }}</template>
                            </Column>
                            <Column header="Asignar">
                                <template #body="">
                                    <Button icon="pi pi-user" severity="info" rounded />
                                </template>
                            </Column>
                    </DataTable>
                    <template #footer>
                        <Button severity="info" label="Aprobar"  @click="aprobar"></Button>
                        <Button severity="danger" label="Cancelar"  @click="close" />
                    </template>
                </Dialog>
            </div>
            <Column header="Aprobado"  style="min-width: 12rem">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ data.fecha_asignada }}</span>
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
            <Column header="Transcurrido"  style="min-width: 12rem">
                <template #body="{ data }">
                    <div class="items-center gap-2">
                        
                        <span v-if="getTranscurrido(data.fecha_creacion)> 0" class=" text-green-500 font-bold">{{ getTranscurrido(data.fecha_creacion) }} dias</span>
                        <span v-else-if="getTranscurrido(data.fecha_creacion)=== 0" class="text-yellow-500 font-bold">{{ getTranscurrido(data.fecha_creacion) }} dias</span>
                        <span v-else class="text-red-500 font-bold">Atrasado</span>
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
            <Column header="Atencion aprox."  style="min-width: 12rem">
                <template #body="{ data}">
                    <div class="flex items-center gap-2">
                        <span>{{ data.fecha_creacion }}</span>
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
</template>