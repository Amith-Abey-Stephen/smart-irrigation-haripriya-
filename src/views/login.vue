<template>
  <section class="bg-gray-50 dark:bg-gray-700">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div class="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 class="text-center text-xl font-bold text-gray-900 md:text-2xl dark:text-white">
            Login to your account
          </h1>
          
          <form class="space-y-4 md:space-y-6" @submit.prevent="login">
            <div>
              <label for="role" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Select Role
              </label>
              <select v-model="selectedRole" id="role" class="input" required >
                <option value="admin">Administrator</option>
                <option value="user">User</option>
              </select>
            </div>

            <div>
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Email Address
              </label>
              <input type="email" v-model="email" id="email" class="input" placeholder="name@example.com" required autocomplete="email" />
            </div>

            <div>
              <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Password
              </label>
              <input type="password" v-model="password" id="password" class="input" placeholder="••••••••" required autocomplete="current-password" />
            </div>

            <div v-if="error" class="text-red-500 text-sm text-center">
              {{ error }}
            </div>

            <div class="flex justify-center">
              <button type="submit" class="btn" :disabled="loading" >
                {{ loading ? 'Logging in...' : 'Login' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc,
  getDocs,
  collection 
} from "firebase/firestore";
import { useRouter } from 'vue-router';
  
// Reactive state variables
const email = ref('');
const password = ref('');
const selectedRole = ref('user');
const error = ref('');
const loading = ref(false);

// Vue Router and Firebase instances
const router = useRouter();
const auth = getAuth();
const db = getFirestore();

// Auto Redirect if User is Already Logged In
onMounted(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user==!null) {
      await checkUserRole(user.uid);
    }

  });
  
  // Cleanup subscription on component unmount
  return () => unsubscribe();
  
});

// Function to Check User Role in Firestore
const checkUserRole = async (userId) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      redirectBasedOnRole(userData.role);
    } else {
      await signOut(auth);
      error.value = "User profile not found. Please contact the administrator.";
    }
  } catch (err) {
    console.error("Role check error:", err);
    error.value = "An unexpected error occurred. Please try again.";
  }
};


// Redirect to appropriate route based on role
const redirectBasedOnRole = (userRole) => {
  const routeMap = {
    'admin': '/analytics',
    'user': '/user_anal'
  };

  const route = routeMap[userRole];
  console.log(route);
  
  
  if (route) {
    router.push(route);
  } else {
    error.value = "Invalid user role. Please contact the administrator.";
  }
};

// Login Function
const login = async () => {
  // Input validation
  if (!email.value || !password.value) {
    error.value = "Please enter both email and password";
    return;
  }

  // Reset previous states
  loading.value = true;
  error.value = '';

  try {
    // Authenticate user
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
    console.log("User Credential:", userCredential);
    
    const user = userCredential.user;
    console.log("User UID:", user.uid);

    // Get all documents inside "users" collection
    const usersCollectionRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersCollectionRef);

    let foundUserDoc = null;

    console.log("🔍 Checking all documents inside 'users' collection...");

    for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data(); // Get document fields
        console.log("Document :"+ JSON.stringify(userData.id ));
        
        
        console.log(`📌 Checking document ${userDoc.id} with UID: ${userData.id}`);

        // ✅ Compare Firestore UID field with the authenticated user's UID
        if (userData.id === user.uid) {
            console.log(`✅ Match found in document ${userDoc.id}`);
            foundUserDoc = userData;
            break; // Stop searching once we find a match
        }
    }

    if (foundUserDoc) {
        console.log(`🎉 User found inside Firestore:`, foundUserDoc);

        if (foundUserDoc.role !== selectedRole.value) {
            await signOut(auth);
            error.value = `Access denied. You do not have ${selectedRole.value} privileges.`;
            return;
        }

        console.log(`✅ User logged in successfully as ${selectedRole.value}`);
        redirectBasedOnRole(foundUserDoc.role);
    } else {
        console.error("❌ User UID not found in any document inside 'users'.");
        await signOut(auth);
        error.value = "User profile uuuunot found. Please contact the administrator.";
    }

} catch (err) {
    console.error("❌ Error during login: ", err);
    error.value = handleAuthError(err.code);
} finally {
    loading.value = false;
}

};

// Handle Authentication Errors
const handleAuthError = (errorCode) => {
  const errorMessages = {
    "auth/invalid-email": "Invalid email address format",
    "auth/user-not-found": "No account found with this email address",
    "auth/wrong-password": "Incorrect password. Please try again",
    "auth/too-many-requests": "Too many unsuccessful login attempts. Please try again later",
    "auth/network-request-failed": "Network error. Please check your connection",
    "auth/invalid-credential": "Incorrect Email or password."
  };

  return errorMessages[errorCode] || "Login failed. Please try again.";
};
</script>

<style scoped>
.input {
  @apply w-full p-2 border rounded-md bg-gray-50 border-gray-300 focus:ring-blue-500 focus:border-blue-500;
}

.btn {
  @apply w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500;
}

.btn:disabled {
  @apply bg-blue-300 cursor-not-allowed;
}
</style>