import * as SecureStore from 'expo-secure-store';


export const saveUserRole = async (role) => {
  await SecureStore.setItemAsync('userRole', role);
};


export const getUserRole = async () => {
  return await SecureStore.getItemAsync('userRole');
};

export const isAdmin = async () => {
  const role = await getUserRole();
  return role === 'admin';
};
