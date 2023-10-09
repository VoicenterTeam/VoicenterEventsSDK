import { SomeInterface } from '@/types/generic'

export default class SomeModuel {
    name
    data

    constructor (name: string, data: Record<string, Record<number, SomeInterface>>) {
        this.name = name
        this.data = data
    }

    getName (): string {
        return this.name
    }

    getData (): Record<string, Record<number, SomeInterface>> {
        return this.data
    }

    getMappedData (): Record<string, SomeInterface> {
        const mappedData: Record<string, SomeInterface> = {}
        Object.keys(this.data).forEach(key => {
            const mappedKey = key.toUpperCase()
            mappedData[mappedKey] = this.data[key][0]
        })
        return mappedData
    }
}
