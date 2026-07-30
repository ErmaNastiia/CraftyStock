import { useAppState } from '../StateContext';
import Modal from './Modal';
import Button from './ui/Button';
import { IconInbox } from './ui/icons';

// Shown once, right after a first sign-in on a device that already has data
// saved locally from before Firebase sync existed.
export default function ImportPrompt() {
  const { pendingImport, importLegacyData, dismissImport } = useAppState();
  return (
    <Modal open={Boolean(pendingImport)} onClose={dismissImport}>
      <div className="import-prompt">
        <div className="import-prompt-icon"><IconInbox size={26} strokeWidth={1.6} /></div>
        <div className="modal-title">Импортировать прежние данные?</div>
        <div className="import-prompt-body">
          На этом устройстве есть запасы, сохранённые до подключения аккаунта. Перенести их в твой аккаунт, чтобы они появились на всех устройствах?
        </div>
        <div className="modal-actions import-prompt-actions">
          <Button variant="ghost" onClick={dismissImport}>Не сейчас</Button>
          <Button variant="primary" onClick={importLegacyData}>Импортировать</Button>
        </div>
      </div>
    </Modal>
  );
}
