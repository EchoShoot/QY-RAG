import { RunningStatus, RunningStatusOld } from '@/constants/knowledge';

export const RunningStatusMap: Record<
  string,
  { label: string; color: string }
> = {
  [RunningStatus.UNSTART]: {
    label: 'UNSTART',
    color: 'rgb(var(--accent-primary))',
  },
  [RunningStatus.RUNNING]: {
    label: 'Parsing',
    color: 'var(--team-member)',
  },
  [RunningStatus.CANCEL]: {
    label: 'CANCEL',
    color: 'rgb(250, 173, 20)',
  },
  [RunningStatus.DONE]: {
    label: 'SUCCESS',
    color: 'rgb(59, 160, 92)',
  },
  [RunningStatus.FAIL]: { label: 'FAIL', color: 'rgb(216, 73, 75)' },
  [RunningStatus.SCHEDULE]: {
    label: 'SCHEDULE',
    color: 'rgb(var(--accent-primary))',
  },
  [RunningStatusOld.UNSTART]: {
    label: 'UNSTART',
    color: 'rgb(var(--accent-primary))',
  },
  [RunningStatusOld.RUNNING]: {
    label: 'Parsing',
    color: 'var(--team-member)',
  },
  [RunningStatusOld.CANCEL]: {
    label: 'CANCEL',
    color: 'rgb(250, 173, 20)',
  },
  [RunningStatusOld.DONE]: {
    label: 'SUCCESS',
    color: 'rgb(59, 160, 92)',
  },
  [RunningStatusOld.FAIL]: { label: 'FAIL', color: 'rgb(216, 73, 75)' },
  [RunningStatusOld.SCHEDULE]: {
    label: 'SCHEDULE',
    color: 'rgb(var(--accent-primary))',
  },
};

export * from '@/constants/knowledge';
