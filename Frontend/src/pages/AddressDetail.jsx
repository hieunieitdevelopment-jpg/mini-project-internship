import { useParams } from "react-router-dom";

function AddressDetail() {

  const { id } = useParams();

  // mock data
  const data = {
    oldAddress: "Xã Hòa Phú, Huyện Hòa Vang",
    newAddress: "Phường Hòa Phú",
    history: [
      "1997: thuộc huyện Hòa Vang",
      "2025: đổi thành phường Hòa Phú"
    ]
  };

  return (

    <div className="max-w-4xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        Chi tiết địa chỉ
      </h1>

      <div className="border p-4 rounded mb-4">
        <strong>Địa chỉ cũ:</strong> {data.oldAddress}
      </div>

      <div className="border p-4 rounded mb-4">
        <strong>Địa chỉ mới:</strong> {data.newAddress}
      </div>

      <div className="border p-4 rounded">
        <strong>Lịch sử thay đổi:</strong>

        <ul className="list-disc ml-6 mt-2">
          {data.history.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

      </div>

    </div>

  );
}

export default AddressDetail;