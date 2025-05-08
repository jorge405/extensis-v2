<script>
import axios from 'axios';
import cryptoJS from 'crypto-js';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
export default{
    data(){
        return{
        us:'',
        ps:'',
        nombre:'', 
        cod_fantasia:null,
        cod_equipo:null,
        cod_PDV:null, 
        cod_regional:null,
        nombre_fantasia:null,
        ubicacion:null,
        errores:{},
        dropdownItems:[
            { name: 'Option 1', code: 'Option 1' },
            { name: 'Option 2', code: 'Option 2' },
            { name: 'Option 3', code: 'Option 3' }
        ],  
        estado_tik:'',
        estado_tik_options:[
            {name:'cerrado C.S',code:'option 1'},
            {name:'postergado',code:'option 2'},
            {name:'en proceso',code:'option 3'},
            {name:'cerrado S.S',code:'option 4'},
        ],
        regionales:null,
        localidad_options:[
            {name:'ciudad',code:'option 1'},
            {name:'provincia',code:'option 2'},
        ],
        localidad:null,
        Modelo:null,
        modelo_captura:null,
        PLOTEO:null,
        ploteo_captura:null,    
        Marca:null,
        marca_captura:null, 
        COD_REG:null,
        RG_NUEVO:null,
        Tipo:null,
        tipo_captura:null,
        nro_talonario:null,
        fecha_asignada:'',
        fecha_cs:null,
        fecha_ss:null,
        status:null,
        descripcion:'',
        op_solicitada:'',
        op_solicitada_captura:'',
        op_realizada:'',            
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
        this.getTipo();
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
                    //console.log(this.regionales)
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
                    //console.log(response.data.entry)
                    this.servicio=response.data.entry.filter(item=> item.op_realizada !== '');
                    //console.log(this.servicio)
                    this.op_solicitada= response.data.entry.filter(item=> item.op_solicitada !== null)
                    //console.log(this.op_solicitada)
                })
            } catch (error) {
                
            }
        },
        getTipo(){
            try {
                axios.get('https://mittril.com/fusioA/public/index.php/tik_listado_tipo')
                .then(response=>{
                    //console.log(response.data.entry)
                    this.Tipo=response.data.entry.map(item=> ({tipo:item.tipo})).filter(item=> item.tipo !=='otro')
                    this.Modelo=response.data.entry.map(item=>({modelo:item.modelo}))
                    this.Marca=response.data.entry.map(item=>({marca:item.marca})).filter(item=> item.marca !=='')
                    this.PLOTEO=response.data.entry.map(item=>({PLOTEO:item.PLOTEO})).filter(item=> item.PLOTEO !=='')
                    
                })
            } catch (error) {
                console.log(error)
            }
        },
        crearTicketOld(){
            const us= cryptoJS.AES.decrypt(Cookies.get('us'),this.clave).toString(cryptoJS.enc.Utf8);   
            const ps= cryptoJS.AES.decrypt(Cookies.get('pass'),this.clave).toString(cryptoJS.enc.Utf8);
            
                // Convertir fecha_asignada de 'dd/mm/aaaa' a 'aaaa/mm/dd'
                    let fecha_formateada = null;
                    if (this.fecha_asignada instanceof Date) {
                        const anio = this.fecha_asignada.getFullYear();
                        const mes = String(this.fecha_asignada.getMonth() + 1).padStart(2, '0'); // Mes empieza en 0
                        const dia = String(this.fecha_asignada.getDate()).padStart(2, '0');
                        fecha_formateada = `${anio}/${mes}/${dia}`;
                    }
                    console.log(fecha_formateada)
            try {

                
                // creando la tabla fantasia
                axios.post('https://mittril.com/fusioA/public/index.php/create_fantasia',{
                    us:us,
                    ps:ps,
                    cod_PDV:parseInt(this.cod_PDV),
                    nombre_fantasia:this.nombre_fantasia,
                    ubicacion:this.ubicacion,
                    localidad:this.localidad.name, 
                    cod_regional:parseInt(this.cod_regional.cod_regional)
                })
                .then(response=>{
                    if (response.data.msg!=='creado') {
                        return Promise.reject(new Error('Error al crear fantasia'));
                    }
                     this.cod_fantasia=parseInt(response.data.id)
                     console.log(this.cod_fantasia)

                    //segunda peticion para crear el equipo
                
                return axios.post('https://mittril.com/fusioA/public/index.php/tik_create_equipo',{
                    us:us,
                    ps:ps,
                    tipo:this.tipo_captura.tipo,
                    modelo:this.modelo_captura.modelo,
                    marca:this.marca_captura.marca,
                    PLOTEO:this.ploteo_captura.PLOTEO,
                    COD_REG:this.COD_REG,
                    RG_NUEVO:this.RG_NUEVO,
                    cod_usuario:this.us
                })
            })
                .then(response=>{
                    if (response.data.msg!=='creado') {
                        return Promise.reject(new Error('Error al crear el equipo'));
                    }

                    this.cod_equipo=parseInt(response.data.id)
                    console.log(this.cod_equipo)
                return axios.post('https://mittril.com/fusioA/public/index.php/tik_create_tik',{
                    us:us,
                    ps:ps,
                    cod_PDV:parseInt(this.cod_fantasia),
                    cod_equipo:parseInt(this.cod_equipo),
                    cod_transporte:null,
                    cod_usuario:this.us,
                    nro_talonario:parseInt(this.nro_talonario),
                    fecha_creacion:fecha_formateada,
                    fecha_asignada:fecha_formateada,
                    fecha_cs:null,
                    fecha_ss:null,
                    status:null,
                    estado_tik:this.estado_tik.name,
                    precio_servicio:null,
                    status_temp:null,
                    cobro:null,
                    dias_plazo:null,
                    resolucion:null,
                    postergacion:null,
                    op_solicitadad:this.op_solicitada_captura.op_solicitada,
                    op_realizada:this.op_realizada.op_realizada,
                    descripcion:this.descripcion,
                    canal:null,
                    carga_masiva:null,
                    estado_int:1
                })
                })
                .then(response=>{
                    if(response.data.msg==='creado'){
                        Swal.fire({
                            text:'ticket creado correctamente',
                            title:'extensis',
                            icon:'success',
                            timer:1500
                        })
                    }else{
                        Swal.fire({
                            text:'error al crear el ticket',
                            title:'extensis',
                            icon:'error',
                            timer:1500
                        })
                    }
                })

            } catch (error) {
                console.log('ha ocurrido un error', error)
                Swal.fire({
                    text:'error problemas con el servidor',
                    title:'extensis',
                    icon:'error',
                    timer:1500
                })
            }
        },
        async crearTicket(){
            const us = cryptoJS.AES.decrypt(Cookies.get('us'), this.clave).toString(cryptoJS.enc.Utf8);
            const ps = cryptoJS.AES.decrypt(Cookies.get('pass'), this.clave).toString(cryptoJS.enc.Utf8);

            // Convertir fecha_asignada de 'dd/mm/aaaa' a 'aaaa/mm/dd'
            let fecha_formateada = null;
            if (this.fecha_asignada instanceof Date) {
                const anio = this.fecha_asignada.getFullYear();
                const mes = String(this.fecha_asignada.getMonth() + 1).padStart(2, '0'); // Mes empieza en 0
                const dia = String(this.fecha_asignada.getDate()).padStart(2, '0');
                fecha_formateada = `${anio}/${mes}/${dia}`;
            }
            console.log(fecha_formateada);
            try {
                // crear oa tabla fantasia
            const fantasiaResponse = await axios.post('https://mittril.com/fusioA/public/index.php/tik_create_fantasia',{
                us:us,
                ps:ps,
                cod_PDV:parseInt(this.cod_PDV),
                nombre_fantasia:this.nombre_fantasia,
                ubicacion:this.ubicacion,
                localidad:this.localidad.name,
                cod_regional:parseInt(this.cod_regional.cod_regional) 
            })
            if(fantasiaResponse.data.msg!=='creado'){
                throw new Error('Error al crear fantasia');
            }
            this.cod_fantasia=parseInt(fantasiaResponse.data.id);
            console.log(this.cod_fantasia);

            // crear el equipo
            const equipoResponse= await axios.post('https://mittril.com/fusioA/public/index.php/tik_create_equipo',{
                us: us,
                ps: ps,
                tipo: this.tipo_captura.tipo,
                modelo: this.modelo_captura.modelo,
                marca: this.marca_captura.marca,
                PLOTEO: this.ploteo_captura.PLOTEO,
                COD_REG: this.COD_REG,
                RG_NUEVO: this.RG_NUEVO,
                cod_usuario: this.us
            })
            if(equipoResponse.data.msg!=='creado'){
                throw new Error('Error al crear el equipo');
            }
            this.cod_equipo=parseInt(equipoResponse.data.id);
            console.log(this.cod_equipo);
            // crear el ticket
            const ticketResponse = await axios.post('https://mittril.com/fusioA/public/index.php/tik_create_tik', {
            us: us,
            ps: ps,
            cod_PDV: parseInt(this.cod_fantasia),
            cod_equipo: parseInt(this.cod_equipo),
            cod_transporte: null,
            cod_usuario: this.us,
            nro_talonario: parseInt(this.nro_talonario),
            fecha_creacion: fecha_formateada,
            fecha_asignada: fecha_formateada,
            fecha_cs: null,
            fecha_ss: null,
            status: null,
            estado_tik: this.estado_tik.name,
            precio_servicio: null,
            status_temp: null,
            cobro: null,
            dias_plazo: null,
            resolucion: null,
            postergacion: null,
            op_solicitada: this.op_solicitada_captura.op_solicitada,
            op_realizada: this.op_realizada.op_realizada,
            descripcion: this.descripcion,
            canal: null,
            carga_masiva: null,
            estado_int: 1,
        });
        if(ticketResponse.data.msg==='creado'){
            Swal.fire({
                text:'ticket creado correctamente',
                title:'extensis',
                timer:1500,
                icon:'success'   
            })
        }else{
            Swal.fire({
                text:'error al crear el ticket',
                title:'extensis',
                icon:'error',
                timer:1500
            })
        }
            } catch (error) {
                console.log('ha ocurrido un error', error);
                Swal.fire({
                    text: 'error problemas con el servidor',
                    title: 'extensis',
                    icon: 'error',
                    timer: 1500
                });                
            }
        }
    },
    watch:{
        nro_talonario(newval){
            if(!newval){
                this.errores.nro_talonario='el campo no puede estar vacio'
            }else{
                delete this.errores.nro_talonario;
            }
        },
        cod_PDV(newval){
            if(!newval){
                this.errores.cod_PDV='el campo no puede estar vacio'
            }else if(typeof newval !=='number'){
                this.errores.cod_PDV='el campo solo acepta numeros'
            }else{
                delete this.errores.cod_PDV;
            }
        },
        nombre_fantasia(newval){
            if(!newval){
                this.errores.nombre_fantasia='el campo no puede estar vacio'
            }else{
                delete this.errores.nombre_fantasia;
            }
        }

    }
}
 
</script>

<template>
<Fluid>
    <div class="flex mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <form method="POST">
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
                        <Select id="estado"  :options="estado_tik_options" optionLabel="name" v-model="estado_tik" placeholder="Selecciona" class="w-full"></Select>
                    </div>
                    <div class="space-y-2  w-full">
                        <label for="phone">Fecha(asignado)</label><i class="pi pi-calendar"></i>
                        <DatePicker :showIcon="true" :showButtonBar="true" v-model="fecha_asignada"></DatePicker>
                    </div>
                    <div class="space-y-2  w-full">
                        <label for="phone">Fecha(Cerrado)</label><i class="pi pi-calendar"></i>
                        <DatePicker :showIcon="true" :showButtonBar="true" v-model="fecha_cerrado"></DatePicker>
                    </div>
                </div>
                <div class="grid grid-cols-3 lg:grid-cols-3 sm:grid-cols-2 gap-2">
                    <div class=" space-y-2 w-full">
                        <label for="talonario">NRO. Talonario</label><i class="pi pi-hashtag"></i>
                        <InputText id="talonario" type="text" v-model="nro_talonario"  />
                        <span v-if="errores.nro_talonario" class=" text-sm font-semibold text-red-700">{{ errores.nro_talonario }}</span>
                    </div>
                    <div class="space-y-2  w-full">
                        <label for="regional">Regional</label><i class="pi pi-sitemap"></i>
                        <Select id="regional"  :options="regionales" optionLabel="regional" v-model="cod_regional" placeholder="Selecciona" class="w-full"></Select>
                    </div>
                    <div class="space-y-2  w-full">
                        <label for="localidad">Localidad</label><i class="pi pi-sitemap"></i>
                        <Select id="localidad"  :options="localidad_options" optionLabel="name" v-model="localidad" placeholder="Selecciona" class="w-full"></Select>
                    </div>
                </div>
                <div class="grid grid-cols-2 lg:grid-cols-2 sm:grid-cols-2 gap-2">
                    <div class=" space-y-2 w-full">
                        <label for="PDV">Cod PDV</label><i class="pi pi-hashtag"></i>
                        <InputText id="PDV" type="text" v-model="cod_PDV"  />
                        <span v-if="errores.cod_PDV" class=" text-sm font-semibold text-red-700">{{ errores.cod_PDV }}</span>
                    </div>
                    <div class="space-y-2  w-full">
                        <label for="fantasia">Nom. Fantansia</label><i class="pi pi-users"></i>
                        <InputText id="fantasia" type="text" v-model="nombre_fantasia"  />
                        <span v-if="errores.nombre_fantasia" class=" text-sm font-semibold text-red-700">{{ errores.nombre_fantasia }}</span>
                    </div>
                </div>
                <div class="grid grid-cols-3 lg:grid-cols-3 sm:grid-cols-2 gap-2">
                    <div class=" space-y-2 w-full">
                        <label for="tipo">Tipo</label><i class="pi pi-arrow-circle-down"></i>
                        <Select id="tipo"  :options="Tipo" optionLabel="tipo" v-model="tipo_captura" placeholder="Selecciona" class="w-full"></Select>
                    </div>
                    <div class="space-y-2  w-full">
                        <label for="PLOTEO">PLOTEO</label><i class="pi pi-arrow-circle-down"></i>
                        <Select id="PLOTEO"  :options="PLOTEO" optionLabel="PLOTEO" v-model="ploteo_captura" placeholder="Selecciona" class="w-full"></Select>
                    </div>
                    <div class="space-y-2  w-full">
                        <label for="Marca">Marca</label><i class="pi pi-arrow-circle-down"></i>
                        <Select id="Marca"  :options="Marca" optionLabel="marca" v-model="marca_captura" placeholder="Selecciona" class="w-full"></Select>
                    </div>
                </div>
                <div class="grid grid-cols-2 lg:grid-cols-2 sm:grid-cols-2 gap-2">
                    <div class=" space-y-2 w-full">
                        <label for="modelo">Modelo</label><i class="pi pi-arrow-circle-down"></i>
                        <Select id="modelo"  :options="Modelo" optionLabel="modelo" v-model="modelo_captura" placeholder="Selecciona" class="w-full"></Select>
                    </div>
                    <div class="space-y-2  w-full">
                        <label for="RG">Cod. RG</label><i class="pi pi-code"></i>
                        <InputText id="RG" type="text" v-model="COD_REG"  />
                    </div>
                </div>
                <div class="grid grid-cols-2 lg:grid-cols-2 sm:grid-cols-2 gap-2">
                    <div class=" space-y-2 w-full">
                        <label for="solicitada">Op. Solicitada</label><i class="pi pi-wrench"></i>
                        <Select id="solicitada"  :options="op_solicitada" optionLabel="op_solicitada" v-model="op_solicitada_captura" placeholder="Selecciona" class="w-full"></Select>
                    </div>
                    <div class="space-y-2  w-full">
                        <label for="reliazada">Op. Realizada</label><i class="pi pi-wrench"></i>
                        <Select id="realizada"  :options="servicio" optionLabel="op_realizada" v-model="op_realizada" placeholder="Selecciona" class="w-full"></Select>
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
                    <Textarea id="descripcion" v-model="descripcion" rows="4"/>
                </div>

                <div class="flex flex-wrap gap-2">
                    <Button label="Crear ticket" icon="pi pi-ticket" severity="success" @click="crearTicket" raised />
                </div>  
                </form>              
            </div>
        </div>

</Fluid>    

</template>
