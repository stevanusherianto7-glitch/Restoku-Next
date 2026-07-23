import { useOutletStore } from "@features/outlet/ui/stores/useOutletStore";

export function OutletSwitcher() {
  const { outlets, selectedOutlet, selectOutlet } = useOutletStore();

  if (outlets.length <= 1) return null;

  return (
    <div className="relative">
      <select
        value={selectedOutlet?.id || ""}
        onChange={(e) => {
          const outlet = outlets.find((o) => o.id === e.target.value);
          if (outlet) selectOutlet(outlet);
        }}
        className="rounded-lg border border-gray-300 bg-white px-4 py-2 pr-8 text-sm font-medium text-gray-700 shadow-sm focus:border-cabe-500 focus:outline-none focus:ring-1 focus:ring-cabe-500"
      >
        {outlets.map((outlet) => (
          <option key={outlet.id} value={outlet.id}>
            {outlet.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
