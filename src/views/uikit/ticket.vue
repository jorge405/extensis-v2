<script>
import axios from 'axios';
export default{
    data(){
        return{
        estado_tik:'',
        estado_tik_options:[
            {name:'cerrado C.S',code:'option 1'},
            {name:'postergado',code:'option 2'},
            {name:'en proceso',code:'option 3'},
            {name:'cerrado S.S',code:'option 4'},
        ],
        ticket:null,
        filtrado_estado:null,   
        }
    },
    mounted(){
        this.getTicket();
    },  
    methods:{
        async getTicket(){
            try {
                const response= await axios.get('https://mittril.com/fusioA/public/index.php/tik_list_ticket')
                console.log(response.data.entry)
                console.log(new Date())
                this.ticket=response.data.entry;
            } catch (error) {
                console.log(error);
            }
        },
        toggleDropdown(ticketId) {
            // Alternar la visibilidad del dropdown para la fila específica
            this.$set(this.dropdownVisible, ticketId, !this.dropdownVisible[ticketId]);
        }, 
        getTranscurrido(fechaAsignada) {
            // Lógica para calcular el tiempo transcurrido
            const fecha= new Date(fechaAsignada);
            const fechaActual = new Date();
            
            const diffTime = fechaActual - fecha;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            return diffDays;
            
        },
    },
    computed:{
        filtrado_estadotik(){
            console.log(this.estado_tik.name)

            
            const filtrado= this.ticket.filter((item) => item.estado_tik === this.estado_tik.name);
            this.filtrado_estado=filtrado;
            console.log(this.filtrado_estado)

        }
    },
    watch:{
        estado_tik(newValue) {
            // Lógica para filtrar la tabla según el nuevo valor de estado_tik
            this.filtrado_estadotik;
        },
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
            :value="filtrado_estado ? filtrado_estado : ticket"
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
                        <div class="w-full "> <span class=" font-bold">Solicitado:</span> {{ data.op_solicitada }}</div>
                        <p class="w-full "><span class=" font-bold">Realizado:</span> {{ data.op_realizada }}</p>
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
                <template #body="">
                    <div class="flex items-center gap-2">
                        <span></span>
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
                <template #body="">
                    <div class="flex items-center gap-2">
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
                        
                        <span v-if="getTranscurrido(data.fecha_asignada)> 0" class=" text-green-500 font-bold">{{ getTranscurrido(data.fecha_asignada) }} dias</span>
                        <span v-else-if="getTranscurrido(data.fecha_asignada)=== 0" class="text-yellow-500 font-bold">{{ getTranscurrido(data.fecha_asignada) }} dias</span>
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
                <template #body="">
                    <div class="flex items-center gap-2">
                        <span></span>
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