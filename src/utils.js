export function getServerWithHighestPriority(servers) {
  let chosenServer = null
  let maxPriority = -1
  servers.forEach(server => {
    if (server.Priority > maxPriority) {
      maxPriority = server.Priority
      chosenServer = server
    }
  })
  return chosenServer
}

export function isValidDate(date) {
  return !isNaN(date.getTime())
}
