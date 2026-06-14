import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { NavigateToDataflowResultProps } from './interface';
import { DataflowResultParamsContext } from './params-context';
import DataflowResult from './index';

interface DataflowResultModalProps {
  open: boolean;
  onClose: () => void;
  params: NavigateToDataflowResultProps;
}

export function DataflowResultModal({
  open,
  onClose,
  params,
}: DataflowResultModalProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-[100vw] w-[100vw] h-[100vh] p-0 overflow-auto rounded-none">
        <DataflowResultParamsContext.Provider value={params}>
          <DataflowResult />
        </DataflowResultParamsContext.Provider>
      </DialogContent>
    </Dialog>
  );
}
