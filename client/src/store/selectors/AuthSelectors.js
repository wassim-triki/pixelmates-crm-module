export const isAuthenticated = (state) => {
  if (state.auth.auth.userId) return true;
  return false;
};
