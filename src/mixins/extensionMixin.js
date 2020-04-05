import get from "lodash/get";
import {callStatuses} from "@/enum/statusTypes";
import {LOGOUT_STATUS} from "@/enum/extensionStatuses";

const HOLD_STATUS = 'Hold'

export default {
    computed: {
        extensions () {
            return this.$store.state.extensions.extensions
        },
        extensionWithCalls () {
            let hideLoggedOutUsers = get(this.data.WidgetLayout, 'hideLoggedOutUsers')

            let groupedExtensions = []

            this.extensions.forEach((extension) => {

                if (extension.calls.length > 0) {
                    if (extension.calls.filter((call) => call.answered && call.callstatus === HOLD_STATUS).length) {
                        extension['representativeStatus'] = callStatuses.HOLD
                    } else {
                        extension['representativeStatus'] = callStatuses.CALLING
                    }
                }
                groupedExtensions.push(extension)
            });

            if (hideLoggedOutUsers) {
                return groupedExtensions.filter(e => e.representativeStatus !== LOGOUT_STATUS)
            }
            return groupedExtensions
        },
    }
}
