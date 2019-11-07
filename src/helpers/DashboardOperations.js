import {types} from '@/enum/operations'

export default class DashboardOperations {
    constructor() {
        this.operations = []
    }

    add(operation) {
        if ([types.MOVED_IN, types.MOVED_OUT].includes(operation.type)) {
            this.operations.push(operation)
        } else {
            let index = this.checkIfEntityAlreadyAdded(operation)

            if (operation.type === types.REMOVE) {
                if (index === -1) {
                    this.operations.push(operation)
                } else {
                    this.operations.splice(index, 1)
                }
            } else {
                // New widget group
                if (operation.payload.IsNew) {
                    operation.type = types.ADD
                }
                if (index !== -1) {
                    this.operations.splice(index, 1, operation)
                } else {
                    this.operations.push(operation)
                }
            }
        }
    }

    removeGroup(group) {
        this.operations = this.operations.filter((op) => op.meta.parentID !== group.payload.WidgetGroupID)
        this.add(group)
    }

    all() {
        return this.operations
    }

    checkIfEntityAlreadyAdded(operation) {
        if (operation.payload.temporaryID) {
            return this.operations.findIndex(op => op.meta.temporaryID === operation.payload.temporaryID)
        } else {
            return this.operations.findIndex(op => op.payload[operation.target + 'ID'] === operation.payload[operation.target + 'ID'])
        }
    }
}
