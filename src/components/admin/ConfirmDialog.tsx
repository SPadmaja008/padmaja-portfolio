import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ open, title = 'Confirm Delete', message, onConfirm, onCancel }: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false);
  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
    onCancel();
  };
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <div className="flex gap-3 items-start mb-5">
        <div className="w-10 h-10 rounded-xl bg-red-600/20 flex items-center justify-center shrink-0">
          <AlertTriangle size={20} className="text-red-400" />
        </div>
        <p className="text-slate-300 text-sm">{message}</p>
      </div>
      <div className="flex gap-3 justify-end">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button variant="danger" onClick={handleConfirm} disabled={loading}>
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
    </Modal>
  );
}
