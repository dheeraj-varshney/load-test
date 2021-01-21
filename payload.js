const payload = {
  SiteMatchContests: {
    query:
      "query SiteMatchContests($site: String!, $matchId: Int!) {  site(slug: $site) {    playerTypes {      id      name    }      }  match(site: $site, id: $matchId) {    status    squads {      id    }    contests{      id    }  }}",
    variables: {
      site: "cricket",
      matchId: 21182,
    },
    operationName: "SiteMatchContests",
  },
};

module.exports = payload;
