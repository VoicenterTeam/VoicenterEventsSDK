export async function externalLogin(url, { email, password, token, username }) {
  let body = null
  if (token) {
    body = JSON.stringify({ token })
  } else if (username) {
    body = JSON.stringify({
      username,
      password
    })
  } else {
    body = JSON.stringify({
      email,
      pin: password
    })
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body,
  });
  const data = await res.json();
  if (data.error) {
    throw new Error(data.error)
  }
  return data.Data.Socket;
}

export function getExternalLoginUrl(baseUrl, loginType) {
  if (loginType === 'user') {
    return `${baseUrl}/User`
  } else if (loginType === 'token') {
    return `${baseUrl}/Token`
  } else if (loginType === 'account') {
    return `${baseUrl}/Account`
  }
  return baseUrl
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
