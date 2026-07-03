import type { ParcelEvent, Shipment } from '@/lib/orders';

function fmtTimestamp(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

export function ParcelTrackingTimeline({ events, shipment }: { events: ParcelEvent[]; shipment: Shipment | null }) {
  if (events.length === 0 && !shipment) return null;

  const newestFirst = [...events].reverse();

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-soft">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-display font-bold text-stone-900">Live Tracking</h2>
        <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-700">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          Live
        </span>
      </div>

      {shipment && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-stone-50 px-4 py-3 text-sm">
          <div>
            <span className="text-stone-500">Courier: </span>
            <span className="font-semibold text-stone-800">{shipment.courier}</span>
          </div>
          {shipment.trackingUrl && (
            <a
              href={shipment.trackingUrl} target="_blank" rel="noopener noreferrer"
              className="text-xs font-semibold text-brand-600 hover:underline"
            >
              Track on courier&apos;s site →
            </a>
          )}
        </div>
      )}

      {newestFirst.length === 0 ? (
        <p className="text-sm text-stone-400">No tracking updates yet. Check back soon.</p>
      ) : (
        <ol className="space-y-5">
          {newestFirst.map((event, i) => (
            <li key={event.id} className="relative flex gap-4">
              <div className="flex flex-col items-center">
                <span className={`flex h-3 w-3 flex-shrink-0 rounded-full ${i === 0 ? 'bg-brand-600 ring-4 ring-brand-100' : 'bg-stone-300'}`} />
                {i < newestFirst.length - 1 && <span className="mt-1 w-px flex-1 bg-stone-200" />}
              </div>
              <div className="flex-1 pb-1">
                <p className={`font-semibold capitalize ${i === 0 ? 'text-stone-900' : 'text-stone-600'}`}>
                  {event.status.replace(/_/g, ' ')}
                </p>
                {event.location && <p className="text-sm text-stone-500">{event.location}</p>}
                {event.description && <p className="text-sm text-stone-500">{event.description}</p>}
                <p className="mt-0.5 text-xs text-stone-400">{fmtTimestamp(event.eventTimestamp)}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
