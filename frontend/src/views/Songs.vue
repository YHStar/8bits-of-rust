<template>
<div>
    <songs-form v-model="newSongName" ref="songsFormRef" />
</div>
</template>
<script>

// import SongsList from "@/components/songs/SongsList.vue";
import { ref } from 'vue';
import SongsForm from '@/components/Songs/SongsForm.vue';
export default {
    components: { 
        SongsForm,
    },
};
</script>
<style>
</style>