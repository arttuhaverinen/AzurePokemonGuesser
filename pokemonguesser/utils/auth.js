export const getAccessToken = async (instance, accounts) => {
  if (!accounts || accounts.length === 0) return null;

  try {
    const res = await instance.acquireTokenSilent({
      scopes: ["api://add80d4e-e2b7-4e51-815f-2617074979f6/user_impersonation"],
      account: accounts[0],
    });

    return res.accessToken;
  } catch (err) {
    console.log("Token error:", err);
    return null;
  }
};