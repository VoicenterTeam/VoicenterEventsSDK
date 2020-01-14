import {types} from '@/enum/operations'

export default class DashboardOperations {

    constructor() {
        this.operations = []
        this.moveWidgetTypes = [types.MOVED_IN, types.MOVED_OUT, types.MOVED]
    }

    add(operation) {
        if (this.moveWidgetTypes.includes(operation.type)) {
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
        if (!operation.payload.temporaryID) return -1;
        return this.operations.findIndex(op => op.meta.temporaryID === operation.payload.temporaryID)
    }
}
