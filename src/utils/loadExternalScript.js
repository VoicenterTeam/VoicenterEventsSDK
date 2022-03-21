import environments from './environments'

function loadBrowserScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = () => {
      resolve();
    };
    script.onerror = () => {
      reject();
    };
    document.body.append(script);
  });
}

async function loadExtensionScript(url) {
  try {
    let script = await fetch(url)
    script = await script.text()

    eval(script)
  } catch (e) {
    return Promise.reject(e)
  }
}

export async function loadExternalScript(url, environment, getSocketIOFunction) {
  if (typeof getSocketIOFunction === 'function') {
    self.io = getSocketIOFunction(url)

    return
  }

  switch (environment) {
    case environments.BROWSER:
      await loadBrowserScript(url)
      break
    case environments.CHROME_EXTENSION:
      await loadExtensionScript(url)
  }
}
