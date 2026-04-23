import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface AffiliateConfirmDialogProps {
  open: boolean;
  provider: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function AffiliateConfirmDialog({ open, provider, onCancel, onConfirm }: AffiliateConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onCancel(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>确认通过 AFF 链接购买</DialogTitle>
          <DialogDescription>
            {provider ? `${provider} 的当前入口为 AFF 链接` : '当前入口为 AFF 链接'}
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm leading-relaxed text-muted-foreground">
          AFF 链接购买会给站点带来收益，也会让您购买时拥有一定优惠，请您注意当前为 AFF 链接，介意可以点击官方链接购买。
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>取消</Button>
          <Button onClick={onConfirm}>不介意，继续</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
