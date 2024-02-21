import {db} from "@/confFirebase"
import {collection,limit, orderBy, addDoc, query, updateDoc, getDocs, doc, deleteDoc} from "firebase/firestore"
import {ref, watch, watchEffect} from "vue";

let i = 0;
export default function useComments(movieId) {

    const comments = ref([])
    const totalCommentsInPage = ref(10)

    const getMovieComments = async () => {

        if (!movieId.value) {
            comments.value = []
            return
        }

        const commentsRef = collection(db, `all-comments/${movieId.value}/comments`)

        const q = query(commentsRef, orderBy('date', 'desc'), limit(totalCommentsInPage.value))

        const querySnapshot = await getDocs(q)

        comments.value = querySnapshot.docs.map(doc => doc.data())

        return comments
    }

    watchEffect(async () => {
        await getMovieComments()
    })

    function formatDate() {
        const date = new Date()
        const months = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
        const day = date.getDate();
        const monthIndex = date.getMonth();
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();

        return `${day} ${months[monthIndex]} ${year} г. в ${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    }

    const addComment = async (userId, username, comment, grade) => {
            const commentsRef = collection(db, `all-comments/${movieId.value}/comments`);

            const docRef = await addDoc(commentsRef, {
                userId: userId,
                username: username,
                comment: comment,
                id: '',
                grade: grade,
                date: formatDate()
            });

            await updateDoc(docRef, {id: docRef.id})

            comments.value.push({userId, username, comment, grade})
    };


    const deleteComment = async (commentId) => {
        comments.value = comments.value.filter(comment => comment.id !== commentId)

        const commentDocRef = doc(db, `all-comments/${movieId.value}/comments/${commentId}`)

        await deleteDoc(commentDocRef)
    }
    watch(comments, async () => {
       await getMovieComments()
    })

    const loadMoreComments = async () => {
        totalCommentsInPage.value += 10
    }
    return {
        comments,
        addComment,
        deleteComment,
        getMovieComments,
        loadMoreComments
    }
}