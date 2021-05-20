export const reportModel = (accountID) => ({
    AccountID: accountID,
    ReportName: 'New Report',
    RetryCount: 0,
    ReportTypeID: 1,
    ReportItemList: [],
    ReportStatusID: 1, // status - 1 -> enabled/active
    ReportTypeName: '',
    ReportRecipient: [],
    ReportStatusName: 'enable',
    ReportTriggerList: [],
})
//'ReportRecipientID': 4,
export const recipientObject = (Email, ReportID) => ({
    Email,
    ReportID,
    RecipientID: 1,
    ReportRecipientTypeID: '3',
    ReportRecipientStatusID: 1,
    ReportRecipientTypeName: 'Email',
})

export const itemObject = () => ({})
export const triggerObject = () => ({})

export const CSV_EXPORT_TYPE_ID = 1
export const PDF_EXPORT_TYPE_ID = 2
export const BOTH_EXPORT_TYPE_ID = 3

export const exportTypes = {
    [CSV_EXPORT_TYPE_ID]: {
        id: CSV_EXPORT_TYPE_ID,
        icons: ['IconSpreadsheet'],
        name: 'CSV',
    },
    [PDF_EXPORT_TYPE_ID]: {
        id: PDF_EXPORT_TYPE_ID,
        icons: ['IconPdf'],
        name: 'PDF',
    },
    [BOTH_EXPORT_TYPE_ID]: {
        id: BOTH_EXPORT_TYPE_ID,
        icons: ['IconSpreadsheet', 'IconPdf'],
        name: 'CSV and PDF',
    },
}

export const STATUS_VALUES = {
    1: true,
    2: false,
}
export const STATUS_IDS = {
    'true': 1,
    'false': 2,
}
export const STATUS_NAMES = {
    1: 'enable',
    2: 'canceled',
}
