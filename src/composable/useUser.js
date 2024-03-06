import {
    getAuth,
    onAuthStateChanged,
    sendEmailVerification,
    updateProfile,
    EmailAuthProvider,
    sendPasswordResetEmail,
    reauthenticateWithCredential,
    updatePassword, createUserWithEmailAndPassword,
} from "firebase/auth";

import {db} from "@/confFirebase"
import {doc, updateDoc,setDoc, getDoc, where, getDocs, collection, query} from "firebase/firestore"
import {ref, watch} from "vue"

let promiseUser = null;

const user = ref({
    uid: null,
    email: '',
    displayName: null,
    emailVerified: null,
    country: null,
    sex: null,
    dateOfBirth: null,
})
export default function useUser() {
    const auth = getAuth();

    const getCurrentUser = async () => {
        if (user.value.uid) {
            return user.value
        } else {
            if (!promiseUser) {
                promiseUser = new Promise((resolve, reject) => {
                    onAuthStateChanged(auth, async (currentUser) => {
                        if (currentUser) {
                            user.value.email = currentUser.email
                            user.value.uid = currentUser.uid
                            user.value.displayName = currentUser.displayName
                            user.value.emailVerified = currentUser.emailVerified

                            const docSnap = await getDoc(doc(db, "users", user.value.uid));
                            if (docSnap.exists()) {
                                user.value.country = docSnap.data().country
                                user.value.sex = docSnap.data().sex
                                user.value.dateOfBirth = docSnap.data().dateOfBirth
                                user.value.favorites = docSnap.data().favorites
                            }

                        } else {
                            user.value = {}
                        }
                        resolve(user.value)
                    });
                })
            }
            return promiseUser
        }
    }

    const updateUsername = async (username) => {

        let isThereUsername = await checkUsernameExists(username)
        if (isThereUsername) {
            throw new Error('The user already exists with this username.')
        } else {
            const currentUser = auth.currentUser
            const userDocRef = doc(db, "users", currentUser.uid)
            await updateProfile(currentUser, {
                displayName: username
            })
            await updateDoc(userDocRef, {
                username: username
            })
            user.value.displayName = username
        }

    }

    const savePassword = async (currentPassword, password) => {
        try {
            const currentUser = auth.currentUser;
            const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);

            await reauthenticateWithCredential(currentUser, credential);
            await updatePassword(currentUser, password);
        } catch (e) {
            if (e.code === 'auth/invalid-credential') {
                throw 'Current password is incorrect'
            } else if (e.code === 'auth/too-many-requests') {
                throw 'Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.'
            } else {
                throw e.message
            }
        }
    }

    const saveInfoUser = async (sex, country, dateOfBirth) => {
        try {
            const userDocRef = doc(db, "users", user.value.uid)
            await updateDoc(userDocRef, {
                sex: sex,
                country: country,
                dateOfBirth: dateOfBirth
            })
        } catch (e) {
            throw e.message
        }
    }

    const sendVerification = async () => {
        const currentUser = auth.currentUser
        try {
            await sendEmailVerification(currentUser)
        } catch (e) {
            throw e.message
        }
    }

    const resetPassword = async (email) => {
        try {
            await sendPasswordResetEmail(auth, email)
        } catch (e) {
            if (e.code === 'auth/missing-email') {
                throw 'The email field must not be empty.'
            } else if (e.code === 'auth/invalid-email') {
                throw 'Enter the valid email.'
            } else {
                throw e.message
            }
        }
    }

    async function checkUsernameExists(username) {
        const usersCollection = collection(db, 'users')

        const q = query(usersCollection, where('username', '==', username))

        try {
            const querySnapshot = await getDocs(q)

            return !querySnapshot.empty
        } catch (e) {
            return false;
        }
    }

    const addFavorite = async (movie) => {

        const userDocRef = doc(db, "users", user.value.uid)
        const userDocSnap = await getDoc(userDocRef);
        const userData = userDocSnap.data()

        if (userData.favorites && userData.favorites.some(favMovie => favMovie.id === movie.id)) {
            await updateDoc(userDocRef, {
                favorites: userData.favorites.filter(favMovie => favMovie.id !== movie.id)
            })
        } else {
            umovie.isFavorite = true
            await pdateDoc(userDocRef, {
                favorites: [...userData.favorites, movie.id]
            })
        }

    }

    const saveUserInDb = async (email, userId) => {
        await setDoc(doc(db, "users", userId), {
            email: email
        })
    }

    const signUp = async (email, password) => {
        try {
           let newUser =  await createUserWithEmailAndPassword(auth, email, password)
            console.log(newUser.user.uid)
            await saveUserInDb(email, newUser.user.uid)
        } catch (error) {
            if (error.code === 'auth/weak-password') {
                throw 'Password should be at least 6 characters.'
            } else if (error.code === 'auth/missing password') {
                throw 'Enter a password.'
            } else if (error.code === 'auth/invalid-email') {
                throw 'Email must contain an \'@\' and a domain. For example \'example@tv.tv\''
            } else {
                throw error
            }
        }
    }

    watch(user, async () => {
        await getCurrentUser();
    });

    return {
        getCurrentUser,
        auth,
        updateUsername,
        sendVerification,
        resetPassword,
        user,
        savePassword,
        saveInfoUser,
        addFavorite,
        signUp
    }
}