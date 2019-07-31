export default (date) => { 
  date = String(date).split(' ')
  const days = String(date[0]).split('-')
  const hours = String(date[1]).split(':')
  return [
    parseInt(days[0]), 
    parseInt(days[1])-1, 
    parseInt(days[2]), 
    parseInt(hours[0]), 
    parseInt(hours[1]), 
    parseInt(hours[2])
  ]
}