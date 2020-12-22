export function getServerWithHighestPriority(servers) {
  // Highest priority server is the one with lowest Priority value
  let chosenServer = null
  let maxPriority = Number.MAX_SAFE_INTEGER
  servers.forEach(server => {
    if (server.Priority < maxPriority) {
      maxPriority = server.Priority
      chosenServer = server
    }
  })
  return chosenServer
}

export function isValidDate(date) {
  return !isNaN(date.getTime())
}
