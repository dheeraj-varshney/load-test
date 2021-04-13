const payload = {
  // ContestHomeQuery: {
  //   query:
  //     "query ContestHomeQuery($site: String!, $tourId: Int!, $matchId: Int!, $isJoined: Boolean = true, $isLoggedIn: Boolean = true, $isNetworkInContestNeeded: Boolean = false) {\n  me {\n    __typename\n    isGuestUser\n    showOnboarding\n  }\n  contestSections(site: $site, matchId: $matchId, tourId: $tourId, withPromotions: true) {\n    __typename\n    displayContestCount\n    totalContestCount\n    tag {\n      __typename\n      text\n    }\n    displayContests {\n      __typename\n      ...ContestItem\n    }\n    description\n    name\n    id\n  }\n  site(slug: $site) {\n    __typename\n    showWalletIcon\n    maxTeamsAllowed\n    tour(id: $tourId) {\n      __typename\n      match(id: $matchId) {\n        __typename\n        name\n        startTime\n        status\n      }\n    }\n  }\n}\n\nfragment ContestItem on Contest {\n  __typename\n  contestName\n  contestCategory\n  contestType\n  contestSize\n  currentSize\n  entryFee {\n    __typename\n    amount\n    symbol\n  }\n  _id\n  inviteCode\n  isInfiniteEntry\n  isPartnerContest\n  isGuaranteed\n  isMultipleEntry\n  prizeDisplayText\n  numberOfWinners\n  winnerPercent\n  isMultipleEntry\n  myNetworkInfo @include(if: $isNetworkInContestNeeded) {\n    __typename\n    ...NetworkInfoFragment\n  }\n  maxAllowedTeams\n  winnerBreakup(limit: 1) {\n    __typename\n    prizeDisplayText\n  }\n  prizeAmount {\n    __typename\n    amount\n    symbol\n  }\n  isFreeEntry\n  ... on Contest @include(if: $isLoggedIn) {\n    effectiveEntryFee {\n      __typename\n      amount\n    }\n  }\n  match {\n    __typename\n    id\n    status\n  }\n  tour {\n    __typename\n    id\n    name\n  }\n  site\n  ... on Contest @include(if: $isJoined) {\n    joinedTeamsCount\n    hasJoined\n  }\n}\n\nfragment NetworkInfoFragment on MyNetworkInfo {\n  __typename\n  networkMemberTeams {\n    __typename\n    ...NetworkMemberTeam\n  }\n  totalCount\n}\n\nfragment NetworkMemberTeam on TeamsInNetwork {\n  __typename\n  name\n  profilePic {\n    __typename\n    src\n  }\n}\n",
  //   variables: {
  //     site: "cricket",
  //     tourId: 1616,
  //     matchId: 23905,
  //     isNetworkInContestNeeded: false,
  //   },
  //   operationName: "ContestHomeQuery",
  //   queryId: 1,
  // },
  // ContestHomeTabsQuery: {
  //   query:
  //     "fragment GUserSubscribedNotification on Match {\n  isNotificationSubscribed\n  notificationSubscriptions {\n    name\n    notificationSubscriptionOptions {\n      id\n      type\n      name\n      isSelected\n    }\n  }\n}\nquery ContestHomeTabsQuery(\n  $site: String!\n  $matchId: Int!\n  $fetchNotificationData: Boolean = false\n) {\n  match(site: $site, id: $matchId) {\n    name\n    userTeamsCount\n    joinedContestsCount\n    status\n    isContestStatAvailable\n    startTime\n    isFantasyLiveMatchAvailable\n    isFantasyCommentaryAvailable\n    ...GUserSubscribedNotification @include(if: $fetchNotificationData)\n  }\n}",
  //   variables: {
  //     site: "cricket",
  //     matchId: 23905,
  //   },
  //   operationName: "ContestHomeTabsQuery",
  //   queryId: 2,
  // },
  // MyContestsCarouselQuery: {
  //   query:
  //     "fragment GUserSubscribedNotification on Match {\n  isNotificationSubscribed\n  notificationSubscriptions {\n    name\n    notificationSubscriptionOptions {\n      id\n      type\n      name\n      isSelected\n    }\n  }\n}\nfragment MatchData on Match {\n  id\n  name\n  startTime\n  matchDetail\n  joinedContestsCount @include(if: $showJoinCount)\n  winningsAmount @include(if: $showJoinCount)\n  noOfTeams @include(if: $showJoinCount)\n  status\n  lineupStatus\n  isFantasyLiveMatchAvailable\n  matchHighlight{\n    text\n    color\n  }\n  squads {\n    squadColorPalette\n    id\n    name\n    shortName\n    flag {\n      src\n    }\n    flagWithName {\n      src\n    }\n    fullName\n  }\n  tour {\n    id\n    name\n    slug\n  }\n  liveBroadcast {\n    artwork {\n      src\n    }\n  }\n  ...GUserSubscribedNotification @include(if: $fetchNotificationData)\n}\n\nquery MyContestsCarouselQuery($slug: String!, $startTime: CompareDate,$showJoinCount: Boolean!, $fetchNotificationData: Boolean = false) {\n  site(slug: $slug) {\n    slug\n    name\n    myMatchesCarouselBG {\n      src\n    }\n    matches: myMatches(page: 0, first: 5, orderBy: {field: UPDATED_TIME, sort: DESC}, startTime: $startTime) {\n      edges {\n        ...MatchData\n      }\n    }\n  }\n} ",
  //   variables: {
  //     slug: "cricket",
  //     startTime: {
  //       gt: "2020-07-01T06:38:50.033Z",
  //     },
  //     showJoinCount: true,
  //     fetchNotificationData: true,
  //   },
  //   operationName: "MyContestsCarouselQuery",
  //   queryId: 3,
  // },
  // GetTeamPreview: {
  //   query:
  //     "query GetTeamPreview($site: String!, $matchId: Int!, $userId: Int!, $teamId: Int!, $shouldQueryUserTeam: Boolean!) {\n  site(slug: $site) {\n    __typename\n    playerTypes {\n      __typename\n      id\n      name\n    }\n  }\n  match(site: $site, id: $matchId) {\n    __typename\n    status\n    participatingTeam(id: $teamId, userId: $userId) @skip(if: $shouldQueryUserTeam) {\n      __typename\n      ...UserTeamData\n    }\n    userTeam(id: $teamId) @include(if: $shouldQueryUserTeam) {\n      __typename\n      ...UserTeamData\n    }\n    squads {\n      __typename\n      id\n    }\n  }\n}\n\nfragment UserTeamData on UserTeam {\n  __typename\n  points\n  name\n  players {\n    __typename\n    id\n    artwork {\n      __typename\n      src\n    }\n    lineupStatus {\n      __typename\n      status\n    }\n    squad {\n      __typename\n      id\n    }\n    credits\n    name\n    points\n    type {\n      __typename\n      id\n      name\n      shortName\n    }\n    inDreamTeam\n    isSelected\n    role {\n      __typename\n      shortName\n    }\n  }\n}\n",
  //   variables: {
  //     site: "cricket",
  //     tourId: 1616,
  //     matchId: 23905,
  //     userId: 88183976,
  //     teamId: 1,
  //     shouldQueryUserTeam: true,
  //   },
  //   operationName: "GetTeamPreview",
  //   queryId: 4,
  // },
  // ContestsPostLockQuery: {
  //   query:
  //     "query ContestsPostLockQuery($site: String!, $matchId: Int!, $isJoined: Boolean = true, $isLoggedIn: Boolean = true, $cursor: String, $isFirstPage: Boolean = true, $isNetworkInContestNeeded: Boolean = false, $isInvitationInfoNeeded: Boolean = false) {\n  match(site: $site, id: $matchId) {\n    __typename\n    ... on Match @include(if: $isFirstPage) {\n      name\n      startTime\n      status\n    }\n    joinedContestPaginated(after: $cursor) {\n      __typename\n      edges {\n        __typename\n        ...ContestItem\n        myTeams {\n          __typename\n          name\n          id\n          rank\n          points\n          rankChange\n          winningAmount {\n            __typename\n            amount\n          }\n        }\n      }\n      pageInfo {\n        __typename\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n}\n\nfragment ContestItem on Contest {\n  __typename\n  contestName\n  contestCategory\n  contestType\n  contestSize\n  currentSize\n  entryFee {\n    __typename\n    amount\n    symbol\n  }\n  id\n  inviteCode\n  isInfiniteEntry\n  isPartnerContest\n  isGuaranteed\n  isMultipleEntry\n  prizeDisplayText\n  numberOfWinners\n  winnerPercent\n  isMultipleEntry\n  invitationsInfo @include(if: $isInvitationInfoNeeded) {\n    __typename\n    channelName\n    channelUrl\n    invitationsCount\n    coverUrl\n  }\n  myNetworkInfo @include(if: $isNetworkInContestNeeded) {\n    __typename\n    ...NetworkInfoFragment\n  }\n  maxAllowedTeams\n  winnerBreakup(limit: 1) {\n    __typename\n    prizeDisplayText\n  }\n  prizeAmount {\n    __typename\n    amount\n    symbol\n  }\n  isFreeEntry\n  ... on Contest @include(if: $isLoggedIn) {\n    effectiveEntryFee {\n      __typename\n      amount\n    }\n  }\n  match {\n    __typename\n    id\n    status\n  }\n  tour {\n    __typename\n    id\n    name\n  }\n  site\n  ... on Contest @include(if: $isJoined) {\n    joinedTeamsCount\n    hasJoined @include(if: $isJoined)\n  }\n}\n\nfragment NetworkInfoFragment on MyNetworkInfo {\n  __typename\n  networkMemberTeams {\n    __typename\n    ...NetworkMemberTeam\n  }\n  totalCount\n}\n\nfragment NetworkMemberTeam on TeamsInNetwork {\n  __typename\n  name\n  profilePic {\n    __typename\n    src\n  }\n}\n",
  //   variables: {
  //     site: "cricket",
  //     matchId: 23971,
  //     isLoggedIn: true,
  //     isFirstPage: true,
  //   },
  //   operationName: "ContestsPostLockQuery",
  //   queryId: 5,
  // },
  // TotalChatUnreadCountQuery: {
  //   queryId: 6,
  //   operationName: "totalChatUnreadCountQuery",
  //   variables: {},
  //   query: "query totalChatUnreadCountQuery {  groupsTotalUnreadMessageCount}",
  // },
  // GetLiveStreamBanner: {
  //   queryId: 7,
  //   operationName: "GetLiveStreamBanner",
  //   variables: {
  //     matchId: 23905,
  //   },
  //   query:
  //     "query GetLiveStreamBanner($matchId: Int!) {  watchLiveRuleInfo(matchId: $matchId) {    __typename    fcMatchId    logoUrl    isUserEligible    progress {      __typename      remaining      total    }    backgroundColor  }}",
  // },
  // MyPromotionsQuery: {
  //   queryId: 8,
  //   operationName: "MyPromotionsQuery",
  //   variables: {
  //     slug: "cricket",
  //     bannerSize: "SMALL",
  //     type: ["CONTESTS_HOME_BANNER"],
  //     startDate: null,
  //     endDate: null,
  //     tourId: 0,
  //     utmParams: {
  //       utmSource: "Organic",
  //       utmCampaign: "Organic",
  //       utmTerm: "",
  //       utmMedium: "",
  //       utmRef: 0,
  //       utmContent: "Organic",
  //     },
  //   },
  //   extensions: {
  //     persistedQuery: {
  //       version: 1,
  //       sha256Hash:
  //         "551fe2171e0d6dea441ee7714ae44afed6f286e530a0bbb4f150c3d6451840d1",
  //     },
  //   },
  //   query:
  //     "query MyPromotionsQuery($slug: String!, $bannerSize: Size, $type: [FeedBannerType!], $startDate: Date, $endDate: Date, $tourId: Int, $utmParams: BannerUtmParams) {  site(slug: $slug) {    __typename    promotionFeedBanners(bannerSize: $bannerSize, types: $type, startTime: $startDate, endTime: $endDate, tourId: $tourId, utmParams: $utmParams) {      __typename      id      title      isExternal      redirectionType      redirectUrl      artwork {        __typename        src      }    }  }}",
  // },
  // RoundMessageQuery: {
  //   queryId: 9,
  //   operationName: "RoundMessageQuery",
  //   variables: {
  //     site: "cricket",
  //     matchId: 23905,
  //   },
  //   query:
  //     "query RoundMessageQuery($site: String!, $matchId: Int!) {  match(id: $matchId, site: $site) {    __typename    userMessage  }}",
  // },
  // CricketMiniScoreCardQuery: {
  //   queryId: 10,
  //   operationName: "FullScoreCardQuery",
  //   variables: { matchId: 23905, tourId: 1616, site: "cricket" },
  //   query:
  //     "query FullScoreCardQuery($matchId: Int!, $tourId: Int!, $site: String!) {  fetchMiniScoreCard(matchId: $matchId, tourId: $tourId, site: $site) {    __typename    status    isLive    description    isScorecardAvailable    innings {      __typename      number      status      runs      wickets      overs      type      battingTeamName      battingTeamShortName      runRate      batsmen {        __typename        ...GCricketPlayer      }      bowlers {        __typename        ...GCricketPlayer      }      extras {        __typename        displayText        value      }      extrasTotal      fow {        __typename        order        overBall        runs        name        shortName      }    }  }}fragment GCricketPlayer on CricketPlayer {  __typename  name  shortName  attributes {    __typename    runs    balls    overs    wickets    fours    sixes    strikeRate    maiden    econ    wides    noBall  }  status  description}",
  // },
  // ProfilePicQuery: {
  //   queryId: 11,
  //   operationName: "ProfilePicQuery",
  //   variables: {},
  //   query:
  //     "query ProfilePicQuery {  me {    __typename    ...ProfilePicFragment  }}fragment ProfilePicFragment on User {  __typename  profilePic {    __typename    src  }  artwork {    __typename    src  }}",
  // },
  // TeamCountQuery: {
  //   queryId: 12,
  //   query:
  //     "query TeamCountQuery($site: String!, $matchId: Int!) {\n  site(slug: $site) {\n    __typename\n    maxTeamsAllowed\n  }\n  match(site: $site, id: $matchId) {\n    __typename\n    userTeamsCount\n  }\n}\n",
  //   variables: {
  //     site: "cricket",
  //     matchId: 23905,
  //   },
  //   operationName: "TeamCountQuery",
  // },
  ContestHomeQuery: {
    "variables":{"site":"cricket","matchId":26253,"tourId":1730},
    "query":"query ContestHomeQuery($site: String!, $tourId: Int!, $matchId: Int!) {\n  contestSections(site: $site, matchId: $matchId, tourId: $tourId) {\n    __typename\n    totalContestCount\n    tag {\n      __typename\n      text\n    }\n    displayContests {\n      __typename\n      ...ContestItem\n    }\n    description\n    name\n    id\n  }\n}\n\nfragment ContestItem on Contest {\n  __typename\n  contestName\n  contestCategory\n  contestType\n  contestSize\n  currentSize\n  entryFee {\n    __typename\n    amount\n    symbol\n  }\n  inviteCode\n  isInfiniteEntry\n  isPartnerContest\n  isGuaranteed\n  isMultipleEntry\n  prizeDisplayText\n  numberOfWinners\n  isMultipleEntry\n  prizeAmount {\n    __typename\n    amount\n    symbol\n  }\n  effectiveEntryFee {\n    __typename\n    amount\n  }\n  match {\n    __typename\n    id\n    status\n  }\n  tour {\n    __typename\n    id\n    name\n  }\n  site\n  hasJoined\n}",
    "operationName":"ContestHomeQuery"
  }
};

module.exports = payload;
