import { useState } from "react";
import { AdminLayout } from "@shared/ui/templates/AdminLayout";
import { Button } from "@shared/ui/atoms/Button";
import { Card } from "@shared/ui/atoms/Card";
import { Badge } from "@shared/ui/atoms/Badge";
import { useReviewsViewModel } from "../viewmodels/useReviewsViewModel";

export function ReviewsPage() {
  const { reviews, isLoading, reply } = useReviewsViewModel();
  const [replyId, setReplyId] = useState<string | null>(null);

  return (
    <AdminLayout title="Google Review">
      <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm border border-slate-200/80">
        <h2 className="text-lg font-extrabold text-slate-900">Ulasan Pelanggan</h2>
        <p className="text-xs text-slate-500">Balas review Google secara langsung.</p>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="animate-pulse rounded-2xl bg-white p-6 shadow-sm border border-slate-100 h-24" />
        ) : reviews.length === 0 ? (
          <Card><p className="text-center text-xs text-slate-400 py-8">Belum ada review.</p></Card>
        ) : (
          reviews.map((r) => (
            <Card key={r.id} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-slate-800">{r.author} <span className="text-amber-500">{'★'.repeat(r.rating)}</span></div>
                  <p className="text-sm text-slate-600 mt-1">{r.text}</p>
                  {r.replied && r.replyText && (
                    <p className="text-xs text-slate-400 mt-2 italic">Balasan: {r.replyText}</p>
                  )}
                </div>
                <Badge variant={r.replied ? "success" : "warning"}>
                  {r.replied ? "Sudah Dibalas" : "Belum Dibalas"}
                </Badge>
              </div>
              {!r.replied && (
                <div className="mt-3">
                  {replyId === r.id ? (
                    <div className="flex gap-2">
                      <Button variant="primary" size="sm" onClick={() => { reply(r.id); setReplyId(null); }}>Kirim Balasan</Button>
                      <Button variant="ghost" size="sm" onClick={() => setReplyId(null)}>Batal</Button>
                    </div>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => setReplyId(r.id)}>Balas</Button>
                  )}
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
