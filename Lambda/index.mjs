import ServerlessClient from "serverless-postgres";

const DB_USER = "postgresUserDev";
const DB_HOST = "database-geb-dev-1.cau29gayl7jo.us-east-1.rds.amazonaws.com";
const DB_NAME = "GEB_dev_db";
const DB_PASSWORD = "devTestedb";
const DB_PORT = 5432;

const client = new ServerlessClient({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT,
  debug: true,
  delayMs: 10000,
  ssl: {
    rejectUnauthorized: false,
  },
});

const handler = async (pixQrCodeId, context) => {
  await client.connect();

  const ticketsOrderIdQuery = `SELECT id FROM "TicketsOrder" WHERE "pixQrCodeId"=$1 LIMIT 1;`;
  const ticketsOrderId = await client.query(ticketsOrderIdQuery, [pixQrCodeId]);

  if (!ticketsOrderId.rows[0]) {
    console.log(
      "ticketsOrderId.rows[0]",
      "Não foi encontrado o ticketsOrderId"
    );
    await client.clean();
    return;
  }

  const updateTicketsOrderQuery = `UPDATE "TicketsOrder" SET "paymentStatus"=$1 WHERE id=$2;`;
  const updated = await client.query(updateTicketsOrderQuery, [
    "CONFIRMED",
    ticketsOrderId.rows[0].id,
  ]);
  console.log("updated", updated);

  const TicketsOrderQuery = `SELECT * FROM "TicketsOrder" WHERE id=$1;`;
  const TicketsOrder = await client.query(TicketsOrderQuery, [
    ticketsOrderId.rows[0].id,
  ]);
  console.log("TicketsOrder", TicketsOrder);

  await client.clean();
};

handler("DARLEIMA00000000436882ASA", "");
