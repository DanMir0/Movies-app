import {db} from "@/confFirebase"
import {collection, limit, orderBy, addDoc, query, updateDoc, getDocs, doc, deleteDoc} from "firebase/firestore"
import {onMounted, ref, watch, watchEffect} from "vue";

let i = 0;
export default function useComments(movieId) {

    const comments = ref([])
    const getMovieComments = async () => {

        if (!movieId.value) {
            comments.value = []
            return
        }

        const commentsRef = collection(db, `all-comments/${movieId.value}/comments`)

        const q = query(commentsRef, orderBy('date', 'desc'))

        const querySnapshot = await getDocs(q)

        comments.value = querySnapshot.docs.map(doc => doc.data())

        return comments
    }

    const addComment = async (userId, username, comment, grade) => {
        const date = new Date()
        const commentsRef = collection(db, `all-comments/${movieId.value}/comments`);

        const docRef = await addDoc(commentsRef, {
            userId: userId,
            username: username,
            comment: comment,
            id: '',
            grade: grade,
            date: date
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

    onMounted(getMovieComments)

    return {
        comments,
        addComment,
        deleteComment,
        getMovieComments,
    }
}