const languages = [
    [
        'Hebrew (עברית)',
        'he',
        'il',
        'HE',
    ],
    [
        'English',
        'en',
        'us',
        'ENG',
    ],
]

for (let i = 0; i < languages.length; i += 1) {
    const c = languages[i]
    languages[i] = {
        name: c[0],
        locale: c[1].toLowerCase(),
        abbName: c[3],
        icon: `/img/flags/${c[2].toUpperCase()}.png`,
    }
}

export default languages
