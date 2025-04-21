<script>

export default{
    data(){
        return{
        dropdownItems:[
            { name: 'Option 1', code: 'Option 1' },
            { name: 'Option 2', code: 'Option 2' },
            { name: 'Option 3', code: 'Option 3' }
        ],   
        }
    }
}

</script>

<template>
<div class="flex mt-3">
<div class="card flex flex-col gap-4 w-full">
    <div class="w-1/5 flex flex-col gap-4">
        <label for="estado" class=" font-semibold text-xl">Estado:</label>
        <Select id="estado"  :options="dropdownItems" optionLabel="name" placeholder="Selecciona" class="w-full"></Select>
    </div>
    <div class=" flex-grow"></div>
    
</div>
</div>
</template>