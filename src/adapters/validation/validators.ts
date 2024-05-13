
export function validateUserData(data: { email: string, password: string }): { email: string, password: string } {
    if (!data.email || !isValidEmail(data.email)) {
        throw new Error('Invalid email');
    }
    if (!data.password || !isValidPassword(data.password)) {
        throw new Error('Password must be at least 6 characters long');
    }

    return data;
}

export const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPassword = (password: string): boolean => {
    return password.length >= 6;
};