export const isAuthenticated = (state) => {
  const { exp, userId } = state.auth.auth;
  if (!userId) return false;

  const currentTime = Date.now() / 1000; // Convert to seconds
  return exp > currentTime; // Return false if token is expired
};
