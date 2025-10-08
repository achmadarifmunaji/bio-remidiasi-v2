import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { toast } from "sonner";

export default function DataManagement() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<Id<"labData"> | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const labData = useQuery(api.labData.list);
  const samples = useQuery(api.samples.list);
  const createLabData = useMutation(api.labData.create);
  const updateLabData = useMutation(api.labData.update);
  const deleteLabData = useMutation(api.labData.remove);
  const generateUploadUrl = useMutation(api.labData.generateUploadUrl);

  const [formData, setFormData] = useState({
    sampleId: "",
    ph: "",
    temperature: "",
    microplasticConcentration: "",
    degradationPercentage: "",
    microorganism: "",
    testDate: new Date().toISOString().split('T')[0],
    notes: "",
  });

  const [beforeImage, setBeforeImage] = useState<File | null>(null);
  const [afterImage, setAfterImage] = useState<File | null>(null);

  const filteredData = labData?.filter(data =>
    data.sample?.sampleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    data.location?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    data.microorganism.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let beforeImageId: Id<"_storage"> | undefined;
      let afterImageId: Id<"_storage"> | undefined;

      // Upload images if provided
      if (beforeImage) {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": beforeImage.type },
          body: beforeImage,
        });
        const json = await result.json();
        beforeImageId = json.storageId;
      }

      if (afterImage) {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": afterImage.type },
          body: afterImage,
        });
        const json = await result.json();
        afterImageId = json.storageId;
      }

      const data = {
        sampleId: formData.sampleId as Id<"samples">,
        ph: parseFloat(formData.ph),
        temperature: parseFloat(formData.temperature),
        microplasticConcentration: parseFloat(formData.microplasticConcentration),
        degradationPercentage: parseFloat(formData.degradationPercentage),
        microorganism: formData.microorganism,
        testDate: new Date(formData.testDate).getTime(),
        beforeImageId,
        afterImageId,
        notes: formData.notes || undefined,
      };

      if (editingId) {
        await updateLabData({ id: editingId, ...data });
        toast.success("Data laboratorium berhasil diperbarui");
      } else {
        await createLabData(data);
        toast.success("Data laboratorium berhasil ditambahkan");
      }

      resetForm();
    } catch (error) {
      toast.error("Gagal menyimpan data laboratorium");
      console.error(error);
    }
  };

  const handleEdit = (data: any) => {
    setEditingId(data._id);
    setFormData({
      sampleId: data.sampleId,
      ph: data.ph.toString(),
      temperature: data.temperature.toString(),
      microplasticConcentration: data.microplasticConcentration.toString(),
      degradationPercentage: data.degradationPercentage.toString(),
      microorganism: data.microorganism,
      testDate: new Date(data.testDate).toISOString().split('T')[0],
      notes: data.notes || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: Id<"labData">) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        await deleteLabData({ id });
        toast.success("Data laboratorium berhasil dihapus");
      } catch (error) {
        toast.error("Gagal menghapus data laboratorium");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      sampleId: "",
      ph: "",
      temperature: "",
      microplasticConcentration: "",
      degradationPercentage: "",
      microorganism: "",
      testDate: new Date().toISOString().split('T')[0],
      notes: "",
    });
    setBeforeImage(null);
    setAfterImage(null);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Data Laboratorium</h1>
          <p className="text-gray-600">Kelola hasil analisis laboratorium</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Tambah Data Lab
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <input
          type="text"
          placeholder="Cari berdasarkan ID sampel, lokasi, atau mikroorganisme..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  {editingId ? "Edit Data Laboratorium" : "Tambah Data Laboratorium"}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sampel
                    </label>
                    <select
                      value={formData.sampleId}
                      onChange={(e) => setFormData(prev => ({ ...prev, sampleId: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Pilih Sampel</option>
                      {samples?.map((sample) => (
                        <option key={sample._id} value={sample._id}>
                          {sample.sampleId} - {sample.location?.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal Test
                    </label>
                    <input
                      type="date"
                      value={formData.testDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, testDate: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      pH
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.ph}
                      onChange={(e) => setFormData(prev => ({ ...prev, ph: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Suhu (°C)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.temperature}
                      onChange={(e) => setFormData(prev => ({ ...prev, temperature: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Konsentrasi Mikroplastik (mg/L)
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      value={formData.microplasticConcentration}
                      onChange={(e) => setFormData(prev => ({ ...prev, microplasticConcentration: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Persentase Degradasi (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={formData.degradationPercentage}
                      onChange={(e) => setFormData(prev => ({ ...prev, degradationPercentage: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mikroorganisme
                    </label>
                    <input
                      type="text"
                      value={formData.microorganism}
                      onChange={(e) => setFormData(prev => ({ ...prev, microorganism: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gambar Sebelum
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setBeforeImage(e.target.files?.[0] || null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gambar Sesudah
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setAfterImage(e.target.files?.[0] || null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
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

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sampel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lokasi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  pH
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Suhu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Degradasi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mikroorganisme
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((data) => (
                <tr key={data._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {data.sample?.sampleId || "Unknown"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {data.location?.name || "Unknown"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {data.ph}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {data.temperature}°C
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {data.degradationPercentage}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {data.microorganism}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(data.testDate).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(data)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(data._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔬</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada data laboratorium</h3>
            <p className="text-gray-500">Mulai dengan menambahkan data hasil analisis laboratorium</p>
          </div>
        )}
      </div>
    </div>
  );
}
