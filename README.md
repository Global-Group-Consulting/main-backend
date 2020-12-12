# Adonis fullstack application

This is the fullstack boilerplate for AdonisJs, it comes pre-configured with.

1. Bodyparser
2. Session
3. Authentication
4. Web security middleware
5. CORS
6. Edge template engine
7. Lucid ORM
8. Migrations and seeds

## Setup

Use the adonis command to install the blueprint

```bash
adonis new yardstick
```

or manually clone the repo and then run `npm install`.

### Migrations

Run the following command to run startup migrations.

```js
adonis
migration:run
```

# How automatic operations work

- Every 1st of each month at 00:10:00 the queue `commissions_block_month` which will:
  - For each agent, add the job `agent_commissions_block`, which will close the month and reset the users commissions
    while storing the amount that must be reinvested.

- Every 16th of each month at 00:10:00 the queue `trigger_users_recapitalization` gets triggered.
  - This will add to the queue a job `user_recapitalization` for each user, including agents
    - Once this gets completed, if the user has a referenceAgent, add the job `commissions_on_total_deposit`, which will
      calculate the commissions for the agent based on the user's new deposit.
    - If the user is an agent, trigger `agent_commissions_reinvest` which will reinvest the commissions of the previous
      month

// TODO:: Connect commissions with various events like recapitalizations and others.

// Create frontend request dialog for commissions
