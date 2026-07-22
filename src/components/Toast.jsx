import { useAppState } from '../StateContext';

export default function Toast() {
  const { toastMsg, toastShow } = useAppState();
  return <div className={`toast${toastShow ? ' show' : ''}`}>{toastMsg}</div>;
}
