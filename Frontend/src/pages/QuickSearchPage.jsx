import { useState } from "react";
import SearchInput from "../components/SearchInput";
import OldToNewCard from "../components/OldToNewCard";
import NewToOldCard from "../components/NewToOldCard";
import { fetchFuzzySearch } from "../services/api";

// Trang tim kiem nhanh - fuzzy + suggest
export default function QuickSearchPage() {
  const [activeTab, setActiveTab] = useState("old-to-new");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  // reset khi doi tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setResults([]);
    setError("");
    setSearched(false);
  };

  // xu ly tim kiem fuzzy
  const handleSearch = async (keyword) => {
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const data = await fetchFuzzySearch(keyword, activeTab);
      setResults(data);
      setSearched(true);
      console.log(`quick search: "${keyword}" -> ${data.length} results`);
    } catch (err) {
      console.log("quick search error:", err);
      setError(err.response?.data?.message || "Có lỗi xảy ra khi tìm kiếm");
    } finally {
      setLoading(false);
    }
  };

  // chuyen fuzzy result sang format cua OldToNewCard/NewToOldCard
  const formatResult = (item) => {
    if (!item.mapping) return null;

    if (activeTab === "old-to-new") {
      return {
        old_unit: item.unit,
        new_unit: item.mapping.mapped_unit,
        change: item.mapping.change,
      };
    } else {
      return {
        new_unit: item.unit,
        old_unit: item.mapping.mapped_unit,
        change: item.mapping.change,
      };
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Tab buttons */}
      <div className="flex gap-3 mb-8 justify-center">
        <button
          id="tab-quick-old-to-new"
          className={`tab-btn ${activeTab === "old-to-new" ? "active" : ""}`}
          onClick={() => handleTabChange("old-to-new")}
        >
          <span className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            Cũ → Mới
          </span>
        </button>
        <button
          id="tab-quick-new-to-old"
          className={`tab-btn ${activeTab === "new-to-old" ? "active" : ""}`}
          onClick={() => handleTabChange("new-to-old")}
        >
          <span className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Mới → Cũ
          </span>
        </button>
      </div>

      {/* Search form */}
      <div className="glass p-8 mb-8" style={{ animation: "pulse-glow 4s ease-in-out infinite" }}>
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold text-slate-200 mb-1">
            {activeTab === "old-to-new"
              ? "Tìm nhanh đơn vị cũ → mới"
              : "Tìm nhanh đơn vị mới → cũ"}
          </h2>
          <p className="text-sm text-slate-400">
            Gõ tên đơn vị hành chính để tìm kiếm nhanh
          </p>
        </div>

        <SearchInput
          key={activeTab}
          onSearch={handleSearch}
          direction={activeTab}
        />

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-3 text-slate-400">
              <div className="spinner" />
              Đang tìm kiếm...
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {searched && !loading && (
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
              {results.filter(r => r.mapping).length} kết quả có mapping
            </span>
          </div>

          {results.filter(r => r.mapping).length === 0 ? (
            <div className="glass-card p-8 text-center">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-slate-400">
                Không tìm thấy kết quả mapping nào
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Thử nhập từ khóa khác
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {results
                .filter(r => r.mapping)
                .map((item, idx) => {
                  const formatted = formatResult(item);
                  if (!formatted) return null;
                  return (
                    <div key={idx} style={{ animationDelay: `${idx * 0.1}s` }}>
                      {activeTab === "old-to-new" ? (
                        <OldToNewCard item={formatted} />
                      ) : (
                        <NewToOldCard item={formatted} />
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
