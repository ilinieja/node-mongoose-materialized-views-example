import { Agenda } from "@hokify/agenda";

const DATABASE_URI = process.env.DATABASE_URI;
const DATABASE_COLLECTION = process.env.JOBS_DATABASE_COLLECTION;

if (!DATABASE_URI || !DATABASE_COLLECTION) {
  throw new Error(
    "DATABASE_URI and JOBS_DATABASE_COLLECTION are missing in env"
  );
}

export default async function setupQueue() {
  const agenda = new Agenda({
    db: {
      address: DATABASE_URI,
      collection: DATABASE_COLLECTION,
    },
    processEvery: "5 minutes",
  });

  agenda.on("start", (job) => {
    console.info(`Job ${job.attrs.name} started`);
  });

  agenda.on("complete", (job) => {
    console.info(`Job ${job.attrs.name} completed`);
  });

  agenda.on("fail", (err, job) => {
    console.error(`Job ${job.attrs.name} failed`, err);
  });

  await agenda.start();

  return agenda;
}
