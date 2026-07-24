import { AdminLayout } from "@shared/ui/templates/AdminLayout";
import { Button } from "@shared/ui/atoms/Button";
import { Card, CardHeader, CardTitle } from "@shared/ui/atoms/Card";
import { Badge } from "@shared/ui/atoms/Badge";
import { useEmployeesViewModel } from "../viewmodels/useEmployeesViewModel";

export function EmployeesPage() {
  const { employees, isLoading } = useEmployeesViewModel();

  return (
    <AdminLayout title="Data Karyawan">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm border border-slate-200/80">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">Karyawan</h2>
          <p className="text-xs text-slate-500">Kelola staff & PIN.</p>
        </div>
        <Button variant="primary" size="sm">+ Tambah Karyawan</Button>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Daftar Karyawan</CardTitle>
            <p className="text-xs text-slate-500">{employees.length} staff.</p>
          </div>
        </CardHeader>
        <div className="p-4 overflow-x-auto">
          {isLoading ? (
            <p className="text-center text-xs text-slate-400 py-8">Memuat...</p>
          ) : employees.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-8">Belum ada data.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-3 py-2">Nama</th>
                  <th className="px-3 py-2">Role</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map((e) => (
                  <tr key={e.id} className="font-medium text-slate-700">
                    <td className="px-3 py-3">{e.name}</td>
                    <td className="px-3 py-3">{e.role}</td>
                    <td className="px-3 py-3">{e.email}</td>
                    <td className="px-3 py-3">
                      <Badge variant={e.active ? "success" : "info"}>{e.active ? "Aktif" : "Nonaktif"}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </AdminLayout>
  );
}
