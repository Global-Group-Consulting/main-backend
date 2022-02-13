/**
 *
 * @type {import("../providers/LaravelQueue/LaravelQueue").LaravelQueueConfig}
 */
module.exports = {
  db: {
    host: process.env.QUEUE_HOST,
    port: process.env.QUEUE_PORT ? +process.env.QUEUE_PORT : null,
    user: process.env.QUEUE_USER,
    password: process.env.QUEUE_PASSWORD,
    database: process.env.QUEUE_DATABASE,
  },
  queueName: process.env.QUEUE_NAME
}
