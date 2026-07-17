export const parseFormData = (value)=>{
    if (!value) {
        return value        
    }

    try {
        return typeof value === "string" ? JSON.parse(value):value
    } catch (error) {
        return value
    }
}