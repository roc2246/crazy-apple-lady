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
        const data = await response.json(); // Parse and use the response data
        return data; // Return the data for further use
    } catch (error) {
        console.log(error)
        throw error
    }
}
