const getBookiePostLinkUrl = (country: string, name: string) => {
  const football = `https://www.football.com/api/${country}/orders/share`;
  const sportybet = `https://www.sportybet.com/api/${country}/orders/share`;
  const msport = `https://www.msport.com/api/${country}/orders/real-sports/order/share`;
  const bangbet = "https://bet-api.bangbet.com/api/bet/share";

  const bookies = {
    football,
    sportybet,
    msport,
    bangbet,
  };

  return bookies[name as keyof typeof bookies];
};

export default getBookiePostLinkUrl;
