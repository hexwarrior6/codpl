import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function NotFoundRoute() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div className="text-sm font-medium uppercase tracking-widest text-muted-foreground">404</div>
      <h1 className="text-3xl font-semibold">页面未找到</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        你访问的地址不存在或已被移除。回到概览页看看最新测速结果。
      </p>
      <Button asChild>
        <Link to="/">返回概览</Link>
      </Button>
    </div>
  );
}
