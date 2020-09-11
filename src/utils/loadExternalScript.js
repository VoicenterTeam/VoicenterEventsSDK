export function loadExternalScript(url) {
  return new Promise((resolve) => {
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
