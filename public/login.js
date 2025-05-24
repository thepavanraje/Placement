document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const email = this.email.value;
  const password = this.password.value;
  const res = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (res.ok && data.token && data.role) {
    alert('Login successful!');
    // Store token for authenticated requests
    localStorage.setItem('token', data.token);
    // Redirect based on user role
    if (data.role === 'student') {
      window.location.href = 'students.html';
    } else if (data.role === 'company') {
      window.location.href = 'companies.html';
    } else {
      window.location.href = 'index.html';
    }
  } else {
    alert(data.error || 'Login failed');
  }
});
