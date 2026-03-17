import { useState, useEffect } from "react";
import { fetchProvinces, fetchDistricts, fetchWards, fetchWardsByProvince } from "../services/api";

// Component dropdown: 3 cap (Tinh -> Huyen -> Xa) hoac 2 cap (Tinh -> Xa)
export default function DropdownSelector({ onChange, showInactive = false, twoLevel = false }) {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  // load tinh khi mount
  useEffect(() => {
    const loadProvinces = async () => {
      setLoadingProvinces(true);
      try {
        const data = await fetchProvinces();
        setProvinces(data);
        console.log("loaded provinces:", data.length);
      } catch (err) {
        console.log("loi load provinces:", err);
      } finally {
        setLoadingProvinces(false);
      }
    };
    loadProvinces();
  }, []);

  // khi chon tinh -> load huyen (chi khi 3 cap)
  useEffect(() => {
    if (!selectedProvince) {
      setDistricts([]);
      setSelectedDistrict("");
      setWards([]);
      setSelectedWard("");
      return;
    }

    if (twoLevel) {
      // 2 cap: load xa truc tiep theo tinh
      const loadWardsByProvince = async () => {
        setLoadingWards(true);
        setSelectedWard("");
        try {
          const active = !showInactive;
          const data = await fetchWardsByProvince(selectedProvince, active);
          setWards(data);
          console.log("loaded wards by province:", data.length);
        } catch (err) {
          console.log("loi load wards by province:", err);
        } finally {
          setLoadingWards(false);
        }
      };
      loadWardsByProvince();
    } else {
      // 3 cap: load huyen
      const loadDistricts = async () => {
        setLoadingDistricts(true);
        setSelectedDistrict("");
        setWards([]);
        setSelectedWard("");
        try {
          const data = await fetchDistricts(selectedProvince);
          setDistricts(data);
          console.log("loaded districts:", data.length);
        } catch (err) {
          console.log("loi load districts:", err);
        } finally {
          setLoadingDistricts(false);
        }
      };
      loadDistricts();
    }
  }, [selectedProvince]);

  // khi chon huyen -> load xa (chi khi 3 cap)
  useEffect(() => {
    if (twoLevel) return;

    if (!selectedDistrict) {
      setWards([]);
      setSelectedWard("");
      return;
    }

    const loadWards = async () => {
      setLoadingWards(true);
      setSelectedWard("");
      try {
        // showInactive=true -> lay xa cu (active=false)
        const active = !showInactive;
        const data = await fetchWards(selectedDistrict, active);
        setWards(data);
        console.log("loaded wards:", data.length);
      } catch (err) {
        console.log("loi load wards:", err);
      } finally {
        setLoadingWards(false);
      }
    };
    loadWards();
  }, [selectedDistrict]);

  // notify parent khi selection thay doi
  useEffect(() => {
    if (onChange) {
      const provinceName =
        provinces.find((p) => p.id === Number(selectedProvince))?.name || "";
      const districtName =
        districts.find((d) => d.id === Number(selectedDistrict))?.name || "";
      const wardName =
        wards.find((w) => w.id === Number(selectedWard))?.name || "";

      onChange({
        province: provinceName,
        district: twoLevel ? "" : districtName,
        ward: wardName,
      });
    }
  }, [selectedProvince, selectedDistrict, selectedWard]);

  return (
    <div className="flex flex-col gap-4">
      {/* Tinh/TP */}
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">
          <span className="flex items-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
            </svg>
            Tỉnh / Thành phố
          </span>
        </label>
        <select
          id="province-select"
          className="custom-select"
          value={selectedProvince}
          onChange={(e) => setSelectedProvince(e.target.value)}
          disabled={loadingProvinces}
        >
          <option value="">
            {loadingProvinces ? "Đang tải..." : "-- Chọn tỉnh/TP --"}
          </option>
          {provinces.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Quan/Huyen - chi hien khi 3 cap */}
      {!twoLevel && (
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            <span className="flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Quận / Huyện
            </span>
          </label>
          <select
            id="district-select"
            className="custom-select"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            disabled={!selectedProvince || loadingDistricts}
          >
            <option value="">
              {loadingDistricts
                ? "Đang tải..."
                : !selectedProvince
                  ? "-- Chọn tỉnh trước --"
                  : "-- Chọn quận/huyện --"}
            </option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Xa/Phuong */}
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">
          <span className="flex items-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m3 11 19-9-9 19-2-8-8-2z" />
            </svg>
            Xã / Phường / Thị trấn
          </span>
        </label>
        <select
          id="ward-select"
          className="custom-select"
          value={selectedWard}
          onChange={(e) => setSelectedWard(e.target.value)}
          disabled={twoLevel ? !selectedProvince || loadingWards : !selectedDistrict || loadingWards}
        >
          <option value="">
            {loadingWards
              ? "Đang tải..."
              : twoLevel
                ? !selectedProvince
                  ? "-- Chọn tỉnh trước --"
                  : wards.length === 0
                    ? "-- Không có xã/phường --"
                    : "-- Chọn xã/phường --"
                : !selectedDistrict
                  ? "-- Chọn huyện trước --"
                  : wards.length === 0
                    ? "-- Không có xã/phường --"
                    : "-- Chọn xã/phường --"}
          </option>
          {wards.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
