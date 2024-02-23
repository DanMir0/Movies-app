import {db} from "@/confFirebase"
import {collection, limit, orderBy, addDoc, query, updateDoc, getDocs, doc, deleteDoc} from "firebase/firestore"
import {onMounted, ref, watch, watchEffect} from "vue";

let i = 0;
export default function useComments(movieId) {

    const comments = ref([])
    const totalCommentsInPage = ref(7)
    let isShowLoadComments = ref(false)
    const getMovieComments = async () => {

        if (!movieId.value) {
            comments.value = []
            return
        }

        const commentsRef = collection(db, `all-comments/${movieId.value}/comments`)

        const q = query(commentsRef, orderBy('date', 'desc'), limit(totalCommentsInPage.value))

        const querySnapshot = await getDocs(q)

        comments.value = querySnapshot.docs.map(doc => doc.data())
        updateIsShowLoadMoreComments(comments.value.length)
        return comments
    }

    const addComment = async (userId, username, comment, grade) => {
        try {  const date = new Date()
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
            updateIsShowLoadMoreComments(comments.value.length)
            console.log(comments.value.length, totalCommentsInPage.value, isShowLoadComments)
            console.log('yes')
        } catch (e) {
            console.log('no')
        }

    };


    const deleteComment = async (commentId) => {
        comments.value = comments.value.filter(comment => comment.id !== commentId)

        const commentDocRef = doc(db, `all-comments/${movieId.value}/comments/${commentId}`)

        await deleteDoc(commentDocRef)
        updateIsShowLoadMoreComments(comments.value.length)
    }

    const loadMoreComments = async () => {
        totalCommentsInPage.value += 7
    }

    const updateIsShowLoadMoreComments = (length) => {
        if (length > totalCommentsInPage.value) {
            isShowLoadComments.value = true
        } else {
            isShowLoadComments.value = false
        }
        return isShowLoadComments.value
    }

    watch(comments, async () => {
        await getMovieComments()
        updateIsShowLoadMoreComments()
    })


    onMounted(getMovieComments)

    return {
        comments,
        addComment,
        deleteComment,
        getMovieComments,
        loadMoreComments,
        isShowLoadComments
    }
}