import { RunningStatus, RunningStatusOld } from './constant';

export const isParserRunning = (
  text: RunningStatus | RunningStatusOld | number,
) => {
  const isRunning =
    text === RunningStatus.RUNNING ||
    text === RunningStatusOld.RUNNING ||
    text === 1;
  return isRunning;
};
