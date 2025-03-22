module.exports = {
  apps : [{
    name   : "REST SERVER",
    script : "./dist/src/index.js",
    env_production: {
      NODE_ENV: "production"
    }
  }]
}
