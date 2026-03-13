import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function AddressDetail() {

  const { id } = useParams();

  // mock data (sau này lấy từ API)
  const data = {
    oldAddress: "Phường Hòa Thọ Đông, Quận Cẩm Lệ, Thành phố Đà Nẵng",
    newAddress: "Phường Cẩm Lệ, Thành phố Đà Nẵng",
    lat: 16.0471,
    lng: 108.2068
  };

  return (

    <div className="max-w-5xl mx-auto p-10">

      <h1 className="text-2xl font-bold mb-6">
        Chi tiết địa chỉ
      </h1>

      {/* MAP */}
      <div className="mb-8">

        <MapContainer
          center={[data.lat, data.lng]}
          zoom={13}
          style={{ height: "400px", width: "100%" }}
          className="rounded-lg shadow"
        >

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={[data.lat, data.lng]}>
            <Popup>{data.newAddress}</Popup>
          </Marker>

        </MapContainer>

      </div>

      {/* OLD ADDRESS */}
      <div className="border p-4 rounded-lg mb-4 shadow-sm">
        <strong>Địa chỉ cũ:</strong> {data.oldAddress}
      </div>

      {/* NEW ADDRESS */}
      <div className="border p-4 rounded-lg shadow-sm">
        <strong>Địa chỉ mới:</strong> {data.newAddress}
      </div>

    </div>

  );
}

export default AddressDetail;