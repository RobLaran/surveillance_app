export function validateSignUp(data) {
    const errors = {};

    const nameRegex = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;

    //* First name validation
    const firstNameLength = data.firstName.length;

    // required
    if(data.firstName.trim() === "") {
        errors.firstName = "First name is required";
    } 
    // check if first name length is less than two
    else if(firstNameLength < 2) {
        errors.firstName = "First name should be at least 2 characters";
    }
    // check if first name length must not exceed 50
    else if(firstNameLength > 50) {
        errors.firstName = "First name must not exceed 50 characters";
    }
    // check symbols
    else if(!nameRegex.test(data.firstName)) {
        errors.firstName = "Only letters, spaces, hyphens and apostrophes are allowed";
    }

    //* Last name validation
    const lastNameLength = data.lastName.length;

    // required
    if(data.lastName.trim() === "") {
        errors.lastName = "Last name is required";
    } 
    // check if last name length is less than two
    else if(lastNameLength < 2) {
        errors.lastName = "Last name should be at least 2 characters";
    }
    // check if last name length must not exceed 50
    else if(lastNameLength > 50) {
        errors.lastName = "Last name must not exceed 50 characters";
    }
    // check symbols
    else if(!nameRegex.test(data.lastName)) {
        errors.lastName = "Only letters, spaces, hyphens and apostrophes are allowed";
    }
}