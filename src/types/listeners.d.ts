export type readyListener = (value: boolean) => void
export type changeActiveCallsListener = (event: { [key: string]: string }) => void
export type TestEventListener = (event: { test: string }) => void
export type ActiveRoomListener = (event: number | undefined) => void
export type CallAddingProgressListener = (callId: string | undefined) => void
export type RoomDeletedListener = (roomId: number) => void
export type changeActiveInputMediaDeviceListener = (event: string) => void
export type changeActiveOutputMediaDeviceListener = (event: string) => void
export type changeMuteWhenJoinListener = (value: boolean) => void
export type changeIsDNDListener = (value: boolean) => void
export type changeIsMutedListener = (value: boolean) => void
export type addRoomListener = (value: string) => void
export type updateRoomListener = (value: string) => void
export type removeRoomListener = (value: string) => void
export type changeCallStatusListener = (event: { [key: string]: number }) => void

export interface OpenSIPSEventMap {
    ready: readyListener
    changeActiveCalls: changeActiveCallsListener
    callConfirmed: TestEventListener
    currentActiveRoomChanged: ActiveRoomListener
    callAddingInProgressChanged: CallAddingProgressListener
    roomDeleted: RoomDeletedListener
    changeActiveInputMediaDevice: changeActiveInputMediaDeviceListener
    changeActiveOutputMediaDevice: changeActiveOutputMediaDeviceListener
    changeMuteWhenJoin: changeMuteWhenJoinListener
    changeIsDND: changeIsDNDListener
    changeIsMuted: changeIsMutedListener
    addRoom: addRoomListener
    updateRoom: updateRoomListener
    removeRoom: removeRoomListener
    changeCallStatus: changeCallStatusListener
}

export type ListenersKeyType = keyof OpenSIPSEventMap
export type ListenersCallbackFnType = OpenSIPSEventMap[ListenersKeyType]
export type ListenerCallbackFnType<T extends ListenersKeyType> = OpenSIPSEventMap[T]
