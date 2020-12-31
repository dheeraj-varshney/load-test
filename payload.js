const payload = {
  ContestHomeQuery: {
    query:
      "query ContestHomeQuery($site: String!, $tourId: Int!, $matchId: Int!, $isJoined: Boolean = true, $isLoggedIn: Boolean = true, $isNetworkInContestNeeded: Boolean = false) {\n  me {\n    __typename\n    isGuestUser\n    showOnboarding\n  }\n  contestSections(site: $site, matchId: $matchId, tourId: $tourId, withPromotions: true) {\n    __typename\n    displayContestCount\n    totalContestCount\n    tag {\n      __typename\n      text\n    }\n    displayContests {\n      __typename\n      ...ContestItem\n    }\n    description\n    name\n    id\n  }\n  site(slug: $site) {\n    __typename\n    showWalletIcon\n    maxTeamsAllowed\n    tour(id: $tourId) {\n      __typename\n      match(id: $matchId) {\n        __typename\n        name\n        startTime\n        status\n      }\n    }\n  }\n}\n\nfragment ContestItem on Contest {\n  __typename\n  contestName\n  contestCategory\n  contestType\n  contestSize\n  currentSize\n  entryFee {\n    __typename\n    amount\n    symbol\n  }\n  _id\n  inviteCode\n  isInfiniteEntry\n  isPartnerContest\n  isGuaranteed\n  isMultipleEntry\n  prizeDisplayText\n  numberOfWinners\n  winnerPercent\n  isMultipleEntry\n  myNetworkInfo @include(if: $isNetworkInContestNeeded) {\n    __typename\n    ...NetworkInfoFragment\n  }\n  maxAllowedTeams\n  winnerBreakup(limit: 1) {\n    __typename\n    prizeDisplayText\n  }\n  prizeAmount {\n    __typename\n    amount\n    symbol\n  }\n  isFreeEntry\n  ... on Contest @include(if: $isLoggedIn) {\n    effectiveEntryFee {\n      __typename\n      amount\n    }\n  }\n  match {\n    __typename\n    id\n    status\n  }\n  tour {\n    __typename\n    id\n    name\n  }\n  site\n  ... on Contest @include(if: $isJoined) {\n    joinedTeamsCount\n    hasJoined\n  }\n}\n\nfragment NetworkInfoFragment on MyNetworkInfo {\n  __typename\n  networkMemberTeams {\n    __typename\n    ...NetworkMemberTeam\n  }\n  totalCount\n}\n\nfragment NetworkMemberTeam on TeamsInNetwork {\n  __typename\n  name\n  profilePic {\n    __typename\n    src\n  }\n}\n",
    variables: {
      site: "cricket",
      tourId: 1616,
      matchId: 23905,
      isNetworkInContestNeeded: false,
    },
    operationName: "ContestHomeQuery",
  },
  meQuery: {
    query:
      "query me {\n  me {\n    __typename\n    isGuestUser\n    showOnboarding\n  }\n }\n",
    variables: {},
  },
};
module.exports = payload;
