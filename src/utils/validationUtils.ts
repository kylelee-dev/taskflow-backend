export const isValidEmail = (email: string): boolean => {
  if (!email) {
    return false;
  }
  const emailRegex = /\S+@\S+\.\S+/;
  return emailRegex.test(email);
};
// export const validateEmail = (
//   email: string
// ): { status: number; message: string } => {
//   const emailRegex = /\S+@\S+\.\S+/;
//   if (!email) {
//     return { status: 400, message: "Email is required." };
//   } else if (!emailRegex.test(email)) {
//     return { status: 400, message: "Invalid email address." };
//   }
// };

export const isValidUsername = (username: string): boolean => {
  if (!username) {
    return false;
  }
  return username.length >= 3;
};

export const isValidPassword = (password: string): boolean => {
  if (!password) {
    return false;
  }
  return password.length >= 6;
};
