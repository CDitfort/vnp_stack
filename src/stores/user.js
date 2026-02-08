import { map, computed } from "@/utils/store.js";

export const userStore = map({
  username: "",
  isLoggedIn: false
});

export const displayName = computed(() =>
  userStore.username.val || "Guest"
);

/** Sync user session from Puter into the store */
export const syncSession = async () => {
  const user = await window.puter.auth.getUser();
  if (user) {
    userStore.set({ username: user.username, isLoggedIn: true });
    return true;
  }
  return false;
};
