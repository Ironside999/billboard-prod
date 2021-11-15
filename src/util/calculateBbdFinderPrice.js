function calculateBbdFinderPrice(weeks, pricePerMonth) {
  let base = 1000000;

  let unitX = Math.round(pricePerMonth / base);

  let percentage = 0;

  for (let i = 0; i < unitX; i++) {
    percentage = percentage + 0.05;
  }

  let weekPercentage = 0;

  if (weeks > 1) {
    weekPercentage = 1;
    for (let j = 0; j < weeks; j++) {
      weekPercentage = weekPercentage + 0.9;
    }

    let finalPercentage = (percentage + weekPercentage).toFixed(4);

    let pay = (pricePerMonth * finalPercentage) / 100;

    return Math.round(pay);
  }
}

module.exports = calculateBbdFinderPrice;
