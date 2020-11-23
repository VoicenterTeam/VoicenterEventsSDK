import { LayoutApi } from '@/api/layoutApi';
import { ENABLED_STATUS_ID, globalAccountSettings } from '@/views/DashboardSettings/LayoutManagement/layout-management';
import get from 'lodash/get';

async function getDefaultLayout() {
    return await LayoutApi.get(globalAccountSettings)
}

export async function getAllActiveLayouts(currentAccountId) {
    
    let defaultLayout = await getDefaultLayout()
    
    let accountSettings = {
        LayoutAccountID: currentAccountId,
    }
    
    const accounts = await LayoutApi.get(accountSettings)
    const activeLayouts = accounts.filter(layout => layout.LayoutStatusID.toString() === ENABLED_STATUS_ID.toString())
    
    Array.prototype.push.apply(defaultLayout, activeLayouts)
    return defaultLayout
}

export async function getLayoutsWithPrimaryColor(currentAccountId, withoutCurrentLayoutID = false) {
    
    let activeLayouts = await getAllActiveLayouts(currentAccountId)
    
    activeLayouts.map((layout) => {
        const primaryColor = layout.LayoutParametersList.filter((el) => el.LayoutParameterName === 'ColorPrimary')
        
        layout['primaryColorBox'] = {
            border: '1px solid',
            background: get(primaryColor, `[0]['Value']`, '#2575FF'),
        }
    })
    
    if (!withoutCurrentLayoutID) {
        return activeLayouts;
    }
    
    return activeLayouts.filter(layout => layout.LayoutID.toString() !== withoutCurrentLayoutID.toString())
}
