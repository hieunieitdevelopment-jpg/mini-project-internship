import { useState, useEffect, useRef } from "react";
import { fetchSuggest } from "../services/api";

// Component input tim kiem voi autocomplete suggest
export default function SearchInput({ onSearch, direction }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  // dong suggestions khi click ngoai
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // reset khi doi direction
  useEffect(() => {
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  }, [direction]);

  // debounce suggest khi go
  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (val.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await fetchSuggest(val.trim(), direction);
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
        console.log("suggest:", data.length, "results");
      } catch (err) {
        console.log("suggest loi:", err);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  // chon 1 goi y
  const handleSelectSuggestion = (item) => {
    setQuery(item.name);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  // submit tim kiem
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && onSearch) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  // hien thi dia chi goi y
  const getSuggestLabel = (item) => {
    const parts = [item.name];
    if (item.parent) parts.push(item.parent);
    if (item.grandparent) parts.push(item.grandparent);
    return parts.join(", ");
  };

  // badge level
  const getLevelLabel = (level) => {
    switch (level) {
      case "province":
        return "Tỉnh";
      case "district":
        return "Huyện";
      case "ward":
        return "Xã";
      default:
        return level;
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="relative flex-1">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
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
          <input
            id="quick-search-input"
            type="text"
            className="custom-select"
            style={{ paddingLeft: "2.75rem" }}
            placeholder="Nhập tên đơn vị hành chính..."
            value={query}
            onChange={handleInputChange}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            autoComplete="off"
          />
          {loading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="spinner" style={{ width: 16, height: 16 }} />
            </div>
          )}
        </div>
        <button
          id="btn-quick-search"
          type="submit"
          className="btn-primary"
          disabled={!query.trim()}
        >
          Tìm kiếm
        </button>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <div
          className="absolute z-50 w-full mt-2 rounded-xl overflow-hidden"
          style={{
            background: "rgba(15, 23, 42, 0.95)",
            border: "1px solid rgba(139, 92, 246, 0.2)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4)",
            maxHeight: "300px",
            overflowY: "auto",
          }}
        >
          {suggestions.map((item, idx) => (
            <button
              key={item.id || idx}
              className="w-full px-4 py-3 text-left flex items-center justify-between gap-3 transition-colors"
              style={{
                borderBottom: idx < suggestions.length - 1 ? "1px solid rgba(148, 163, 184, 0.08)" : "none",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(139, 92, 246, 0.1)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              onClick={() => handleSelectSuggestion(item)}
            >
              <div>
                <div className="text-sm font-medium text-slate-200">
                  {getSuggestLabel(item)}
                </div>
              </div>
              <span
                className="badge text-xs"
                style={{
                  background: "rgba(139, 92, 246, 0.15)",
                  color: "#c4b5fd",
                  border: "1px solid rgba(139, 92, 246, 0.25)",
                  flexShrink: 0,
                }}
              >
                {getLevelLabel(item.level)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
