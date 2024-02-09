import {
    getAuth,
    onAuthStateChanged,
    sendEmailVerification,
    updatePassword,
    updateProfile,
    updateEmail
} from "firebase/auth";
import {db} from "@/confFirebase"
import {doc, setDoc} from "firebase/firestore"

let user = null;
let promiseUser = null;
export default function useUser(openModalCallback) {
    const auth = getAuth();

    const getCurrentUser = async () => {
        if (user) {
            return user
        } else {
            if(!promiseUser) {
                promiseUser = new Promise((resolve, reject) => {
                    onAuthStateChanged(auth, (currentUser) => {
                        console.log('useUser', currentUser)
                        if (currentUser) {
                            user = currentUser;
                        } else {
                            user = null
                        }
                        resolve(user)
                    });
                })
            }
            return promiseUser
        }
    }
    const addProfile = async (email, username, password) => {
        try {
            const currentUser = auth.currentUser
            const userDocRef = doc(db, "users", currentUser.uid)
            await setDoc(userDocRef, {
                email: email,
                username: username,
            })
            await updateProfile(currentUser, {
                displayName: username,
            })

            await updateEmail(currentUser, email)
            if (password) {
               debugger
                await updatePassword(currentUser, password)
            }

        } catch (e) {
            throw e
           // return console.error(e)
        }
    }

    const sendVerification = async () => {
        const currentUser = auth.currentUser
        try {
            await sendEmailVerification(currentUser)
            console.log('check')
        } catch (e) {
            return console.error(e)
        }
    }

    return {
        getCurrentUser,
        auth,
        addProfile,
        sendVerification
    }
}