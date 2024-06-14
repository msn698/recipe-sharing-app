document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('signupForm').addEventListener('submit', async (e) => {
        e.preventDefault();
 
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:3000/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                alert('Signup successful!');
            } else {
                alert('Signup failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred');
        }
    });
});