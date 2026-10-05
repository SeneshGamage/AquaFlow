import { useQuery } from '@tanstack/react-query';
import { getMyShipments } from '@/api/shipments';
import type { Shipment } from '@/types';

const steps = ['PREPARING', 'IN_TRANSIT', 'CUSTOMS', 'DELIVERED'] as const;

function Stepper({ status }: { status: Shipment['status'] }) {
  const idx = steps.indexOf(status);
  return (
    <div className="flex items-center gap-2">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div
            className={`h-3 w-3 rounded-full ${
              i <= idx ? 'bg-slate-900' : 'bg-slate-200'
            }`}
          />
          {i < steps.length - 1 && (
            <div className={`h-0.5 w-8 ${i < idx ? 'bg-slate-900' : 'bg-slate-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function MyShipments() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['myShipments'],
    queryFn: getMyShipments,
  });

  if (isLoading) return <div className="p-6">Loading shipments…</div>;
  if (error) return <div className="p-6 text-red-700">Failed to load shipments.</div>;

  const shipments = data ?? [];

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">My Shipments</h1>

      {shipments.length === 0 ? (
        <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100 text-slate-600">
          No shipments yet.
        </div>
      ) : (
        <div className="space-y-4">
          {shipments.map((s) => (
            <div key={s.id} className="rounded-xl bg-white p-5 shadow-sm border border-slate-100">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-sm text-slate-600">Order #{s.orderId}</div>
                  <div className="text-lg font-semibold text-slate-900">{s.fishName}</div>
                  <div className="mt-1 text-sm text-slate-700">
                    {s.originCountry} → {s.destinationCountry}
                  </div>
                </div>
                <div className="text-sm text-slate-700">
                  <div className="font-medium">{s.carrierName}</div>
                  <div className="text-slate-600">Tracking: {s.trackingNumber}</div>
                </div>
              </div>

              <div className="mt-4">
                <Stepper status={s.status} />
                <div className="mt-2 text-sm text-slate-600">
                  ETA: {new Date(s.estimatedArrival).toLocaleDateString()}
                  {s.actualArrival ? ` • Arrived: ${new Date(s.actualArrival).toLocaleString()}` : ''}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {s.complianceDocumentUrl && (
                  <a
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50"
                    href={s.complianceDocumentUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Compliance Doc
                  </a>
                )}
                {s.healthCertificateUrl && (
                  <a
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50"
                    href={s.healthCertificateUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Health Certificate
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

