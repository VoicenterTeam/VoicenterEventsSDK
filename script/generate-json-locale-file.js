require('dotenv').config();
const fs = require('fs')
const path = require('path')
const axios = require('axios').default;
const apiUrl = process.env.VUE_APP_API_URL
const defaultDomain = process.env.VUE_APP_DEFAULT_DOMAIN_NAME || 'dashboarddev.voicenter.co'
const localeDir = path.join(__dirname, '../', 'src', 'locales')

const operationsWithLocaleJsonFIle = async () => {
  try {
    const response = await axios.post(`${apiUrl}/Contents/TagsList/`, { Domain: defaultDomain });
    if (!response.data.Data) {
      return
    }

    const data = JSON.stringify(response.data.Data, null, "\t");

    if (fs.existsSync(path.join(localeDir, 'en.json'))) {
      fs.unlinkSync(path.join(localeDir, 'en.json'))
      fs.writeFileSync(path.join(localeDir, 'en.json'), data)
    } else {
      fs.writeFileSync(path.join(localeDir, 'en.json'), data)
    }
  } catch (errors) {
    console.error(errors);
  }
};

operationsWithLocaleJsonFIle()
