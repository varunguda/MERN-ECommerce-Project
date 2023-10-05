
export const passLengthValidator = (pass) => {
    if(pass.length === 0){
        return true
    }
    return (( pass.length >= 8 ) && ( pass.length <= 100 ) )
}

export const passLetterValidator = (pass) => {
    if(pass.length === 0){
        return true
    }
    const regex = /^(?=.*[a-z])(?=.*[A-Z]).+$/;
    return regex.test(pass);
}

export const passNumberOrSpecialCharValidator = (pass) => {
    if(pass.length === 0){
        return true
    }
    
    // eslint-disable-next-line
    const regex = /^(?=.*[0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).+$/;
    return regex.test(pass);
}
