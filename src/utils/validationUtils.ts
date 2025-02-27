export const isValidEmail = (email: string): boolean => {
  const emailRegex = /\S+@\S+\.\S+/;
  return emailRegex.test(email);
};

export const isValidUsername = (username: string): boolean => {
  return username.length >= 3;
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};
