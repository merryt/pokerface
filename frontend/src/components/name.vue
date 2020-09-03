<template>
    <div class="nameBox">
        <div v-if="sessionStorageName">
            Chanage your name? <button type="submit" v-on:click="clearName">YANK!</button>    
        </div>
        <div v-if="!sessionStorageName">
            <h2>Hey! it looks like you don't have a name set, lets get one for you</h2>
            <div class="enter-name">
                <input type="text" name="new-name" v-model="name" placeholder="What would you like your ingame name to be?">
                <button type="submit" v-on:click="saveName">I Choose my choice!</button>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'Home',
    data: function(){
        return {
            name: "",
            sessionStorageName: "",
        }
    },
    methods:{
        saveName: function(){
            if(this.name){
                window.sessionStorage.setItem("playerName", this.name)
                this.sessionStorageName = this.name
                this.name = ""
            }else{
                // Add validation error
            }
                             
        },
        clearName:function(){
            window.sessionStorage.setItem("playerName", "")
            this.name = ""
            this.sessionStorageName = ""
            
        }
    },
    created: function(){
        this.name = window.sessionStorage.getItem("playerName")
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .nameBox{
        border-radius: 5px;
        border: 1px solid #3e3e3e;
        padding: 15px;
    }
    input{
        margin-right: 10px;
    }
</style>
