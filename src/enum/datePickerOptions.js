import i18n from '@/i18n'
import {TIME_LINE_TIMESTAMP} from '@/enum/generic'

export default {
    shortcuts: [{
        text: i18n.t('range.filter.today'),
        onClick(picker) {
            const start = new Date();
            start.setTime(start.getTime() - TIME_LINE_TIMESTAMP.DAY);
            picker.$emit('pick', [start, new Date()])
        }
    }, {
        text: i18n.t('range.filter.last_week'),
        onClick(picker) {
            const start = new Date();
            start.setTime(start.getTime() - TIME_LINE_TIMESTAMP.WEEK);
            picker.$emit('pick', [start, new Date()])
        }
    }, {
        text: i18n.t('range.filter.last_month'),
        onClick(picker) {
            let start = new Date();
            start.setTime(start.getTime() - TIME_LINE_TIMESTAMP.MONTH);
            picker.$emit('pick', [start, new Date()])
        }
    }, {
        text: i18n.t('range.filter.last_year'),
        onClick(picker) {
            picker.$emit('pick', [new Date(new Date().getFullYear(), 0, 1), new Date()])
        }
    }]
}
