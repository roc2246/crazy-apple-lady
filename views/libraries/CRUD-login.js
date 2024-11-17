export async function newUser(input){
    try {
        const response = await fetch('/new-user', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify({
                username: input.username,
                password: input.password
            })
        })
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        return data; 
    } catch (error) {
        console.log(error)
        throw error
    }
}
