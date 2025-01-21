
//validate email
export const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

//validate name

export const validateName = (name, fieldName = 'Name') => {
    if (!name.trim()) {
        return { isValid: false, error: `${fieldName} is required` };
    }
    if (!/^[a-zA-Z\s]*$/.test(name)) {
        return { isValid: false, error: `${fieldName} can only contain letters and spaces` };
    }
    if (name.trim().length < 2 || name.trim().length > 50) {
        return { isValid: false, error: `${fieldName} must be between 2 and 50 characters` };
    }
    return { isValid: true, error: null };
};

//validate passwords match
export const validatePasswordsMatch = (password, confirmPassword) => {
    if (password !== confirmPassword) {
        return { isValid: false, error: 'Passwords do not match' };
    }
    return { isValid: true, error: null };
};

//validate password
export const validatePassword = (password) => {
    if (password.length < 6) {
        return { isValid: false, error: 'Password must be at least 6 characters long' };
    }
    if (!/\d/.test(password)) {
        return { isValid: false, error: 'Password must contain at least one number' };
    }
    if (!/[A-Z]/.test(password)) {
        return { isValid: false, error: 'Password must contain at least one uppercase letter' };
    }
    return { isValid: true, error: null };
};