import mysql from "serverless-mysql";
const user_name = "postgresUserDev";
const password = "devTestedb";
const rds_proxy_host =
  "database-geb-dev-1.cau29gayl7jo.us-east-1.rds.amazonaws.com";
const db_name = "GEB_dev_db";

const db = mysql({
  config: {
    host: rds_proxy_host,
    database: db_name,
    user: user_name,
    password: password,
  },
});

// Main handler function
const handler = async (event, context) => {
  console.log(db.config());
  // Run your query
  let results = await db.query({ sql: "SELECT * FROM table", timeout: 10000 });

  // Run clean up function
  await db.end();

  // Return the results
  return results;
};

handler("c371b59d-e5bb-416c-863e-2c2a99510156", "");
