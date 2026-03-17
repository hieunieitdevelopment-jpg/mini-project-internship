// Component hien thi ket qua mapping
export default function ResultCard({ item, direction }) {
  const isOldToNew = direction === "old-to-new";
  const source = isOldToNew ? item.old_unit : item.new_unit;
  const target = isOldToNew ? item.new_unit : item.old_unit;
  const change = item.change;

  // format ngay
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // class cho badge change type
  const getBadgeClass = (type) => {
    switch (type) {
      case "merge":
        return "badge badge-merge";
      case "split":
        return "badge badge-split";
      case "rename":
        return "badge badge-rename";
      default:
        return "badge";
    }
  };

  // label tieng viet cho change type
  const getChangeLabel = (type) => {
    switch (type) {
      case "merge":
        return "Sáp nhập";
      case "split":
        return "Chia tách";
      case "rename":
        return "Đổi tên";
      default:
        return type;
    }
  };

  // hien thi dia chi day du (cho don vi cu)
  const getFullAddress = (unit) => {
    const parts = [unit.name];
    if (unit.parent) parts.push(unit.parent);
    if (unit.grandparent) parts.push(unit.grandparent);
    return parts.join(", ");
  };

  // hien thi dia chi rut gon: ten + tinh, bo huyen (cho don vi moi)
  const getShortAddress = (unit) => {
    const parts = [unit.name];
    if (unit.level === "ward") {
      if (unit.grandparent) parts.push(unit.grandparent);
    } else if (unit.level === "district") {
      if (unit.parent) parts.push(unit.parent);
    }
    return parts.join(", ");
  };

  return (
    <div className="glass-card p-5 animate-fade-in-up">
      {/* header: change type + nghi quyet */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className={getBadgeClass(change.type)}>
            {getChangeLabel(change.type)}
          </span>
          <span className="text-xs text-slate-500">
            {formatDate(change.effective_date)}
          </span>
        </div>
        {change.resolution_number && (
          <span className="text-xs text-slate-500 font-mono">
            NQ: {change.resolution_number}
          </span>
        )}
      </div>

      {/* source unit */}
      <div className="mb-3">
        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">
          {isOldToNew ? "📍 Đơn vị cũ" : "📍 Đơn vị mới"}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-slate-200">
            {getFullAddress(source)}
          </span>
          <span
            className={`badge ${source.is_active === false ? "badge-inactive" : "badge-active"}`}
          >
            {source.is_active === false ? "Inactive" : "Active"}
          </span>
        </div>
        {source.code && (
          <span className="text-xs text-slate-500 mt-1 block">
            Mã: {source.code}
          </span>
        )}
      </div>

      {/* arrow */}
      <div className="arrow-connector">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>

      {/* target unit */}
      <div className="mt-3">
        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">
          {isOldToNew ? "✅ Đơn vị mới" : "📋 Đơn vị cũ"}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-violet-300">
            {getShortAddress(target)}
          </span>
          <span
            className={`badge ${target.is_active === false ? "badge-inactive" : "badge-active"}`}
          >
            {target.is_active === false ? "Inactive" : "Active"}
          </span>
        </div>
        {target.code && (
          <span className="text-xs text-slate-500 mt-1 block">
            Mã: {target.code}
          </span>
        )}
      </div>

      {/* description */}
      {change.description && (
        <>
          <div className="divider" />
          <p className="text-sm text-slate-400 leading-relaxed">
            {change.description}
          </p>
        </>
      )}
    </div>
  );
}
