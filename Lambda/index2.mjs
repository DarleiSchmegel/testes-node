import ServerlessClient from "serverless-postgres";
import fetch from "node-fetch";

// Initialize the database.
const client = new ServerlessClient({
  user: process.env.USER_NAME,
  host: process.env.RDS_PROXY_HOST,
  database: process.env.DB_NAME,
  password: process.env.PASSWORD,
  port: process.env.DB_PORT,
  debug: true,
  delayMs: 10000,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const handler = async (event) => {
  try {
    const notifyPaymentReceived = await fetch(
      "https://backend-geb-flow-development-49551b9c987d.herokuapp.com/tickets-order/notify-payment-received/bb3c8b54-73b4-4750-852d-c531886adcd7",
      // "https://localhost:3000/tickets-order/notify-payment-received/bb3c8b54-73b4-4750-852d-c531886adcd7",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + process.env.API_AUTHORIZATION_KEY,
        },
      }
    );
    console.log("notifyPaymentReceived", notifyPaymentReceived);
    // Verifica se o evento contém informações da API Gateway
    if (event.httpMethod && event.headers) {
      const httpMethod = event.httpMethod;
      const headers = event.headers;
      const queryParameters = event.queryStringParameters || {};
      const pathParameters = event.pathParameters || {};
      const requestBody = JSON.parse(event.body || null);

      if (requestBody?.event === "PAYMENT_RECEIVED") {
        if (requestBody?.payment?.pixQrCodeId) {
          //Ir no banco e recuperar TicktsOrder
          const requestBody = JSON.parse(event.body || null);
          const isPaymentReceived = requestBody?.event === "PAYMENT_RECEIVED";

          if (!isPaymentReceived) {
            return {
              statusCode: 200,
              body: JSON.stringify({
                message:
                  "Não evento de pagamento recebido" + requestBody?.event,
              }),
            };
          }

          const pixQrCodeId = requestBody?.payment?.pixQrCodeId;

          if (!pixQrCodeId) {
            return {
              statusCode: 200,
              body: JSON.stringify({
                message: "Sem pixQrCodeId " + pixQrCodeId,
              }),
            };
          }

          //Conecta no banco
          await client.connect();

          // Recupera o Id do TicketsOrder que deve ser atualizado
          const ticketsOrderIdQuery = `SELECT id FROM "TicketsOrder" WHERE "pixQrCodeId"=$1 LIMIT 1;`;
          const ticketsOrderId = await client.query(ticketsOrderIdQuery, [
            pixQrCodeId,
          ]);

          // Verifica se o Id do TicketsOrder foi encontrado
          if (!ticketsOrderId?.rows[0]) {
            console.log(
              "ticketsOrderId.rows[0]",
              "Não foi encontrado o ticketsOrderId"
            );
            // Encerra a conexão com o banco
            await client.clean();

            // Retorna uma resposta status 200, pois não tem a ver com o pagamento de um TicketsOrde
            return {
              statusCode: 200,
              body: JSON.stringify({
                message: `Não é um TicketsOrder, pois não foi encontrado ticketsOrderId.rows[0]=${ticketsOrderId?.rows[0]} com pixQrCodeId=${pixQrCodeId}`,
              }),
            };
          }

          // Caso tenha encontrado o Id do TicketsOrder, atualiza o status do pagamento para CONFIRMED
          const updateTicketsOrderQuery = `UPDATE "TicketsOrder" SET "paymentStatus"=$1 WHERE id=$2;`;
          const updated = await client.query(updateTicketsOrderQuery, [
            "CONFIRMED",
            ticketsOrderId.rows[0].id,
          ]);
          console.log("updated", updated);

          // Verifica se o status do pagamento foi atualizado, caso não tenha sido, encerra a conexão com o banco, e avisa o Asaas que não foi possível atualizar o status do pagamento
          // pois statusCode diferente de 200 não é considerado como sucesso pelo Asaas, e faz ele tentar a requisição novamente
          if (updated.rowCount <= 0) {
            await client.clean();
            return {
              statusCode: 404,
              body: JSON.stringify({
                message: `updated.rowCount <= 0, paymentStatus=CONFIRMED, ticketsOrderId.rows[0].id=${ticketsOrderId.rows[0].id}`,
              }),
            };
          }

          // Se chegou até aqui, é porque o status do pagamento foi atualizado, podemos encerrar
          //a conecção com o banco e pode ser retornado uma resposta de sucesso para o Asaas
          await client.clean();

          // fazer uma requisição para http://localhost:3000/tickets-order/notify-payment-received/${ticketsOrderId.rows[0].id}
          // para notificar o sistema que o pagamento foi recebido
          const notifyPaymentReceived = fetch(
            process.env.RESP_API_URL +
              `/tickets-order/notify-payment-received/${ticketsOrderId.rows[0].id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + process.env.API_AUTHORIZATION_KEY,
              },
            }
          );
          console.log("notifyPaymentReceived", notifyPaymentReceived);

          const response = {
            statusCode: 200,
            body: JSON.stringify({
              message: `Tudo certo. ticketsOrderId.rows[0].id=${ticketsOrderId.rows[0].id}, pixQrCodeId=${pixQrCodeId}, paymentStatus=CONFIRMED`,
              httpMethod: httpMethod,
              headers: headers,
              queryParams: queryParameters,
              pathParams: pathParameters,
              requestBody: requestBody,
            }),
          };

          return response;
        }
      }

      // Exibe as informações da solicitação
      console.log(`Método HTTP: ${httpMethod}`);
      console.log(`Cabeçalhos: ${JSON.stringify(headers)}`);
      console.log(`Parâmetros da consulta: ${JSON.stringify(queryParameters)}`);
      console.log(`Parâmetros do caminho: ${JSON.stringify(pathParameters)}`);

      if (requestBody) {
        console.log(`Corpo da solicitação: ${JSON.stringify(requestBody)}`);
      }

      // Retorna uma resposta de exemplo
      const response = {
        statusCode: 200,
        body: JSON.stringify({
          message: `Não é evento de PAYMENT_RECEIVED ou não tem pixQrCodeId. questBody?.event=${requestBody?.event}, requestBody?.payment?.pixQrCodeId=${requestBody?.payment?.pixQrCodeId}`,
          httpMethod: httpMethod,
          headers: headers,
          queryParams: queryParameters,
          pathParams: pathParameters,
          requestBody: requestBody,
        }),
      };

      return response;
    } else {
      // Retorna uma resposta de erro se o evento não contiver informações esperadas
      return {
        statusCode: 400,
        body: JSON.stringify(
          "Erro: Evento não contém informações da API Gateway"
        ),
      };
    }
  } catch (error) {
    // Trata qualquer erro inesperado
    console.error("Erro inesperado:", error);
    return {
      statusCode: 500,
      body: JSON.stringify("Erro interno do servidor"),
    };
  }
};

handler({
  event: "PAYMENT_RECEIVED",
  payment: {
    object: "payment",
    id: "pay_yw27463qxrkiwkuh",
    dateCreated: "2024-01-26",
    customer: "cus_000005413810",
    paymentLink: null,
    value: 200,
    netValue: 198.01,
    originalValue: null,
    interestValue: null,
    description: "Teste PIX aws",
    billingType: "PIX",
    confirmedDate: "2024-01-26",
    pixTransaction: "90e39ad9-27c7-4284-8d90-612d16761d20",
    pixQrCodeId: "DARLEIMA00000000449698ASA",
    status: "RECEIVED",
    dueDate: "2024-01-27",
    originalDueDate: "2024-01-27",
    paymentDate: "2024-01-26",
    clientPaymentDate: "2024-01-26",
    installmentNumber: null,
    invoiceUrl: "https://sandbox.asaas.com/i/yw27463qxrkiwkuh",
    invoiceNumber: "04985308",
    externalReference: null,
    deleted: false,
    anticipated: false,
    anticipable: false,
    creditDate: "2024-01-26",
    estimatedCreditDate: "2024-01-26",
    transactionReceiptUrl:
      "https://sandbox.asaas.com/comprovantes/4402084495912120",
    nossoNumero: null,
    bankSlipUrl: null,
    lastInvoiceViewedDate: null,
    lastBankSlipViewedDate: null,
    discount: {
      value: 0,
      limitDate: null,
      dueDateLimitDays: 0,
      type: "PERCENTAGE",
    },
    fine: {
      value: 0,
      type: "PERCENTAGE",
    },
    interest: {
      value: 0,
      type: "PERCENTAGE",
    },
    postalService: false,
    custody: null,
    refunds: null,
  },
});
