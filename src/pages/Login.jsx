import { useState } from 'react';
import { useAuth } from '../AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { IconThread, IconAlertCircle } from '../components/ui/icons';

const ERROR_MESSAGES = {
  'auth/invalid-email': 'Некорректный email',
  'auth/user-disabled': 'Этот аккаунт отключён',
  'auth/user-not-found': 'Нет аккаунта с таким email',
  'auth/wrong-password': 'Неверный пароль',
  'auth/missing-password': 'Введи пароль',
  'auth/invalid-credential': 'Неверный email или пароль',
  'auth/email-already-in-use': 'Этот email уже зарегистрирован',
  'auth/weak-password': 'Пароль должен быть не короче 6 символов',
  'auth/too-many-requests': 'Слишком много попыток — попробуй позже',
  'auth/network-request-failed': 'Нет связи с сервером. Проверь интернет-соединение',
  'auth/operation-not-allowed': 'Вход по email/паролю ещё не включён в Firebase Console (Authentication → Sign-in method)',
  'auth/configuration-not-found': 'Authentication не настроен в этом Firebase-проекте (включи его в консоли)',
  'auth/api-key-not-valid.-please-pass-a-valid-api-key.': 'Неверный API-ключ в .env.local — проверь VITE_FIREBASE_API_KEY',
};

function friendlyError(err) {
  // Logged so the exact Firebase error code is visible in devtools even
  // though the UI only shows a friendly translation.
  // eslint-disable-next-line no-console
  console.error('Firebase auth error:', err?.code, err?.message);
  return ERROR_MESSAGES[err?.code] || `Что-то пошло не так${err?.code ? ` (${err.code})` : ''}. Попробуй ещё раз`;
}

export default function Login() {
  const { signIn, signUp, resetPassword, firebaseReady } = useAuth();
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);

  if (!firebaseReady) {
    return (
      <div className="auth-screen">
        <Card className="auth-card">
          <div className="auth-logo"><IconThread size={22} strokeWidth={1.7} /></div>
          <div className="auth-title">Firebase ещё не настроен</div>
          <div className="auth-setup-note">
            Добавь ключи своего Firebase-проекта в файл <code>.env.local</code> (см. README.md в папке проекта), затем перезапусти приложение.
          </div>
        </Card>
      </div>
    );
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    setInfo('');
    if (!email.trim() || !password) {
      setError('Заполни email и пароль');
      return;
    }
    setBusy(true);
    try {
      if (mode === 'signin') {
        await signIn(email.trim(), password);
      } else {
        await signUp(email.trim(), password, name.trim());
      }
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleReset() {
    setError('');
    setInfo('');
    if (!email.trim()) {
      setError('Введи email, чтобы восстановить пароль');
      return;
    }
    setBusy(true);
    try {
      await resetPassword(email.trim());
      setInfo('Письмо для восстановления пароля отправлено');
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-screen">
      <Card className="auth-card">
        <div className="auth-logo"><IconThread size={22} strokeWidth={1.7} /></div>
        <div className="auth-title">CraftyStock</div>
        <div className="auth-subtitle">
          {mode === 'signin' ? 'Войди, чтобы синхронизировать запасы между устройствами' : 'Создай аккаунт для доступа с компьютера и телефона'}
        </div>

        <form onSubmit={submit}>
          {mode === 'signup' && (
            <input className="fi" placeholder="Имя (необязательно)" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          )}
          <input className="fi" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          <input className="fi" type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} />

          {error && (
            <div className="auth-error"><IconAlertCircle size={14} /> {error}</div>
          )}
          {info && <div className="auth-info">{info}</div>}

          <Button type="submit" variant="primary" className="auth-submit" disabled={busy}>
            {busy ? 'Подождите...' : mode === 'signin' ? 'Войти' : 'Создать аккаунт'}
          </Button>
        </form>

        {mode === 'signin' && (
          <button type="button" className="link-btn auth-forgot" onClick={handleReset} disabled={busy}>
            Забыл пароль?
          </button>
        )}

        <div className="auth-switch">
          {mode === 'signin' ? 'Ещё нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
          <button type="button" className="link-btn" onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); setInfo(''); }}>
            {mode === 'signin' ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </div>
      </Card>
    </div>
  );
}
