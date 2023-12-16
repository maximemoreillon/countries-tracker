import { initializeApp } from "firebase/app"
import { writable } from "svelte/store"
import { getAuth, type User } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyCv0JfyyMpxvlOCHhISeKIGoNcyx_ELqDg",
  authDomain: "global-friends-countries.firebaseapp.com",
  projectId: "global-friends-countries",
  storageBucket: "global-friends-countries.appspot.com",
  messagingSenderId: "1023646948861",
  appId: "1:1023646948861:web:407fbb5f910f8f8a6acd94",
}

// Initialize Firebase
initializeApp(firebaseConfig)

export const currentUser = writable<User | null>()

const auth = getAuth()

auth.onAuthStateChanged((user) => {
  currentUser.set(user)
})
