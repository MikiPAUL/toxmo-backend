// import cron, { ScheduleOptions } from 'node-cron';
// import prisma from '../../models/team';
// import { logger } from '../../server'

// const scheduleOptions: ScheduleOptions = {
//     scheduled: false,
//     timezone: 'asia/calcutta',
//     name: 'update-team-status',
//     recoverMissedExecutions: true,
// }

// const scheduleAction = async () => {
//     const currentDate = new Date();
//     await prisma.team.updateTeamExpireStatus()
//     logger.info(`Update team expire status - ${currentDate.getHours()}:${currentDate.getMinutes()}`);
// };

// const weeklyReportScheduler = cron.schedule('* 30 23 * * *', scheduleAction, scheduleOptions);

// export { weeklyReportScheduler };