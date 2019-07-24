<template>
    <data-table :data="tableData"
                :columns="columns"
    ></data-table>
</template>
<script>
  import DataTable from '@/components/DataTable'

  export default {
    components: {
      DataTable
    },
    data() {
      return {
        tableData: [
          {
            id: 1,
            img: 'img/tania.jpg',
            name: 'Tania Mike',
            job: 'Develop',
            progress: 25,
            since: 2013,
            salary: '€ 99,225'
          },
          {
            id: 2,
            img: 'img/robi.jpg',
            name: 'John Doe',
            job: 'CEO',
            progress: 77,
            since: 2012,
            salary: '€ 89,241'
          },
          {
            id: 3,
            img: 'img/lora.jpg',
            name: 'Alexa Mike',
            job: 'Design',
            progress: 41,
            since: 2010,
            salary: '€ 92,144'
          },
          {
            id: 4,
            img: 'img/jana.jpg',
            name: 'Jana Monday',
            job: 'Marketing',
            progress: 50,
            since: 2013,
            salary: '€ 49,990'
          },
          {
            id: 5,
            img: 'img/mike.jpg',
            name: 'Paul Dickens',
            job: 'Develop',
            progress: 100,
            since: 2015,
            salary: '€ 69,201'
          },
          {
            id: 6,
            img: 'img/emilyz.jpg',
            name: 'Manuela Rico',
            job: 'Manager',
            progress: 15,
            since: 2012,
            salary: '€ 99,201'
          }
        ],
        columns: [
          {
            prop: 'name',
            label: 'Name'
          },
          {
            prop: 'job',
            label: 'Job'
          },
          {
            prop: 'progress',
            label: 'Progress'
          },
          {
            prop: 'since',
            label: 'Since',
            sortable:true
          },
          {
            prop: 'salary',
            label: 'Salary'
          }
        ]
      }
    },
  }
</script>
<style lang="scss">
    .rtl .el-select {
        .el-tag__close.el-icon-close {
            left: -5px;
            right: auto;
        }
        .el-tag {
            margin: 2px 6px;
        }
    }
    .rtl .el-table td {
        text-align: right;
    }
</style>
