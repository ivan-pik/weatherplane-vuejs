<template>
	<div class="status" v-bind:class="className">
       
	</div>
</template>

<script>
    import Vue from 'vue';
  
	
    export default {
        name: 'status',
        props: ['status'],
        computed: {
            className () {
                return this.status;
            }
        },
        methods: {
		


        },
        data () {
          return {
			
          }
        }

    }



</script>
