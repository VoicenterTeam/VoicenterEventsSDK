<template>
    <div class="w-full bg-gray-200">
        List page
        <button @click="addCreateTab">Add Report</button>
        <div>
            <h2>Table</h2>
            <table>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Country</th>
                    <th>Actions</th>
                </tr>
                <tr v-for="item in tableData">
                    <td>{{ item.id }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.contact }}</td>
                    <td>{{ item.country }}</td>
                    <td>
                        <button @click="onRowEdit(item)">Edit</button>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    name: "list-temp",
    props: {
        /*data: {
            type: Object,
            default: {}
        }*/
    },
    data() {
        return {
            tableData: [
                {
                    name: "popo",
                    contact: "+380954545454",
                    country: "en",
                    id: '49'
                },
                {
                    name: "dodo",
                    contact: "+3809454545874",
                    country: "ua",
                    id: '115'
                }
            ]
        }
    },
    methods: {
        addCreateTab() {
            this.$emit('on-create-report')
        },
        onRowEdit(row) {
            this.$emit('on-edit-row', row)
        }
    }
}
</script>
