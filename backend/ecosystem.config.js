module.exports = {
  apps : [{
    name   : "REST SERVER",
    script : "./dist/src/index.js",
    node_args: "--env-file .env"
  }]
}
