import { Builder } from "../../types/types";

const MAX_CONCURRENT_REQUESTS = 5; // Adjust this to control concurrency
const API_REQUEST_DELAY_MS = 1000; // Adjust this to control API rate limiting
const apiResponseCache = new Map();

// function to check who is home or away and return home or away team
const homeOrAway = (bet: any) => {
  if (bet.outcome.name.includes(bet.fixture.data.competitors[0].name)) {
    return "home";
  } else {
    return "away";
  }
};

const multiSearch = async (bet: {
  outcome: {
    market: { game: { fixture: { data: { competitors: { name: any }[] } } } };
  };
}) => {
  const fetchId = await fetch(
    `https://www.msport.com/api/ng/facts-center/query/frontend/search/event/page/v2/sports?keyword=${bet.outcome.market.game.fixture.data.competitors[0].name}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const fetchIddata = await fetchId.json();

  const searchUrl = `https://www.msport.com/api/ng/facts-center/query/frontend/search/event/page/v2?keyword=${bet.outcome.market.game.fixture.data.competitors[0].name}&sportId=${fetchIddata.data.sports[0].sportId}`;

  const res = await fetch(searchUrl, {
    method: "GET",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/117.0",
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "en-US,en;q=0.5",
      operid: "2",
      ApiLevel: "2",
      network: "undefined",
      clientid: "WEB",
      platform: "WEB",
      "x-f-trace-id": "1699819994623-bmkkn6-1.74.4",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      devMem: "",
      Pragma: "no-cache",
      "Cache-Control": "no-cache",
    },
  });

  const data = await res.json();

  if (data.data.events.length < 1 || fetchIddata.data.sports.length < 1) {
    const fetchId2 = await fetch(
      `https://www.msport.com/api/ng/facts-center/query/frontend/search/event/page/v2/sports?keyword=${bet.outcome.market.game.fixture.data.competitors[0].name}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const fetchIddata2 = await fetchId2.json();

    const searchUrl2 = `https://www.msport.com/api/ng/facts-center/query/frontend/search/event/page/v2?keyword=${bet.outcome.market.game.fixture.data.competitors[1].name}&sportId=${fetchIddata2.data.sports[0].sportId}`;

    const res = await fetch(searchUrl2, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/117.0",
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.5",
        operid: "2",
        ApiLevel: "2",
        network: "undefined",
        clientid: "WEB",
        platform: "WEB",
        "x-f-trace-id": "1699819994623-bmkkn6-1.74.4",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        devMem: "",
        Pragma: "no-cache",
        "Cache-Control": "no-cache",
      },
    });

    const data = await res.json();
    return data;
  }

  return data;
};

const betBuilderStake = async (data: any[]) => {
  const newBet: Array<Builder> = [];
  const failedBets: Array<{
    name: string;
    market: string;
  }> = [];

  const fetchAndCache = async (url: string | Request) => {
    if (apiResponseCache.has(url)) {
      return apiResponseCache.get(url);
    }

    await new Promise((resolve) => setTimeout(resolve, API_REQUEST_DELAY_MS));

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    apiResponseCache.set(url, data);
    return data;
  };

  try {
    for (const bet of data) {
      // check type of bet
      if (bet.__typename.toLowerCase() === "SportBetOutcome".toLowerCase()) {
        const eventDetailUrl = `https://www.msport.com/api/ng/facts-center/query/frontend/match/detail?eventId=${bet.fixture.extId}`;
        const sportybetData = await fetchAndCache(eventDetailUrl);

        if (!sportybetData.data) {
          failedBets.push({
            name:
              bet.fixture.data.teams[0].name +
              " vs " +
              bet.fixture.data.teams[1].name,
            market: bet.outcome.name,
          });
          continue; // Skip processing this bet
        }

        for (const market of sportybetData.data.markets) {
          // market is the market id gotten from msport api
          // bet is the market id gotten from stake api
          if (
            market.id === parseInt(bet.market.extId) &&
            market.specifiers === bet.market.specifiers
          ) {
            for (const outcome of market.outcomes) {
              // now hand pick the exact outcome
              if (
                outcome.description.toLowerCase() ===
                bet.outcome.name.toLowerCase()
              ) {
                const builder: Builder = {
                  eventId: bet.fixture.extId,
                  marketId: bet.market.extId,
                  specifier: bet.market.specifiers || null,
                  outcomeId: outcome.id,
                };
                newBet.push(builder);
              } else {
                const teamPosition = homeOrAway(bet).toLowerCase();

                const team = market.outcomes.find(
                  (item: { description: string }) =>
                    item.description.toLowerCase() === teamPosition
                );

                const builder: Builder = {
                  eventId: bet.fixture.extId,
                  marketId: bet.market.extId,
                  specifier: bet.market.specifiers || null,
                  outcomeId: team.id,
                };
                newBet.push(builder);
              }
            }
          }
        }
      } else if (
        bet.__typename.toLowerCase() === "SwishBetOutcome".toLowerCase()
      ) {
        return {
          newBet: newBet,
          failedBets: failedBets,
          error: "unsupported",
        };
        const SearchData = await multiSearch(bet);
        const mainEvent = SearchData.data.events.find(
          (item: { homeTeamId: any; awayTeamId: any }) =>
            item.homeTeamId ===
              bet.outcome.market.game.fixture.data.competitors[0].extId &&
            item.awayTeamId ===
              bet.outcome.market.game.fixture.data.competitors[1].extId
        );
        const eventDetailUrl = `https://www.msport.com/api/ng/facts-center/query/frontend/match/detail?eventId=${mainEvent.eventId}`;
        const sportybetData = await fetchAndCache(eventDetailUrl);

        if (!sportybetData.data) {
          failedBets.push({
            name:
              bet.fixture.data.teams[0].name +
              " vs " +
              bet.fixture.data.teams[1].name,
            market: bet.outcome.name,
          });
          continue; // Skip processing this bet
        }

        // for (const market of sportybetData.data.markets) {
        //   console.log(market);
        //   // market is the market id gotten from msport api
        //   // bet is the market id gotten from stake api
        //   if (
        //     market.id === parseInt(bet.market.extId) &&
        //     market.specifiers === bet.market.specifiers
        //   ) {
        //     for (const outcome of market.outcomes) {
        //       // now hand pick the exact outcome
        //       if (
        //         outcome.description.toLowerCase() ===
        //         bet.outcome.name.toLowerCase()
        //       ) {
        //         const builder: Builder = {
        //           eventId: bet.fixture.extId,
        //           marketId: bet.market.extId,
        //           specifier: bet.market.specifiers || null,
        //           outcomeId: outcome.id,
        //         };
        //         newBet.push(builder);
        //       } else {
        //         const teamPosition = homeOrAway(bet).toLowerCase();

        //         const team = market.outcomes.find(
        //           (item: { description: string }) =>
        //             item.description.toLowerCase() === teamPosition
        //         );

        //         const builder: Builder = {
        //           eventId: bet.fixture.extId,
        //           marketId: bet.market.extId,
        //           specifier: bet.market.specifiers || null,
        //           outcomeId: team.id,
        //         };
        //         newBet.push(builder);
        //       }
        //     }
        //   }
        // }
      } else {
        console.log("else");
        console.log(bet.__typename);
        return {
          newBet: newBet,
          failedBets: failedBets,
          error: "unsupported",
        };
      }
      // if (bet.__typename.toLowerCase() === "SwishBetOutcome") {

      //   // search for the event in the sportybet api
      //   const sportybetSearchUrl = await fetchAndCache(`https://www.football.com/api/ng/factsCenter/event/firstSearch?keyword=${bet.outcome.market.game.data.competitors[0].name}&offset=0&pageSize=20&_t=1699731807341`);
      //   const sportybetSearchData = await fetchAndCache(sportybetSearchUrl);

      //   const eventDetailUrl = `https://www.msport.com/api/ng/facts-center/query/frontend/match/detail?eventId=${bet.fixture.extId}`;
      //   const sportybetData = await fetchAndCache(eventDetailUrl);

      //   if (!sportybetData.data) {
      //     failedBets.push({
      //       name:
      //         bet.fixture.data.teams[0].name +
      //         " vs " +
      //         bet.fixture.data.teams[1].name,
      //       market: bet.outcome.name,
      //     });
      //     continue; // Skip processing this bet
      //   }

      //   for (const market of sportybetData.data.markets) {
      //     if (
      //       market.id === parseInt(bet.market.extId) &&
      //       market.specifiers === bet.market.specifiers
      //     ) {
      //       for (const outcome of market.outcomes) {
      //         if (
      //           outcome.description.toLowerCase() ===
      //           bet.outcome.name.toLowerCase()
      //         ) {
      //           const builder: Builder = {
      //             eventId: bet.fixture.extId,
      //             marketId: bet.market.extId,
      //             specifier: bet.market.specifiers || null,
      //             outcomeId: outcome.id,
      //           };
      //           newBet.push(builder);
      //         }
      //       }
      //     }
      //   }
      // }
    }

    return {
      newBet: newBet,
      failedBets: failedBets,
    };
  } catch (error) {
    throw error;
  }
};

export default betBuilderStake;
