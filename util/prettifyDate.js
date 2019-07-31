export default (date) =>
  appendZero(date.getDate())
  + "/" + appendZero((date.getMonth() + 1))
  + "/" + date.getFullYear()
  + " " + appendZero(date.getHours())
  + ":" + appendZero(date.getMinutes())
  // + ":" + appendZero(date.getSeconds())

appendZero = str => 
  str.toString().length === 1 ? ('0' + str) : str

