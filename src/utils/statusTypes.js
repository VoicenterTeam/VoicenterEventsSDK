import colors from "./colors";

export const callStatuses = {
  CALLING: 100,
  HOLD: 101,
}

export default {
  1: {
    icon: "IconLogin",
    color: colors.LOGIN_COLOR,
    text: 'status.login',
    value: 1
  },
  2: {
    icon: "IconLogout",
    color: colors.LOGOUT_COLOR,
    text: 'status.logout',
    value: 2
  },
  3: {
    icon: "IconLunch",
    color: colors.LUNCH_COLOR,
    text: 'status.lunch',
    value: 3
  },
  5: {
    icon: "IconAdministrative",
    color: colors.ADMINISTRATIVE_COLOR,
    text: 'status.administrative',
    value: 5
  },
  7: {
    icon: "IconPrivate",
    color: colors.PRIVATE_COLOR,
    text: 'status.private',
    value: 7
  },
  9: {
    icon: "IconOther",
    color: colors.OTHER_COLOR,
    text: 'status.other',
    value: 9
  },
  11: {
    icon: "IconTraining",
    color: colors.TRAINING_COLOR,
    text: 'status.training',
    value: 11
  },
  12: {
    icon: "IconTeamMeeting",
    color: colors.TEAM_MEETING_COLOR,
    text: 'status.teamMeeting',
    value: 12
  },
  13: {
    icon: "IconBrief",
    color: colors.BRIEF_COLOR,
    text: 'status.brief',
    value: 13
  },
  100: {
    icon: 'IconIncomingCall',
    color: colors.LIGHT_GREEN,
    text: 'status.incall',
    value: 100
  },
  101: {
    icon: 'IconHold',
    color: colors.HOLD_COLOR,
    text: 'status.hold',
    value: 101
  }
}
