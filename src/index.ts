import type { ObjectUnknown } from './types/generic'
import { SomeInterface } from './types/generic'
import SomeModuel from './modules/someModuel'

const data: ObjectUnknown = {
    name: 'Petro',
}

export const data2: SomeInterface = {
    name: 'Petro',
}

export const someModuel = new SomeModuel('someModuel', {
    someData: {
        0: data2,
        2: {
            name: 'Petro',
        }
    }
})

export default data
