import environments from './environments'
import s1_3_7 from "../helpers/socketLibrary/s1_3_7";

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

const getSocketIOFunction = (url) => {

  const socketLibrary = {
    s1_3_7: s1_3_7.call(self)
  };

  const parsedArray = url.split("v=");
  const version = "s"
    .concat(parsedArray[parsedArray.length - 1])
    .replaceAll(".", "_");
  if (!socketLibrary[version]) {
    throw new Error(`Cannot find socket version ${version}`);
  }
  return socketLibrary[version];
}

export async function loadExternalScript(url, environment, useHelperVersion = false) {
  if (useHelperVersion) {
    self.io = undefined
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
