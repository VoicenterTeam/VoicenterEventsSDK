export function capitalizeFirstLetter (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

export function getBase64 (file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export function getMinValue (data, key) {
    return data.reduce((min, object) => Math.min(min, object[key]), data[0][key]);
}

export function mapOrder (array, order, key) {
    array.sort(function (a, b) {
        let A = a[key]
        let B = b[key]

        if (order.indexOf(A) > order.indexOf(B)) {
            return 1;
        } else {
            return -1;
        }
    })
    return array
}
