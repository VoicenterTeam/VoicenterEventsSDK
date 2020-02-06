const languages = [
    [
        'Hebrew (עברית)',
        'he',
        'il'
    ],
    [
        'English',
        'en',
        'us'
    ]
]

for (let i = 0; i < languages.length; i += 1) {
    const c = languages[i]
    languages[i] = {
        name: c[0],
        locale: c[1].toLowerCase(),
        icon: `/img/flags/${c[2].toUpperCase()}.png`
    }
}

export default languages
