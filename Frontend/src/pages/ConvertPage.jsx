import { useState } from "react";
import DropdownSelector from "../components/DropdownSelector";
import OldToNewCard from "../components/OldToNewCard";
import NewToOldCard from "../components/NewToOldCard";
import { fetchOldToNew, fetchNewToOld } from "../services/api";

export default function ConvertPage() {
  const [activeTab, setActiveTab] = useState("old-to-new");
  const [selection, setSelection] = useState({
    province: "",
    district: "",
    ward: "",
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  // reset khi đổi tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setResults([]);
    setError("");
    setSearched(false);
    setSelection({ province: "", district: "", ward: "" });
  };

  // xu ly tra cuu
  const handleSearch = async () => {
    const { province, district, ward } = selection;

    // can it nhat 1 truong
    if (!province && !district && !ward) {
      setError("Hãy chọn ít nhất tỉnh/huyện hoặc xã để tra cứu");
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);

    try {
      let data;
      if (activeTab === "old-to-new") {
        data = await fetchOldToNew(province, district, ward);
      } else {
        data = await fetchNewToOld(province, district, ward);
      }

      setResults(data);
      setSearched(true);
      console.log(`search ${activeTab}: found ${data.length} results`);
    } catch (err) {
      console.log("search error:", err);
      setError(err.response?.data?.message || "Có lỗi xảy ra khi tra cứu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Tab buttons */}
      <div className="flex gap-3 mb-8 justify-center">
        <button
          id="tab-old-to-new"
          className={`tab-btn ${activeTab === "old-to-new" ? "active" : ""}`}
          onClick={() => handleTabChange("old-to-new")}
        >
          <span className="flex items-center gap-2">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            Cũ → Mới
          </span>
        </button>
        <button
          id="tab-new-to-old"
          className={`tab-btn ${activeTab === "new-to-old" ? "active" : ""}`}
          onClick={() => handleTabChange("new-to-old")}
        >
          <span className="flex items-center gap-2">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Mới → Cũ
          </span>
        </button>
      </div>

      {/* Form container */}
      <div className="glass p-8 mb-8" style={{ animation: "pulse-glow 4s ease-in-out infinite" }}>
        {/* Tab description */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold text-slate-200 mb-1">
            {activeTab === "old-to-new"
              ? "Tra cứu đơn vị cũ → mới"
              : "Tra cứu đơn vị mới → cũ"}
          </h2>
          <p className="text-sm text-slate-400">
            {activeTab === "old-to-new"
              ? "Chọn đơn vị hành chính cũ để xem đã đổi thành đơn vị nào"
              : "Chọn đơn vị hành chính mới để xem gồm những đơn vị cũ nào"}
          </p>
        </div>

        {/* Dropdown selector */}
        <DropdownSelector
          key={activeTab}
          onChange={setSelection}
          showInactive={activeTab === "old-to-new"}
          twoLevel={activeTab === "new-to-old"}
        />

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Search button */}
        <div className="mt-6 flex justify-center">
          <button
            id="btn-search"
            className="btn-primary"
            onClick={handleSearch}
            disabled={loading}
          >
            <span className="flex items-center gap-2">
              {loading ? (
                <>
                  <div className="spinner" />
                  Đang tra cứu...
                </>
              ) : (
                <>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                  Tra cứu
                </>
              )}
            </span>
          </button>
        </div>
      </div>

      {/* Results */}
      {searched && (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-lg font-semibold text-slate-300">
              Kết quả
            </h3>
            <span className="badge" style={{
              background: 'rgba(139, 92, 246, 0.15)',
              color: '#c4b5fd',
              border: '1px solid rgba(139, 92, 246, 0.25)',
            }}>
              {results.length} kết quả
            </span>
          </div>

          {results.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-slate-400">
                Không tìm thấy kết quả nào phù hợp
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Thử chọn lại đơn vị hành chính khác
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {results.map((item, idx) => (
                <div key={idx} style={{ animationDelay: `${idx * 0.1}s` }}>
                  {activeTab === "old-to-new" ? (
                    <OldToNewCard item={item} />
                  ) : (
                    <NewToOldCard item={item} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
