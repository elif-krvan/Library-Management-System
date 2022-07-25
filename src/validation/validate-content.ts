class ValidateContent {
    isEmpty( arr: any ) {
        return arr.length == 0;
    }

    userExist( user: any ) {
        return user !== undefined;
    }
}

const validate_content = new ValidateContent();
export default validate_content;