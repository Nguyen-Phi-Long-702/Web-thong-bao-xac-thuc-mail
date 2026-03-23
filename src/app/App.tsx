import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

type StatusType = 'success' | 'expired';
type ViewState = 'loading' | 'ready';

const defaultMessageByStatus: Record<StatusType, string> = {
  success: 'Email của bạn đã được xác thực thành công!',
  expired: 'Liên kết đã hết hạn. Vui lòng yêu cầu gửi lại email xác thực.',
};

const titleByStatus: Record<StatusType, string> = {
  success: 'Xác thực email thành công',
  expired: 'Xác thực email không thành công',
};

export default function App() {
  const [viewState, setViewState] = useState<ViewState>('loading');
  const [status, setStatus] = useState<StatusType>('success');
  const [message, setMessage] = useState('');

  useEffect(() => {
    document.title = 'Dang xac thuc email';
    const params = new URLSearchParams(window.location.search);
    const urlSuccess = params.get('success')?.toLowerCase().trim();
    const responseMessage = params.get('message') || params.get('error');

    if (urlSuccess === 'true') {
      setStatus('success');
      setMessage(responseMessage || defaultMessageByStatus.success);
      document.title = titleByStatus.success;
      setViewState('ready');
      return;
    }

    setStatus('expired');
    setMessage(responseMessage || defaultMessageByStatus.expired);
    document.title = titleByStatus.expired;
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
            {viewState === 'ready' && status === 'expired' && (
              <XCircle className="w-16 h-16 text-red-500" />
            )}
          </div>
          <CardTitle className="text-2xl leading-tight">
            {viewState === 'loading' && 'Đang xác thực...'}
            {viewState === 'ready' && status === 'success' && 'Xác Thực Thành Công!'}
            {viewState === 'ready' && status === 'expired' && 'Đã Hết Hạn'}
          </CardTitle>
          <CardDescription className="mt-3 text-base leading-relaxed">
            {viewState === 'loading' && 'Vui lòng chờ trong giây lát'}
            {viewState === 'ready' && status === 'success' && message}
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
