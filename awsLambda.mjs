// import mysql from "mysql2/promise";

import serverless from "serverless-mysql";

// rds settings
const user_name = process.env.USER_NAME;
const password = process.env.PASSWORD;
const rds_proxy_host = process.env.RDS_PROXY_HOST;
const db_name = process.env.DB_NAME;

// Initialize the database.
const db = serverless({
  config: {
    host: rds_proxy_host,
    user: user_name,
    password: password,
    database: db_name,
  },
});

export const handler = async (event) => {
  try {
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
          const isPaymentReceived =
            requestBody?.payment?.isPaymentReceived === "PAYMENT_RECEIVED";

          if (!isPaymentReceived) {
            return {
              statusCode: 200,
              body: JSON.stringify({
                message: "Não evento de pagamento recebido",
              }),
            };
          }

          const pixQrCodeId = requestBody?.payment?.pixQrCodeId;

          if (!pixQrCodeId) {
            return {
              statusCode: 200,
              body: JSON.stringify({
                message: "Sem pixQrCodeId",
              }),
            };
          }

          const getOrderId = `SELECT id FROM sua_tabela WHERE pixQrCodeId = ${pixQrCodeId} LIMIT 1;`;
          const responseData = await db.query(getOrderId);
          responseData[0].id;
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
          message: "Função Lambda executada com sucesso!",
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
