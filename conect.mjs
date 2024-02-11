// import mysql from "mysql2/promise";

import serverless from "serverless-mysql";

// rds settings
const user_name = "postgresUserDev";
const password = "devTestedb";
const rds_proxy_host =
  "database-geb-dev-1.cau29gayl7jo.us-east-1.rds.amazonaws.com";
const db_name = "GEB_dev_db";

// Initialize the database.

const db = await serverless({
  config: {
    host: rds_proxy_host,
    user: user_name,
    password: password,
    database: db_name,
  },
});
export const handler = async (pixQrCodeId) => {
  console.log(db.config());
  const conetcion = await db.connect();
  console.log(conetcion);
  const getOrderId = `SELECT id FROM TicketsOrder WHERE pixQrCodeId=${pixQrCodeId} LIMIT 1;`;
  console.log(getOrderId, db);

  const responseData = await db.query(getOrderId);
  console.log(responseData);
  await mysql.end();
};

handler("c371b59d-e5bb-416c-863e-2c2a99510156");
