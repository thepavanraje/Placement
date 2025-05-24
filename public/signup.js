document.getElementById('signupForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const name = this.name.value;
  const email = this.email.value;
  const password = this.password.value;
  const role = this.role.value;
  const res = await fetch('/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role })
  });
  const data = await res.json();
  if (res.ok) {
    alert('Signup successful! Please login.');
    window.location.href = 'login.html';
  } else {
    alert(data.error || 'Signup failed');
  }
});