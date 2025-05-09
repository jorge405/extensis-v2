<script>
import axios from 'axios'
export default{
    data() {
        return {
         proceso:null,
         postergado:null,
         cerrado:null   
        }
    },
    mounted(){
        this.getCantTickets()
    },
    methods:{
        async getCantTickets(){
            const parametro="en proceso"
            try {
                const proceso = await axios.get(`https://mittril.com/fusioA/public/index.php/tik_cant_ticket/${parametro}`)
                 //console.log(proceso.data.entry[0].cantidad_ticket) error al leer el valor
                this.proceso = proceso.data.entry[0].cantidad_ticket
                const postergado= await axios.get(`https://mittril.com/fusioA/public/index.php/tik_cant_ticket/postergado`)
                this.postergado = postergado.data.entry[0].cantidad_ticket
                const cerrado= await axios.get(`https://mittril.com/fusioA/public/index.php/tik_cerrado_cant`)   
                this.cerrado = cerrado.data.entry[0].cerrados
            } catch (error) {
                console.log(error)
            }
            
        }
    }
}
</script>

<template>
    <div class="col-span-12 lg:col-span-6 xl:col-span-4">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color font-medium mb-4">Tickets: Cerrados</span>
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ cerrado }}</div>
                </div>
                <div class="flex items-center justify-center bg-green-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <i class="pi pi-file-o text-green-700 !text-xl"></i>
                </div>
            </div>
            <span class="text-primary font-medium">Tickets </span>
            
        </div>
    </div>
    <div class="col-span-12 lg:col-span-6 xl:col-span-4">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color font-medium mb-4">Tickets: En proceso</span>
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ proceso }}</div>
                </div>
                <div class="flex items-center justify-center bg-sky-100 dark:bg-sky-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <i class="pi pi-ticket text-sky-600 !text-xl"></i>
                </div>
            </div>
            <span class="text-primary font-medium">Tickets </span>
            
        </div>
    </div>
    <div class="col-span-12 lg:col-span-6 xl:col-span-4">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color font-medium mb-4">Tickets:Registrados</span>
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">28441</div>
                </div>
                <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <i class="pi pi-save text-cyan-500 !text-xl"></i>
                </div>
            </div>
            <span class="text-primary font-medium">Tickets </span>
            
        </div>
    </div>
    <div class="col-span-12 lg:col-span-6 xl:col-span-4">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color font-medium mb-4">Tickets:Postergados</span>
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ postergado }}</div>
                </div>
                <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <i class="pi pi-stop-circle text-orange-500 !text-xl"></i>
                </div>
            </div>
            <span class="text-primary font-medium">Tickets </span>
            
        </div>
    </div>
    <div class="col-span-12 lg:col-span-6 xl:col-span-4">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color font-medium mb-4">Tickets:Asignados</span>
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">152 Unread</div>
                </div>
                <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <i class="pi pi-user-plus text-blue-600 !text-xl"></i>
                </div>
            </div>
            <span class="text-primary font-medium">Tickets </span>
            
        </div>
    </div>
    <div class="col-span-12 lg:col-span-6 xl:col-span-4">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color font-medium mb-4">Tickets:Rechazados</span>
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">152 Unread</div>
                </div>
                <div class="flex items-center justify-center bg-red-100 dark:bg-red-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <i class="pi pi-file-excel text-red-500 !text-xl"></i>
                </div>
            </div>
            <span class="text-primary font-medium">Tickets </span>
            
        </div>
    </div>
</template>
