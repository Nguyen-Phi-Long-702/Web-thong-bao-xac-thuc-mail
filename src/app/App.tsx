import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

type StatusType = 'success' | 'used' | 'expired';
type ViewState = 'loading' | 'ready';

const normalizeStatus = (raw: string | null): StatusType | null => {
  if (!raw) {
    return null;
  }
  const value = raw.toLowerCase();
  if (['success', 'verified', 'ok'].includes(value)) {
    return 'success';
  }
  if (['used', 'already_verified', 'already-verified'].includes(value)) {
    return 'used';
  }
  if (['expired', 'invalid', 'token_expired', 'token-expired'].includes(value)) {
    return 'expired';
  }
  return null;
};

const mapMessageToStatus = (rawMessage: string | null): StatusType => {
  const message = (rawMessage || '').toLowerCase();
  if (message.includes('đã được xác thực') || message.includes('already verified')) {
    return 'used';
  }
  if (
    message.includes('hết hạn') ||
    message.includes('expired') ||
    message.includes('không hợp lệ') ||
    message.includes('invalid')
  ) {
    return 'expired';
  }
  return 'expired';
};

const defaultMessageByStatus: Record<StatusType, string> = {
  success: 'Email của bạn đã được xác thực thành công!',
  used: 'Liên kết xác thực này đã được sử dụng trước đó.',
  expired: 'Liên kết đã hết hạn. Vui lòng yêu cầu gửi lại email xác thực.',
};

export default function App() {
  const [viewState, setViewState] = useState<ViewState>('loading');
  const [status, setStatus] = useState<StatusType>('success');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlSuccess = params.get('success');
    const urlStatus = normalizeStatus(params.get('status'));
    const urlMessage = params.get('message');

    if (urlSuccess !== null) {
      const normalizedSuccess = urlSuccess.toLowerCase().trim();
      const isSuccess = normalizedSuccess === 'true' || normalizedSuccess === '1';
      if (isSuccess) {
        setStatus('success');
        setMessage(urlMessage || defaultMessageByStatus.success);
        setViewState('ready');
        return;
      }

      const mapped = mapMessageToStatus(urlMessage);
      setStatus(mapped);
      setMessage(urlMessage || defaultMessageByStatus[mapped]);
      setViewState('ready');
      return;
    }

    if (urlStatus) {
      setStatus(urlStatus);
      setMessage(urlMessage || defaultMessageByStatus[urlStatus]);
      setViewState('ready');
      return;
    }

    setStatus('expired');
    setMessage('Liên kết xác thực không hợp lệ.');
    setViewState('ready');
  }, []);

  return (
    <div className="size-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center pb-3">
          <div className="flex justify-center mb-5">
            {viewState === 'loading' && (
              <AlertCircle className="w-16 h-16 text-slate-400 animate-pulse" />
            )}
            {viewState === 'ready' && status === 'success' && (
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            )}
            {viewState === 'ready' && status === 'used' && (
              <AlertCircle className="w-16 h-16 text-blue-500" />
            )}
            {viewState === 'ready' && status === 'expired' && (
              <XCircle className="w-16 h-16 text-red-500" />
            )}
          </div>
          <CardTitle className="text-2xl leading-tight">
            {viewState === 'loading' && 'Đang xác thực...'}
            {viewState === 'ready' && status === 'success' && 'Xác Thực Thành Công!'}
            {viewState === 'ready' && status === 'used' && 'Đã Xác Thực'}
            {viewState === 'ready' && status === 'expired' && 'Đã Hết Hạn'}
          </CardTitle>
          <CardDescription className="mt-3 text-base leading-relaxed">
            {viewState === 'loading' && 'Vui lòng chờ trong giây lát'}
            {viewState === 'ready' && status === 'success' && message}
            {viewState === 'ready' && status === 'used' && message}
            {viewState === 'ready' && status === 'expired' && message}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-1 space-y-4">
          {viewState === 'ready' && status === 'success' && (
            <div className="pt-2">
              <p className="text-sm text-gray-600 text-center">
                Tài khoản của bạn đã được kích hoạt. Bạn có thể đăng nhập và bắt đầu sử dụng dịch vụ của chúng tôi.
              </p>
            </div>
          )}

          {viewState === 'ready' && status === 'used' && (
            <div className="pt-2">
              <p className="text-sm text-gray-600 text-center">
                Tài khoản của bạn đã được xác thực và kích hoạt. Không cần thao tác thêm.
              </p>
            </div>
          )}

          {viewState === 'ready' && status === 'expired' && (
            <div className="pt-2">
              <p className="text-sm text-gray-600 text-center">
                Vui lòng kiểm tra email mới nhất của bạn hoặc yêu cầu gửi lại email.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
