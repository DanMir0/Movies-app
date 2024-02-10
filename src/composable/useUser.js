import {
  EmailAuthProvider,
  getAuth,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  updatePassword,
  updateProfile
} from "firebase/auth";
import {doc, getDoc, setDoc} from "firebase/firestore";

import {db} from "@/confFirebase"
import {ref} from "vue";

let user = null;
const userProfile = ref({});

let promiseUser = null;
export default function useUser() {
  const auth = getAuth();

  const getCurrentUser = async () => {
    if (user) {
      return user
    } else {
      if (!promiseUser) {
        promiseUser = new Promise((resolve, reject) => {
          onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
              user = currentUser;
              const docSnap = await getDoc(doc(db, "users", user.uid));
              if (docSnap.exists()) {
                userProfile.value = docSnap.data()
              }
            } else {
              user = null
              userProfile.value = {}
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
        const credential = EmailAuthProvider.credential(user.email, currentPassword)
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
  }
}