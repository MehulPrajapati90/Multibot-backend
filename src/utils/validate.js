import validator from "validator";

const validate = (data) => {
    const mandatoryFields = ['userName', 'emailId', 'password'];
    const isAllowed = mandatoryFields.every((k) => Object.keys(data).includes(k));
    
    if(!isAllowed){
        throw new Error("Missing some required fields!");
    }

    if(!validator.isEmail(data.emailId)){
        throw new Error("Invalid email address");
    }

    // Custom password validation
    const password = data.password;
    
    // Check for at least one symbol
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
    
    // Check for at least one number
    const hasNumber = /\d/.test(password);
    
    // Check for at least one letter
    const hasLetter = /[a-zA-Z]/.test(password);
    
    // Check minimum length (you can adjust this)
    const isLengthValid = password.length >= 8;

    if (!isLengthValid) {
        throw new Error("Password must be at least 8 characters long");
    }
    if (!hasSymbol) {
        throw new Error("Password must contain at least one symbol");
    }
    if (!hasNumber) {
        throw new Error("Password must contain at least one number");
    }
    if (!hasLetter) {
        throw new Error("Password must contain at least one letter");
    }
}

export default validate;