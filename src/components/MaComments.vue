<script setup>
import useComments from "@/composable/useComments";
import {computed, watch, watchEffect} from "vue";
import MaGrades from "@/components/UI/MaGrades.vue";
import MaCommentsAdd from "@/components/UI/MaCommentsAdd.vue";
import useUser from "@/composable/useUser";
import MaButton from "@/components/UI/MaButton.vue";

const props = defineProps({
    movieId: String
})

const movieId = computed(() => {
    return props.movieId
})

const {comments, loadMoreComments, deleteComment,isShowLoadComments} = useComments(movieId)
const {user} = useUser()

function formatDate(timestamp) {
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);

    const months = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${day} ${months[monthIndex]} ${year} г. в ${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
}

</script>

<template>
    <div class="comments__container">
        <div class="comments__title">
            <h3>{{comments.length}} comments</h3>
        </div>
        <MaCommentsAdd v-if="user.uid" :movieId="movieId"/>
        <div class="comments">
            <div class="comment" v-for="comment in comments" :key="comment.id">
                <div class="comment__head">
                    <p>{{ comment.username }}</p>
                    <p class="comment__date">{{ formatDate(comment.date) }}</p>
                    <MaGrades :rating="comment.grade"/>
                </div>
                <p>{{ comment.comment }}</p>
                <button class="btn__delete" @click="deleteComment(comment.id)">Delete</button>
            </div>
        </div>
        <ma-button v-show="isShowLoadComments" @click="loadMoreComments">Load more</ma-button>
    </div>
</template>

<style scoped>
.comments__container {
    margin: 50px 0;
    padding: 0 40px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.comments__title {
    display: flex;
    justify-content: flex-start;
}

.comments {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.comment {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.comment__head {
    display: flex;
    gap: 10px;
    align-items: flex-end;
}

.btn__delete {
    cursor: pointer;
    font-size: 16px;
    width: 44px;
    color: #999999;
    background: transparent;
    border: none;
    border-bottom: 1px dashed #999999;
}

.btn__delete:hover {
    opacity: 0.8;
}

.comment__date {
    font-size: 13px;
    color: #999999;
}
</style>