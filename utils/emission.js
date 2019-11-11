// https://www.iea.org/topics/transport/gfei/report/
// 2017 China average CO2 emissions(grams)/km = 175

const setEmissions = (order) => { 
  let distance = order.distance / 1000
  let emissions = 175 * distance

  return emissions
  // Note that the returned value is in grams (g) //
}

const setTotalEmissions = (user, order) => {
  let savedEmissions = user.saved_emissions
  let totalEmissions = savedEmissions + order.emissions

  return totalEmissions
}

module.export({ setEmissions, setTotalEmissions })