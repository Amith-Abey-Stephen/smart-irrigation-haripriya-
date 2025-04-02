<template>
    <navigation></navigation>
    <div class="ml-[17rem] pr-3 pt">
      <p class="text-2xl font-bold">MANAGE USERS</p>
      <br>
  
      <!-- Users Table -->
      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="px-6 py-3">Email</th>
            <th scope="col" class="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
            <td class="px-6 py-4">{{ user.email }}</td>
            <td class="px-6 py-4 text-right">
              <button @click="removeUser(user.id)" class="font-medium text-red-600 dark:text-red-500 hover:underline">Remove</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <br>
  
      <!-- Add New User Form -->
      <div class="block w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <p class="text-lg font-semibold text-gray-100">ADD A NEW USER</p>
        <br>
  
        <form @submit.prevent="addUser" class="max-w-full">
          <div class="mb-5">
            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
            <input v-model="newUser.email" type="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@example.com" required />
          </div>
  
          <div class="mb-5">
            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
            <input v-model="newUser.password" type="password" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
          </div>
  
          <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">ADD</button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { getAuth, createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
  import { getFirestore, collection, addDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
  import navigation from "../components/navigation.vue";
  
  const auth = getAuth();
  const db = getFirestore();
  const users = ref([]);
  const newUser = ref({ email: "", password: "" });
  
  // Fetch users from Firestore
  onMounted(() => {
    const usersCollection = collection(db, "users");
    onSnapshot(usersCollection, (snapshot) => {
      users.value = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((user) => user.email !== "admin@gmail.com"); // Replace with the email to exclude
    });
    console.log(users.value);
    
  });
  
  // Add a new user
  const addUser = async () => {
    if (!newUser.value.email || !newUser.value.password) return;
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, newUser.value.email, newUser.value.password);
      const user = userCredential.user;
  
      await addDoc(collection(db, "users"), {
        id: user.uid,
        email: newUser.value.email,
        role: "user", // Default role

      });
  
      newUser.value = { email: "", password: "" };
      alert("User added successfully!");
    } catch (error) {
      console.error("Error adding user:", error.message);
      alert("Error adding user: " + error.message);
    }
  };
  
  // Remove user
  const removeUser = async (userId) => {
    try {
      await deleteDoc(doc(db, "users", userId));
      alert("User removed successfully!");
    } catch (error) {
      console.error("Error removing user:", error.message);
      alert("Error removing user: " + error.message);
    }
  };
  </script>
