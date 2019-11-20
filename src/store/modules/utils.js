const types = {
    SET_PAGE_WIDTH: 'SET_PAGE_WIDTH',
    SET_PAGE_HEIGHT: 'SET_PAGE_HEIGHT',
    SET_VIEW_PORT: 'SET_VIEW_PORT'
};
const state = () => ({
    page: {
        width: 0,
        height: 0
    },
    media: [
        {
            rule: 0,
            name: 'mobile'
        },
        {
            rule: 576,
            name: 'mobile'
        },
        {
            rule: 768,
            name: 'tablet'
        },
        {
            rule: 992,
            name: 'desktop'
        },
        {
            rule: 1920,
            name: 'hd-desktop'
        },
        {
            rule: 2560,
            name: 'qhd-desktop'
        },
        {
            rule: 3840,
            name: 'uhd-desktop'
        }
    ],
    viewPort: {}
});

const mutations = {
    [types.SET_PAGE_WIDTH]: (state, value) => {
        state.page.width = value;
    },
    [types.SET_PAGE_HEIGHT]: (state, value) => {
        state.page.height = value;
    },
    [types.SET_VIEW_PORT]: state => {
        for (let i = 0; i < state.media.length - 1; i++) {
            let currentViewPort = state.media[i];
            let nextViewPort = state.media[i + 1];
            if (currentViewPort.rule <= state.page.width && nextViewPort.rule >= state.page.width) {
                state.viewPort = currentViewPort;
                break;
            }
        }
    }
};

const getters = {
    isMobile: state => state.viewPort.name === 'mobile',
    isTablet: state => state.viewPort.name === 'tablet',
    isMobileOrTablet: state => {
        let {viewPort} = state;
        return viewPort.name === 'mobile' || viewPort.name === 'tablet';
    },
    /**
     * Using dom element's bounding rect to detect whether the element
     * is inside current viewport
     * @param {obect} state
     * @param {object} boundingRect domElement.getBoundingClientRect()
     * @return {boolea} whether the dom element is inside current viewport
     */
    isInViewport: state => boundingRect => {
        return (
            boundingRect.top >= 0 &&
            boundingRect.left >= 0 &&
            boundingRect.bottom <= state.page.height &&
            boundingRect.right <= state.page.width
        );
    },
    pageWidth: state => {
        return state.page.width
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    getters
};
