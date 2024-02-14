import {db} from "@/confFirebase"
import {addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc} from "firebase/firestore"
import {ref, watch, watchEffect} from "vue";
import {useRoute} from "vue-router";

export default function useComments() {
  const comments = ref([])
  const route = useRoute()
  const getMovieComments = async (movieId) => {
    if (!movieId) {
      comments.value = []
      return
    }
    const commentsRef = collection(db, `all-comments/${movieId}/comments`);
    const q = query(commentsRef);

    const querySnapshot = await getDocs(q);
    comments.value = querySnapshot.docs.map(doc => doc.data())
  }

  watchEffect(() => route.params.movie_id, async () => {
    await getMovieComments(route.params.movie_id)
  })


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


  const deleteComment = async (movieId, commentId) => {
    try {
      comments.value = comments.value.filter(comment => comment.id !== commentId)
      const commentDocRef = doc(db, `all-comments/${movieId}/comments/${commentId}`)
      await deleteDoc(commentDocRef)
    } catch (e) {
      console.error('delete com', e)
    }
  }

  return {
    comments,
    addComments,
    deleteComment
  }
}