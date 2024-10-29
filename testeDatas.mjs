import { format } from "date-fns";
import moment from "moment-timezone";

function nowDateUTC0() {
  const now = new Date();
  const now2 = moment(now).utc().format("YYYY-MM-DDTHH:mm:ss.SSS") + "Z";
  return now2;
}

// Converte uma data para a timezone de Brasília e formata para salvar no banco de dados
function convertDateTimeToBrazilianTimezone(dateTime) {
  return (
    moment(dateTime)
      .utc()
      .tz("America/Sao_Paulo")
      .format("YYYY-MM-DDTHH:mm:ss.SSS") + "Z"
  );
}

// Formata uma data para exibição na timezone de Brasília
function formatDateTimeForDisplay(dateTime) {
  return moment(dateTime)
    .utc()
    .tz("America/Sao_Paulo")
    .format("DD/MM/YYYY - HH:mm:ss");
}

// Incrementa segundos em uma data na timezone de Brasília
function incSecDateTimeOnBrazilianTimezone(sec) {
  return (
    moment().utc().add(sec, "seconds").format("YYYY-MM-DDTHH:mm:ss.SSS") + "Z"
  );
}

// testes
const now = new Date(); // data atual
console.log("New date()- " + now);

const nowUTC0 = nowDateUTC0(); // data atual em UTC0
console.log("nowDateUTC0()- " + nowUTC0);

const nowBrazil = convertDateTimeToBrazilianTimezone(nowUTC0); // data atual em timezone de Brasília
console.log("convertDateTimeToBrazilianTimezone()- " + nowBrazil);

const nowBrazilFormat = formatDateTimeForDisplay(nowUTC0); // data atual formatada para exibição
console.log("formatDateTimeForDisplay()- " + nowBrazilFormat);

const nowIncSec = incSecDateTimeOnBrazilianTimezone(10); // data atual incrementada em 10 segundos
console.log("incSecDateTimeOnBrazilianTimezone()- " + nowIncSec);

//asaasResponse.data.expirationDate 2024-10-27 14:23:21
