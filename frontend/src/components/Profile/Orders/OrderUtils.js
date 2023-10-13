
export const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}