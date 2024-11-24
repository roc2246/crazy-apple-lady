export async function login(input) {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: input.username,
          password: input.password,
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  export async function logout () {
    try {
        const response = await fetch('/api/logout', {
          method: 'POST', 
        });
        console.log(response)
    
        if (!response.ok) {
          throw new Error('Logout failed'); 
        }
    
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    /* 
    REFACTOR 
        window.location.replace('/login');

    */