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
