import {
    getAuth,
    onAuthStateChanged,
    sendEmailVerification,
    updateProfile,
    EmailAuthProvider,
    sendPasswordResetEmail,
    reauthenticateWithCredential,
    updatePassword,
} from "firebase/auth";

import {db} from "@/confFirebase"
import {doc, updateDoc, getDoc, where, getDocs, collection, query} from "firebase/firestore"
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
        try {
            const currentUser = auth.currentUser
            const userDocRef = doc(db, "users", currentUser.uid)
            await updateProfile(currentUser, {
                displayName: username
            })
            await updateDoc(userDocRef, {
                username: username
            })
            user.value.displayName = username
        } catch (e) {
            throw e.message
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

    // const updateProfileUser = async (username, currentPassword, password, sex, country, dateOfBirth) => {
    //     try {
    //         const currentUser = auth.currentUser
    //         const userDocRef = doc(db, "users", currentUser.uid)
    //
    //         if (username !== '' && username !== currentUser.displayName) {
    //             let check = await checkUsernameExists(username.value)
    //
    //             if (check) {
    //                 throw ''
    //             }
    //
    //             await updateProfile(currentUser, {
    //                 displayName: username,
    //             })
    //             await setDoc(userDocRef, {
    //                 username: username
    //             })
    //         }
    //
    //         if (password !== '') {
    //             const credential =  EmailAuthProvider.credential(user.value.email, currentPassword)
    //             await reauthenticateWithCredential(user.value.email, credential)
    //             await updatePassword(currentUser, password)
    //         }
    //
    //
    //
    //     } catch (e) {
    //         if (e.code === 'auth/missing-password') {
    //             throw 'Passwords do not match or the current password is not specified.'
    //         } else if (e.code === 'auth/wrong-password') {
    //             throw 'Current password is wrong.'
    //         }
    //         throw e.message
    //     }
    // }

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
            console.error('Ошибка при проверке существования пользователя:', e);
            return false;
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
        checkUsernameExists,
        saveInfoUser
    }
}