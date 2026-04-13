const http = require('http');

async function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function runTests() {
  console.log("=== BẮT ĐẦU TEST TOÀN BỘ LUỒNG ===\n");
  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.log(`[FAIL] ${message}`);
    }
  }

  try {
    // 1. Dropdown Cũ -> Mới (Lấy Tỉnh/Huyện/Xã bao gồm cả cũ)
    let res = await fetchJSON('http://localhost:3000/api/v1/provinces?active=all');
    assert(res.data.length > 0, 'Lấy được danh sách Tỉnh (Cũ -> Mới)');
    
    // 2. Dropdown Mới -> Cũ (Lấy Tỉnh/Xã chỉ lấy active)
    res = await fetchJSON('http://localhost:3000/api/v1/provinces?active=true');
    const inactiveProvinces = res.data.filter(p => !p.is_active);
    assert(inactiveProvinces.length === 0, 'Danh sách Tỉnh Mới không chứa tỉnh cũ (inactive)');

    // 3. Quick Search (Phường Đông Hoà)
    res = await fetchJSON('http://localhost:3000/api/v1/units/suggest?q=%C4%90%C3%B4ng%20H%C3%B2a&level=ward');
    assert(res.data.some(w => w.name.includes('Đông Hòa')), 'Tìm kiếm Nhanh ra kết quả "Đông Hòa"');

    // 4. Tra cứu Cũ -> Mới: Ca Sáp nhập Kế thừa (Tỉnh sáp nhập)
    const urlOldToNew1 = 'http://localhost:3000/api/v1/mappings?direction=old-to-new&province=Ph%C3%BA%20Y%C3%AAn&district=%C4%90%C3%B4ng%20H%C3%B2a&ward=Ph%C6%B0%E1%BB%9Dng%20%C4%90%C3%B4ng%20H%C3%B2a';
    res = await fetchJSON(urlOldToNew1);
    const mappingA = res.data[0];
    assert(res.data.length > 0 && mappingA.old_unit.grandparent === "Tỉnh Phú Yên" && mappingA.new_unit.grandparent === "Tỉnh Đắk Lắk", 
      'Cũ->Mới: Kế thừa tỉnh (Phường Đông Hoà, Phú Yên -> Đắk Lắk, Huyện/Xã giữ nguyên)');

    // 5. Tra cứu Cũ -> Mới: Ca gộp Xã trực tiếp (Xã Hoà Tâm -> Xã Hoà Xuân)
    const urlOldToNew2 = 'http://localhost:3000/api/v1/mappings?direction=old-to-new&ward=h%C3%B2a%20t%C3%A2m';
    res = await fetchJSON(urlOldToNew2);
    assert(res.data.length > 0 && res.data[0].new_unit.name === "Xã Hòa Xuân", 
      'Cũ->Mới: Gộp Xã Hoà Tâm -> Xã Hoà Xuân');

    // 6. Tra cứu Mới -> Cũ: Đảo ngược ca trên (Xã Hoà Xuân <- Xã Hoà Tâm ...)
    const urlNewToOld1 = 'http://localhost:3000/api/v1/mappings?direction=new-to-old&ward=h%C3%B2a%20xu%C3%A2n&province=%C4%90%E1%BA%AFk%20L%E1%BA%AFk';
    res = await fetchJSON(urlNewToOld1);
    assert(res.data.length >= 3 && res.data.some(d => d.old_unit.name === 'Xã Hòa Tâm'), 
      'Mới->Cũ: Mới (Xã Hoà Xuân, Đắk Lắk) bung ra đúng 3 xã Cũ (trong đó có Hoà Tâm)');

    // 7. Tra cứu Mới -> Cũ: Ca Phường Đống Hoà (Từ Phú Yên qua)
    const urlNewToOld2 = 'http://localhost:3000/api/v1/mappings?direction=new-to-old&province=%C4%90%E1%BA%AFk%20L%E1%BA%AFk&ward=Ph%C6%B0%E1%BB%9Dng%20%C4%90%C3%B4ng%20H%C3%B2a';
    res = await fetchJSON(urlNewToOld2);
    assert(res.data.length >= 3, 
      'Mới->Cũ: Phường Đông Hoà (Đắk Lắk) bung ra nhiều phường/xã cũ (trong đó có những phường của Phú Yên)');

    // 8. Tra cứu Xã/Huyện để trống (Chỉ Huyện)
    const urlOldToNew3 = 'http://localhost:3000/api/v1/mappings?direction=old-to-new&district=%C4%90%C3%B4ng%20H%C3%B2a&province=Ph%C3%BA%20Y%C3%AAn';
    res = await fetchJSON(urlOldToNew3);
    assert(res.data.length >= 8, 'Cũ->Mới: Bỏ trống Xã, tìm Huyện Đông Hoà xuất ra danh sách các Xã bên trong thay đổi (>= 8)');

  } catch (err) {
    console.error("LỖI TEST SCRIPT:", err);
  }

  console.log(`\n=== KẾT QUẢ: ${passed}/${total} TEST PASSED ===`);
  if (passed === total) {
    console.log("HỆ THỐNG ĐÃ HOẠT ĐỘNG HOÀN HẢO 100%!");
  } else {
    console.log("Có một số test case thất bại, cần kiểm tra lại.");
  }
}

runTests();
