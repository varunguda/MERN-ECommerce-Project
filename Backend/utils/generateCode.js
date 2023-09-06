
export const codeGenerator = () => {
    const min = 0;
    const max = 99999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    const code = randomNumber.toString().padStart(5, '0');

    return code;
}
