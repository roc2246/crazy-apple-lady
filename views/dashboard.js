document
  .getElementsByClassName("logout")[0]
  .addEventListener("click", async () => {
    try {
        const response = await fetch('/api/logout', {
          method: 'POST', 
        });
        console.log(response)
    
        if (!response.ok) {
          throw new Error('Logout failed'); 
        }
    
        window.location.replace('/login');
      } catch (error) {
        console.error('Logout error:', error);
      }
  });
