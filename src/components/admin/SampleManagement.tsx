import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { toast } from "sonner";

export default function SampleManagement() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<Id<"samples"> | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const samples = useQuery(api.samples.list);
  const locations = useQuery(api.locations.list);
  const createSample = useMutation(api.samples.create);
  const updateSample = useMutation(api.samples.update);
  const deleteSample = useMutation(api.samples.remove);

  const [formData, setFormData] = useState({
    sampleId: "",
    locationId: "",
    collectionDate: new Date().toISOString().split('T')[0],
    collectorName: "",
    notes: "",
  });

  const filteredSamples = samples?.filter(sample =>
    sample.sampleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sample.collectorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sample.location?.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const data = {
        sampleId: formData.sampleId,
        locationId: formData.locationId as Id<"locations">,
        collectionDate: new Date(formData.collectionDate).getTime(),
        collectorName: formData.collectorName,
        notes: formData.notes || undefined,
      };

      if (editingId) {
        await updateSample({ id: editingId, ...data });
        toast.success("Sampel berhasil diperbarui");
      } else {
        await createSample(data);
        toast.success("Sampel berhasil ditambahkan");
      }

      resetForm();
    } catch (error) {
      toast.error("Gagal menyimpan sampel");
      console.error(error);
    }
  };

  const handleEdit = (sample: any) => {
    setEditingId(sample._id);
    setFormData({
      sampleId: sample.sampleId,
      locationId: sample.locationId,
      collectionDate: new Date(sample.collectionDate).toISOString().split('T')[0],
      collectorName: sample.collectorName,
      notes: sample.notes || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: Id<"samples">) => {
    if (confirm("Apakah Anda yakin ingin menghapus sampel ini?")) {
      try {
        await deleteSample({ id });
        toast.success("Sampel berhasil dihapus");
      } catch (error) {
        toast.error("Gagal menghapus sampel");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      sampleId: "",
      locationId: "",
      collectionDate: new Date().toISOString().split('T')[0],
      collectorName: "",
      notes: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Sampel</h1>
          <p className="text-gray-600">Kelola sampel yang dikumpulkan untuk penelitian</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Tambah Sampel
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <input
          type="text"
          placeholder="Cari berdasarkan ID sampel, kolektor, atau lokasi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  {editingId ? "Edit Sampel" : "Tambah Sampel"}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID Sampel
                  </label>
                  <input
                    type="text"
                    value={formData.sampleId}
                    onChange={(e) => setFormData(prev => ({ ...prev, sampleId: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lokasi
                  </label>
                  <select
                    value={formData.locationId}
                    onChange={(e) => setFormData(prev => ({ ...prev, locationId: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Pilih Lokasi</option>
                    {locations?.map((location) => (
                      <option key={location._id} value={location._id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Pengumpulan
                  </label>
                  <input
                    type="date"
                    value={formData.collectionDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, collectionDate: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Kolektor
                  </label>
                  <input
                    type="text"
                    value={formData.collectorName}
                    onChange={(e) => setFormData(prev => ({ ...prev, collectorName: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catatan
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingId ? "Perbarui" : "Simpan"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Samples Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSamples.map((sample) => (
          <div key={sample._id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{sample.sampleId}</h3>
                <p className="text-sm text-gray-500">
                  {sample.location?.name || "Unknown Location"}
                </p>
              </div>
              <div className="text-xs text-gray-500">
                {new Date(sample.collectionDate).toLocaleDateString('id-ID')}
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Kolektor:</span>
                <span className="font-medium">{sample.collectorName}</span>
              </div>
              {sample.notes && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Catatan:</span> {sample.notes}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(sample)}
                className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(sample._id)}
                className="flex-1 px-3 py-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredSamples.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🧪</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada sampel</h3>
          <p className="text-gray-500">Mulai dengan menambahkan sampel pertama</p>
        </div>
      )}
    </div>
  );
}
