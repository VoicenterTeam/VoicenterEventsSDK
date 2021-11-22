const puppeteer = require('puppeteer')

function delay(time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time)
    });
}

(async () => {
    // Launch the browser in headless mode and set up a page.
    const browser = await puppeteer.launch({
        defaultViewport: {
            width: 1000,
            height: 1280,
            headless: false,
        }
    })
    
    const page = await browser.newPage()
    await page.goto('http://localhost:8080/generate-pdf?token=RRmuePW4joZ6dLPCJ4WL6Wp5PX5PJPVGcREt7Ge0sMyp73GHyLJO1aqabzuPtc4dmnMpWInB5YsoA0hF8OcXPmK6VhItSKHWhycF&dashboardID=383', {
        waitUntil: 'networkidle2',
    });
    
    await delay(5000);
    
    await page.pdf({
        path: 'first-88.pdf',
        format: 'A4',
        printBackground: true,
    });

    console.log('Pdf generated')
    await browser.close();
})();
