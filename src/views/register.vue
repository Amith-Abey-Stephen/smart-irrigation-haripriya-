<template>
    <section class="bg-gray-50 dark:bg-gray-700">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div class="p-6 space-y-5 md:space-y-7 sm:p-9">
                    <h1 class=" text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">SIGN UP</h1>
                    <h1 class="text-gray-300">Create an Account</h1>
                    <p><input type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 " placeholder="email" v-model="email" /></p>
                    <p><input type="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 " placeholder="password" v-model="password"/></p>
                    <p><button @click="register" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button></p>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>  
import { ref } from 'vue';
import { getAuth,createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'vue-router';
const email= ref("");
const password= ref("");
const router = useRouter();
const auth = getAuth();

const register=() =>{
    createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(user);
        
        console.log("successfully registered");
        router.push('/user_anal')
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        alert(errorMessage)
        console.log(errorMessage);
        
    });
};
</script>
