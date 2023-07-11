import { Agenda, Job } from "@hokify/agenda";

import dbConnection from "../shared/dbConnection";
import { calculateDayStats } from "../models/DayStats";

const JOB_NAMES = {
  CALCULATE_DAY_STATS: "CALCULATE_DAY_STATS",
  CALCULATE_DAY_GEO_BUCKET_STATS: "CALCULATE_DAY_GEO_BUCKET_STATS",
  CALCULATE_DAY_PLATFORM_STATS: "CALCULATE_DAY_PLATFORM_STATS",
};

export default async function scheduleDbViewUpdates(agenda: Agenda) {
  const jobs: Job<void>[] = [];

  agenda.define(JOB_NAMES.CALCULATE_DAY_STATS, async (job) => {
    const connection = await dbConnection();

    await calculateDayStats();

    connection.disconnect();
  });

  jobs.push(await agenda.every("1 day", JOB_NAMES.CALCULATE_DAY_STATS));

  return jobs;
}
