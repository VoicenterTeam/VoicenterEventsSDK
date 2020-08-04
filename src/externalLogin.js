export async function externalLogin(url, { email, password }) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      pin: password
    })
  });
  const data = res.json();
  return data.Data.Socket;
}

export async function refreshToken(url, oldRefreshToken) {
  const res = await fetch(url, {
    method: 'GET',

    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${oldRefreshToken}`
    }
  });
  return res.json();
}
