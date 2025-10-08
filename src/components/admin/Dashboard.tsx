import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function Dashboard() {
  const metrics = useQuery(api.labData.getMetrics);
  const recentLabData = useQuery(api.labData.list);
  const recentSamples = useQuery(api.samples.list);

  const recentData = recentLabData?.slice(0, 5) || [];
  const recentSampleData = recentSamples?.slice(0, 5) || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
        <p className="text-gray-600">Ringkasan aktivitas dan statistik proyek</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sampel</p>
              <p className="text-2xl font-bold text-gray-900">{metrics?.totalSamples || 0}</p>
            </div>
            <div className="text-3xl">🧪</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Lokasi Aktif</p>
              <p className="text-2xl font-bold text-gray-900">{metrics?.activeLocations || 0}</p>
            </div>
            <div className="text-3xl">📍</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Degradasi Rata-rata</p>
              <p className="text-2xl font-bold text-gray-900">{metrics?.avgDegradation || 0}%</p>
            </div>
            <div className="text-3xl">🧬</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">pH Rata-rata</p>
              <p className="text-2xl font-bold text-gray-900">{metrics?.avgPh || 0}</p>
            </div>
            <div className="text-3xl">⚗️</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
            <div className="text-center">
              <div className="text-2xl mb-2">➕</div>
              <div className="font-medium text-gray-900">Tambah Lokasi Baru</div>
              <div className="text-sm text-gray-600">Daftarkan lokasi pemantauan</div>
            </div>
          </button>
          
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors">
            <div className="text-center">
              <div className="text-2xl mb-2">🧪</div>
              <div className="font-medium text-gray-900">Input Sampel</div>
              <div className="text-sm text-gray-600">Catat sampel baru</div>
            </div>
          </button>
          
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors">
            <div className="text-center">
              <div className="text-2xl mb-2">🔬</div>
              <div className="font-medium text-gray-900">Data Laboratorium</div>
              <div className="text-sm text-gray-600">Input hasil analisis</div>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Lab Terbaru</h2>
          <div className="space-y-3">
            {recentData.length > 0 ? (
              recentData.map((data) => (
                <div key={data._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">
                      {data.sample?.sampleId || "Unknown Sample"}
                    </div>
                    <div className="text-sm text-gray-600">
                      {data.location?.name || "Unknown Location"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">
                      {data.degradationPercentage}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(data.testDate).toLocaleDateString('id-ID')}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                <div className="text-3xl mb-2">📊</div>
                <p>Belum ada data laboratorium</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sampel Terbaru</h2>
          <div className="space-y-3">
            {recentSampleData.length > 0 ? (
              recentSampleData.map((sample) => (
                <div key={sample._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{sample.sampleId}</div>
                    <div className="text-sm text-gray-600">
                      {sample.location?.name || "Unknown Location"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{sample.collectorName}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(sample.collectionDate).toLocaleDateString('id-ID')}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                <div className="text-3xl mb-2">🧪</div>
                <p>Belum ada sampel tercatat</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
