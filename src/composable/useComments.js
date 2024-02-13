import {db} from "@/confFirebase"
import {collection, addDoc, query, updateDoc, getDocs, doc, deleteDoc} from "firebase/firestore"
import {ref} from "vue";

let i = 0;
export default function useComments() {
    const comments = ref([])
    const addComments = async (movieId, userId, username, comment, grade) => {
        try {
            const commentsRef = collection(db, `all-comments/${movieId}/comments`);
            const docRef = await addDoc(commentsRef, {
                userId: userId,
                username: username,
                comment: comment,
                id: '',
                grade: grade,
            });
            await updateDoc(docRef, {id: docRef.id})
            console.log("Comment added successfully.");
            comments.value.push({userId, username, comment, grade})
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const getMovieComments = async (movieId) => {
        try {
            const commentsRef = collection(db, `all-comments/${movieId}/comments`);
            const q = query(commentsRef);

            const querySnapshot = await getDocs(q);
            comments.value = querySnapshot.docs.map(doc => doc.data())
        } catch (e) {
            console.error('get comment', e)
        }
    }

    const deleteComment = async (movieId, commentId) => {
        try {
            comments.value =  comments.value.filter(comment => comment.id !== commentId)
            const commentDocRef = doc(db, `all-comments/${movieId}/comments/${commentId}` )
            await deleteDoc(commentDocRef)
        } catch (e) {
            console.error('delete com', e)
        }
    }

    return {
        comments,
        addComments,
        getMovieComments,
        deleteComment
    }
}