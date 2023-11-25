const getBookieShareLinkUrl = (code: string, country: string, name: string) => {
  const football = `https://www.football.com/api/${country}/orders/share/${code}`;
  const sportybet = `https://www.sportybet.com/api/${country}/orders/share/${code}`;
  const msport = `http://www.msport.com/api/${country}/orders/real-sports/order/share/${code}`;
  const bangbet = "https://bet-api.bangbet.com/api/bet/booking"
  const stake = `https://stake.com/_api/graphql`;
  const betway = `https://www.betway.com.ng/share/35697D`;
  const bet9ja = `https://www.bet9ja.com/ng/share/35697D`;
  const nairabet = `https://www.nairabet.com/share/35697D`;
  const betking = `https://www.betking.com/share/35697D`;
  const merrybet = `https://www.merrybet.com/share/35697D`;
  const betbonanza = `https://www.betbonanza.com/share/35697D`;
  const betpawa = `https://www.betpawa.ng/share/35697D`;
  const betfarm = `https://www.betfarm.com/share/35697D`;
  const betbiga = `https://www.betbiga.com/share/35697D`;
  const betwinner = `https://www.betwinner.com/share/35697D`;
  const bet365 = `https://www.bet365.com/share/35697D`;
  const betfair = `https://www.betfair.com/share/35697D`;
  const betfairng = `https://www.betfair.ng/share/35697D`;

  const bookies = {
    football,
    sportybet,
    msport,
    stake,
    bangbet,
    betway,
    bet9ja,
    nairabet,
    betking,
    merrybet,
    betbonanza,
    betpawa,
    betfarm,
    betbiga,
    betwinner,
    bet365,
    betfair,
    betfairng,
  };

  return bookies[name as keyof typeof bookies];
};

export default getBookieShareLinkUrl;
