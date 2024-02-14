import {
    getAuth,
    onAuthStateChanged,
    sendEmailVerification,
    updatePassword,
    updateProfile,
    reauthenticateWithCredential,
    EmailAuthProvider,
    sendPasswordResetEmail,
} from "firebase/auth";
import { getDownloadURL, ref as customStorageRef, uploadBytes } from "firebase/storage";
import {db, storage} from "@/confFirebase"
import {doc, setDoc, getDoc} from "firebase/firestore"
import {ref} from "vue"

let user = null;
const userProfile = ref({})
let promiseUser = null;
const isAuth = ref(false)
export default function useUser() {
    const auth = getAuth();
    const getCurrentUser = async () => {
        if (user) {
            return user
        } else {
            if (!promiseUser) {
                promiseUser = new Promise((resolve, reject) => {
                    onAuthStateChanged(auth, async (currentUser) => {
                        console.log('useUser', currentUser)
                        if (currentUser) {
                            isAuth.value = true
                            user = currentUser;
                            const docSnap = await getDoc(doc(db, "users", user.uid));
                            if (docSnap.exists()) {
                                userProfile.value = docSnap.data()
                            }
                        } else {
                            user = null
                            userProfile.value = {}
                            isAuth.value = false
                        }
                        resolve(user)
                    });
                })
            }
            return promiseUser
        }
    }
    const updateProfileUser = async (username, currentPassword, password, sex, country, dateOfBirth) => {
        try {
            const currentUser = auth.currentUser
            const userDocRef = doc(db, "users", currentUser.uid)

            await setDoc(userDocRef, {
                username: username,
                sex: sex,
                country: country,
                dateOfBirth: dateOfBirth
            })
            if (username !== '') {
                await updateProfile(currentUser, {
                    displayName: username,
                })
            }
            if (password !== '') {
                const credential =  EmailAuthProvider.credential(user.email, currentPassword)
                await reauthenticateWithCredential(user, credential)
                await updatePassword(currentUser, password)
            }

        } catch (e) {
            if (e.code === 'auth/missing-password') {
                throw 'Passwords do not match or the current password is not specified.'
            } else if (e.code === 'auth/wrong-password') {
                throw 'Current password is wrong.'
            }
            throw e.message
        }
    }

    const getPhotoUser = async () => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            const storagePath = `/users/${currentUser.uid}/profilePhoto/[object File]`;
            const photoRef = customStorageRef(storage, storagePath)
            try {
                const photoURL = await getDownloadURL(photoRef)
                return photoURL
            } catch (e) {
                return null
            }
        } else {
            return null
        }
    }
    const updatePhoto = async (photo) => {
        try {
            const currentUser = auth.currentUser;
            const storageRef = customStorageRef(storage, `users/${currentUser.uid}/profilePhoto/${photo}`);
            const uploadTask = uploadBytes(storageRef, photo);

            // Ждем завершения загрузки
            await uploadTask;

            // Получаем URL-адрес загруженной фотографии
            const downloadURL = await getDownloadURL(storageRef);

            // Обновляем профиль пользователя с URL-адресом фотографии
            await updateProfile(currentUser, {
                photoURL: downloadURL
            });
;           return downloadURL
        } catch (error) {
            console.error("Error updating profile photo:", error);
            throw error;
        }
    }

    const sendVerification = async () => {
        const currentUser = auth.currentUser
        try {
            await sendEmailVerification(currentUser)
        } catch (e) {
            return console.error(e)
        }
    }

    const resetPassword = async (email) => {
        try {
            const response = await sendPasswordResetEmail(auth, email)
        } catch (e) {
            if (e.code === 'auth/missing-email') {
                throw 'The email field must not be empty.'
            } else if (e.code === 'auth/invalid-email') {
                throw 'Enter the valid email.'
            } else {
                throw e
            }
        }
    }

    return {
        getCurrentUser,
        auth,
        updateProfileUser,
        sendVerification,
        resetPassword,
        userProfile,
        isAuth,
        updatePhoto,
        getPhotoUser,
        user
    }
}