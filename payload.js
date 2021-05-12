const payload = {
  ContestHomeQuery: {
    query:
      "query ContestHomeQuery($site: String!, $tourId: Int!, $matchId: Int!) {\n  contestSections(site: $site, matchId: $matchId, tourId: $tourId) {\n    __typename\n    totalContestCount\n    tag {\n      __typename\n      text\n    }\n    displayContests {\n      __typename\n      ...ContestItem\n    }\n    description\n    name\n    id\n  }\n}\n\nfragment ContestItem on Contest {\n  __typename\n  contestName\n  contestCategory\n  contestType\n  contestSize\n  currentSize\n  entryFee {\n    __typename\n    amount\n    symbol\n  }\n  inviteCode\n  isInfiniteEntry\n  isPartnerContest\n  isGuaranteed\n  isMultipleEntry\n  prizeDisplayText\n  numberOfWinners\n  isMultipleEntry\n  prizeAmount {\n    __typename\n    amount\n    symbol\n  }\n  effectiveEntryFee {\n    __typename\n    amount\n  }\n  match {\n    __typename\n    id\n    status\n  }\n  tour {\n    __typename\n    id\n    name\n  }\n  site\n  hasJoined\n}\n",
    variables: {
      site: "cricket",
      tourId: 1616,
      matchId: 23905,
      isNetworkInContestNeeded: false
    },
    operationName: "ContestHomeQuery"
  }
};

module.exports = payload;
