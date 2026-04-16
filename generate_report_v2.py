#!/usr/bin/env python3
"""
Script tạo báo cáo thực tập theo mẫu Đại học Đông Á (MAU_KHOA_TTNN.docx).
Cách dùng: python3 generate_report_v2.py
"""
import os
from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn, nsdecls
from docx.oxml import parse_xml

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
IMAGES_DIR = os.path.join(SCRIPT_DIR, "images")

# ============================================================
# THÔNG TIN - THAY ĐỔI TẠI ĐÂY
# ============================================================
INFO = {
    "truong": "TRƯỜNG ĐẠI HỌC ĐÔNG Á",
    "khoa": "KHOA CÔNG NGHỆ THÔNG TIN",
    "nam_hoc": "2023 - 2024",
    "de_tai": "XÂY DỰNG HỆ THỐNG CHUYỂN ĐỔI ĐỊA CHỈ\nVN ADDRESS CONVERTER",
    "ho_ten": "Nguyễn Văn A",
    "lop": "CNTT - K20",
    "dien_thoai": "0123 456 789",
    "email": "example@email.com",
    "gvhd": "ThS. Tạ Quốc Ý",
    "don_vi": "CÔNG TY TNHH GIẢI PHÁP THÔNG MINH POPIPLUS",
    "dia_chi": "Verosa Park, Số 39 Đường số 10, Khu phố 2, Phường Phú Hữu, TP Thủ Đức, TP HCM",
    "nam": "2026",
    "thanh_pho": "Đà Nẵng",
}

FONT_NAME = "Times New Roman"
FONT_SIZE = 12  # pt - theo mẫu trường


def _set_font(run, size=FONT_SIZE, bold=False, italic=False, color=None):
    run.font.name = FONT_NAME
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.italic = italic
    if color:
        run.font.color.rgb = RGBColor(*color)
    run._element.rPr.rFonts.set(qn('w:eastAsia'), FONT_NAME)


def _shading(cell, hex_color):
    sh = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    cell._tc.get_or_add_tcPr().append(sh)


def add_p(doc, text, size=FONT_SIZE, bold=False, italic=False, align=None,
          indent=False, spacing=1.5, sb=6, sa=6):
    p = doc.add_paragraph()
    run = p.add_run(text)
    _set_font(run, size, bold, italic)
    pf = p.paragraph_format
    pf.line_spacing = spacing
    pf.space_before = Pt(sb)
    pf.space_after = Pt(sa)
    if align is not None:
        pf.alignment = align
    if indent:
        pf.first_line_indent = Cm(1.27)
    return p


def add_bullet(doc, text):
    p = doc.add_paragraph(style="List Bullet")
    p.clear()
    run = p.add_run(text)
    _set_font(run)
    p.paragraph_format.line_spacing = 1.5
    p.paragraph_format.space_before = Pt(3)
    p.paragraph_format.space_after = Pt(3)
    return p


def add_heading(doc, text, level=1):
    h = doc.add_heading(text, level=level)
    sizes = {0: 16, 1: 14, 2: 13, 3: FONT_SIZE}
    for run in h.runs:
        _set_font(run, sizes.get(level, FONT_SIZE), bold=True)
        run.font.color.rgb = RGBColor(0, 0, 0)
    h.paragraph_format.space_before = Pt(12)
    h.paragraph_format.space_after = Pt(6)
    h.paragraph_format.line_spacing = 1.5
    return h


def add_table(doc, headers, rows, caption=None):
    if caption:
        parts = caption.split(":", 1)
        cp = doc.add_paragraph()
        r1 = cp.add_run(parts[0] + ":")
        _set_font(r1, 11, bold=True)
        if len(parts) > 1:
            r2 = cp.add_run(parts[1])
            _set_font(r2, 11, italic=True)
        cp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        cp.paragraph_format.space_after = Pt(4)
    t = doc.add_table(rows=1 + len(rows), cols=len(headers))
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    t.style = "Table Grid"
    for i, h in enumerate(headers):
        c = t.rows[0].cells[i]
        c.text = ""
        run = c.paragraphs[0].add_run(h)
        _set_font(run, 11, bold=True)
        c.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
        c.paragraphs[0].paragraph_format.line_spacing = 1.0
        _shading(c, "D9E2F3")
    for ri, row in enumerate(rows):
        for ci, val in enumerate(row):
            c = t.rows[ri + 1].cells[ci]
            c.text = ""
            run = c.paragraphs[0].add_run(str(val))
            _set_font(run, 11)
            c.paragraphs[0].paragraph_format.line_spacing = 1.0
    sp = doc.add_paragraph()
    r = sp.add_run("Nguồn: Tác giả tự tổng hợp")
    _set_font(r, 10, italic=True)
    sp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    sp.paragraph_format.space_after = Pt(10)
    return t


def add_image(doc, filename, caption, width=Cm(14)):
    """Chèn ảnh từ thư mục images/ + ghi chú bên dưới."""
    img_path = os.path.join(IMAGES_DIR, filename)
    if not os.path.exists(img_path):
        add_p(doc, f"[Ảnh chưa có: {filename}]", italic=True, align=WD_ALIGN_PARAGRAPH.CENTER)
    else:
        doc.add_picture(img_path, width=width)
        doc.paragraphs[-1].alignment = WD_ALIGN_PARAGRAPH.CENTER
    # Ghi chú ảnh
    cp = doc.add_paragraph()
    run = cp.add_run(caption)
    _set_font(run, 11, bold=True, italic=True)
    cp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    cp.paragraph_format.space_before = Pt(4)
    cp.paragraph_format.space_after = Pt(12)


def add_toc(doc):
    p = doc.add_paragraph()
    r1 = p.add_run()
    r1._element.append(parse_xml(f'<w:fldChar {nsdecls("w")} w:fldCharType="begin"/>'))
    r2 = p.add_run()
    r2._element.append(parse_xml(f'<w:instrText {nsdecls("w")} xml:space="preserve"> TOC \\o "1-3" \\h \\z \\u </w:instrText>'))
    r3 = p.add_run()
    r3._element.append(parse_xml(f'<w:fldChar {nsdecls("w")} w:fldCharType="separate"/>'))
    r4 = p.add_run("(Nhấn Ctrl+A → F9 để cập nhật mục lục)")
    _set_font(r4, FONT_SIZE, color=(128, 128, 128))
    r5 = p.add_run()
    r5._element.append(parse_xml(f'<w:fldChar {nsdecls("w")} w:fldCharType="end"/>'))


def _add_section_break(doc):
    """Thêm section break (new page) để tạo section mới."""
    new_sec = doc.add_section()
    new_sec.top_margin = Cm(2)
    new_sec.bottom_margin = Cm(2)
    new_sec.left_margin = Cm(3)
    new_sec.right_margin = Cm(2)
    return new_sec


def _reset_page_number(section):
    """Đặt lại số trang bắt đầu từ 1 cho section."""
    sectPr = section._sectPr
    pgNumType = parse_xml(f'<w:pgNumType {nsdecls("w")} w:start="1"/>')
    sectPr.append(pgNumType)


def add_page_number(doc):
    """Thêm số trang vào footer. Bìa + Mục lục (sections đầu) không có số trang.
    Nội dung chính (section cuối) có số trang bắt đầu từ 1."""
    for i, sec in enumerate(doc.sections):
        f = sec.footer
        f.is_linked_to_previous = False
        p = f.paragraphs[0]
        # Xóa nội dung cũ trong footer
        for run in p.runs:
            run.clear()
        p.clear()

        if i < 2:
            # Section 0: Bìa 1 + Bìa 2 => không có số trang
            # Section 1: Mục lục => không có số trang
            continue

        # Section 2 trở đi: Nội dung chính => có số trang
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        # Dùng fldSimple thay vì fldChar để tương thích LibreOffice
        fld_xml = (
            f'<w:fldSimple {nsdecls("w")} w:instr=" PAGE ">'
            f'  <w:r>'
            f'    <w:rPr>'
            f'      <w:rFonts w:ascii="{FONT_NAME}" w:hAnsi="{FONT_NAME}" w:eastAsia="{FONT_NAME}"/>'
            f'      <w:sz w:val="22"/>'
            f'    </w:rPr>'
            f'    <w:t>1</w:t>'
            f'  </w:r>'
            f'</w:fldSimple>'
        )
        p._element.append(parse_xml(fld_xml))


def dotted_lines(doc, n=15):
    for _ in range(n):
        p = doc.add_paragraph()
        r = p.add_run("." * 90)
        _set_font(r, FONT_SIZE, color=(220, 220, 220))
        p.paragraph_format.line_spacing = 2.0


# ============ TRANG BÌA 1 (bìa ngoài) ============
def cover1(doc):
    add_p(doc, "BỘ GIÁO DỤC VÀ ĐÀO TẠO", 12, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, sb=0, sa=0)
    add_p(doc, INFO["truong"], 12, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, sb=0, sa=0)
    add_p(doc, INFO["khoa"], 12, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, sb=0, sa=24)
    for _ in range(4):
        doc.add_paragraph()
    add_p(doc, "BÁO CÁO", 20, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, sb=0, sa=0)
    add_p(doc, "THỰC TẬP NGHỀ NGHIỆP", 20, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, sb=0, sa=6)
    add_p(doc, f"NĂM HỌC: {INFO['nam_hoc']}", 14, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, sb=0, sa=36)
    for _ in range(2):
        doc.add_paragraph()
    for label, val in [("Đơn vị thực tập:", INFO["don_vi"]),
                       ("Địa chỉ:", INFO["dia_chi"]),
                       ("Giảng viên hướng dẫn:", INFO["gvhd"]),
                       ("Họ và tên sinh viên:", INFO["ho_ten"]),
                       ("Lớp:", INFO["lop"])]:
        p = doc.add_paragraph()
        r1 = p.add_run(f"{label} ")
        _set_font(r1, FONT_SIZE, bold=True)
        r2 = p.add_run(val)
        _set_font(r2, FONT_SIZE)
        p.paragraph_format.left_indent = Cm(3)
        p.paragraph_format.line_spacing = 1.5
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
    for _ in range(3):
        doc.add_paragraph()
    add_p(doc, f"{INFO['thanh_pho']}, .../…", FONT_SIZE, italic=True, align=WD_ALIGN_PARAGRAPH.CENTER)
    # Không dùng page_break, sẽ dùng section break trong main()


# ============ TRANG BÌA 2 (bìa trong) ============
def cover2(doc):
    add_p(doc, "BỘ GIÁO DỤC VÀ ĐÀO TẠO", 12, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, sb=0, sa=0)
    add_p(doc, INFO["truong"], 12, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, sb=0, sa=0)
    add_p(doc, INFO["khoa"], 12, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, sb=0, sa=24)
    for _ in range(4):
        doc.add_paragraph()
    add_p(doc, "BÁO CÁO", 20, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, sb=0, sa=0)
    add_p(doc, "THỰC TẬP NGHỀ NGHIỆP", 20, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, sb=0, sa=6)
    add_p(doc, f"NĂM HỌC: {INFO['nam_hoc']}", 14, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, sb=0, sa=36)
    for _ in range(2):
        doc.add_paragraph()
    for label, val in [("Họ tên sinh viên:", INFO["ho_ten"]),
                       ("Lớp:", INFO["lop"]),
                       ("Điện thoại:", INFO["dien_thoai"]),
                       ("Email:", INFO["email"])]:
        p = doc.add_paragraph()
        r1 = p.add_run(f"{label} ")
        _set_font(r1, FONT_SIZE, bold=True)
        r2 = p.add_run(val)
        _set_font(r2, FONT_SIZE)
        p.paragraph_format.left_indent = Cm(3)
        p.paragraph_format.line_spacing = 1.5
    for _ in range(4):
        doc.add_paragraph()
    add_p(doc, f"{INFO['thanh_pho']}, .../….", FONT_SIZE, italic=True, align=WD_ALIGN_PARAGRAPH.CENTER)
    # Không dùng page_break, sẽ dùng section break trong main()


# ============ MỤC LỤC ============
def toc_page(doc):
    add_p(doc, "MỤC LỤC", 14, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, sb=0, sa=12)

    toc_items = [
        (0, "LỜI CẢM ƠN"),
        (0, "CHƯƠNG 1: TỔNG QUAN VỀ ĐƠN VỊ THỰC TẬP"),
        (1, "1.1. Giới thiệu đơn vị thực tập"),
        (1, "1.2. Lĩnh vực hoạt động"),
        (1, "1.3. Văn hóa và môi trường làm việc"),
        (1, "1.4. Các quy trình làm việc"),
        (2, "1.4.1. Đề xuất dự án"),
        (2, "1.4.2. Phân tích yêu cầu"),
        (2, "1.4.3. Thiết kế kiến trúc"),
        (2, "1.4.4. Phát triển (Sprint)"),
        (2, "1.4.5. Kiểm thử"),
        (2, "1.4.6. Triển khai (Release)"),
        (2, "1.4.7. Bảo trì & Hỗ trợ"),
        (2, "1.4.8. Đánh giá & Cải tiến (Retrospective)"),
        (1, "1.5. Vai trò của bản thân"),
        (0, "CHƯƠNG 2: BÀI TOÁN DỰ ÁN"),
        (1, "2.1. Thực trạng và vấn đề hiện tại đang tồn đọng"),
        (1, "2.2. Phát biểu bài toán dự án"),
        (1, "2.3. Đề xuất các giải pháp kiến nghị để giải quyết bài toán"),
        (1, "2.4. Xây dựng kế hoạch công việc cụ thể chi tiết để thực hiện"),
        (0, "CHƯƠNG 3: PHÂN TÍCH, THIẾT KẾ VÀ TRIỂN KHAI THỰC HIỆN DỰ ÁN"),
        (1, "3.1. Tóm lược các nội dung quan trọng cần thực hiện"),
        (1, "3.2. Phân tích và thiết kế"),
        (2, "3.2.1. Phân tích nghiệp vụ"),
        (2, "3.2.2. Kiến trúc hệ thống"),
        (2, "3.2.3. Mô hình dữ liệu"),
        (1, "3.3. Đề xuất thực hiện"),
        (2, "3.3.1. Lập kế hoạch 2 sprint"),
        (2, "3.3.2. Triển khai backend – Code minh hoạ"),
        (2, "3.3.3. Kiểm thử"),
        (1, "3.4. Thực hiện và đánh giá kết quả đạt được"),
        (0, "CHƯƠNG 4: ĐÁNH GIÁ KẾT QUẢ THỰC TẬP"),
        (1, "4.1. Những kết quả đạt được và các đóng góp cho dự án"),
        (1, "4.2. Khó khăn, hạn chế chưa khắc phục được và hướng giải quyết"),
        (1, "4.3. Bài học và cảm nghĩ rút ra sau khi thực tập"),
        (1, "4.4. Đề xuất hoàn thiện dự án (Hướng phát triển)"),
        (0, "PHỤ LỤC – NHẬT KÝ CÔNG VIỆC HÀNG TUẦN"),
        (0, "BẢN TỰ ĐÁNH GIÁ KẾT QUẢ CỦA SINH VIÊN THỰC TẬP"),
        (0, "NHẬN XÉT CỦA ĐƠN VỊ THỰC TẬP"),
        (0, "NHẬN XÉT CỦA GIÁO VIÊN HƯỚNG DẪN THỰC TẬP"),
        (0, "PHIẾU ĐÁNH GIÁ THỰC TẬP (LÀM VIỆC) CHO SINH VIÊN"),
    ]

    indent_map = {0: Cm(0), 1: Cm(1), 2: Cm(2)}
    size_map = {0: FONT_SIZE, 1: FONT_SIZE, 2: 11}
    bold_map = {0: True, 1: False, 2: False}

    for level, text in toc_items:
        p = doc.add_paragraph()
        run = p.add_run(text)
        _set_font(run, size_map[level], bold=bold_map[level])
        p.paragraph_format.left_indent = indent_map[level]
        p.paragraph_format.line_spacing = 1.5
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)

    # Không dùng page_break, sẽ dùng section break trong main()


# ============ LỜI CẢM ƠN ============
def loi_cam_on(doc):
    add_p(doc, "LỜI CẢM ƠN", 14, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, sb=0, sa=12)
    add_p(doc, f"Sau quãng thời gian học tập và rèn luyện dưới mái trường Đại học Đông Á, chúng em đã được truyền đạt những kiến thức nền tảng và những kinh nghiệm thực tiễn quý báu trong lĩnh vực Công nghệ Thông tin. Đây chính là hành trang vững chắc giúp chúng em tự tin bước vào thời gian thực tập tại doanh nghiệp.", indent=True)
    add_p(doc, f"Chúng em xin gửi lời biết ơn sâu sắc tới các Thầy Cô giảng viên, đặc biệt là {INFO['gvhd']}, người đã luôn đồng hành, theo sát và hỗ trợ chúng em từng bước trong quá trình thực hiện báo cáo thực tập.", indent=True)
    add_p(doc, f"Chúng em cũng xin bày tỏ lòng cảm ơn chân thành tới Ban Giám đốc và các anh/chị đang công tác tại {INFO['don_vi']}, đặc biệt là các anh/chị trong bộ phận kỹ thuật. Nhờ sự tạo điều kiện thuận lợi, hướng dẫn nhiệt tình và chia sẻ kinh nghiệm thực tế, chúng em đã có cơ hội được thực hành các kỹ năng chuyên môn, tiếp cận quy trình phát triển phần mềm và áp dụng kiến thức vào công việc thực tế.", indent=True)
    add_p(doc, "Mặc dù kiến thức và kinh nghiệm của chúng em còn hạn chế, nên báo cáo này không tránh khỏi những thiếu sót. Chúng em rất mong nhận được những góp ý, chỉ dẫn chân thành từ quý Thầy Cô để hoàn thiện hơn.", indent=True)
    add_p(doc, "Một lần nữa, xin chân thành cảm ơn tất cả những người đã đồng hành, hỗ trợ và truyền cảm hứng cho chúng em trong suốt thời gian thực tập.", indent=True)
    add_p(doc, "Chúng em xin trân trọng cảm ơn!", indent=True)
    doc.add_page_break()


# ============ CHƯƠNG 1 ============
def chuong1(doc):
    add_heading(doc, "CHƯƠNG 1: TỔNG QUAN VỀ ĐƠN VỊ THỰC TẬP", 1)

    add_heading(doc, "1.1. Giới thiệu đơn vị thực tập", 2)
    add_bullet(doc, f"Tên công ty: {INFO['don_vi']}")
    add_bullet(doc, "Mã số doanh nghiệp: 0318272823")
    add_bullet(doc, "Ngày cấp giấy chứng nhận đăng ký kinh doanh: 19/01/2024 (cấp bởi Sở Kế hoạch và Đầu tư TP HCM)")
    add_bullet(doc, f"Địa chỉ trụ sở: {INFO['dia_chi']}")
    add_bullet(doc, "Nền tảng chủ lực: LOZIDO – nền tảng số hoá quản lý nhà trọ, phòng trọ và việc làm.")
    add_p(doc, "POPIPLUS được thành lập với mục tiêu xây dựng một hệ sinh thái số hoá toàn diện, giúp người dùng nhanh chóng tìm kiếm, đăng tin và quản lý bất động sản cũng như việc làm một cách an toàn và hiệu quả.", indent=True)
    add_p(doc, "POPIPLUS hiện có quy mô khoảng 15–20 nhân viên, chia thành 3–4 nhóm phát triển song song. Mỗi nhóm gồm từ 3 đến 5 thành viên, bao gồm trưởng nhóm, backend developer, frontend developer và tester. Công ty sử dụng Trello làm công cụ quản lý công việc chính, kết hợp với Slack để giao tiếp và Google Meet để họp hằng ngày. Dự án VN Address Converter được giao cho một nhóm gồm 3 thành viên: 2 backend developer và 1 frontend developer, dưới sự hướng dẫn trực tiếp của mentor.", indent=True)

    add_heading(doc, "1.2. Lĩnh vực hoạt động", 2)
    add_table(doc,
        ["Lĩnh vực", "Mô tả ngắn gọn"],
        [["Nền tảng tìm trọ & căn hộ", "Website và ứng dụng đăng tin, tìm kiếm, liên hệ chủ nhà/môi giới."],
         ["Dịch vụ tuyển dụng", "Đăng tuyển, tìm việc và quản lý hồ sơ ứng viên."],
         ["Công nghệ dữ liệu địa lý", "CSDL địa chỉ, tích hợp bản đồ và API tra cứu."],
         ["Giải pháp phần mềm", "Thiết kế, phát triển và bảo trì hệ thống theo yêu cầu."]],
        "Bảng 1.1: Các lĩnh vực hoạt động của POPIPLUS")

    add_heading(doc, "1.3. Văn hóa và môi trường làm việc", 2)
    add_p(doc, "Giá trị cốt lõi: Sáng tạo – Chất lượng – Trách nhiệm – Hợp tác.", bold=True, indent=True)
    add_p(doc, "Kênh giao tiếp chính: Slack – chat nhanh, tạo kênh dự án, chia sẻ tài liệu; Google Meet – họp hằng ngày, review code, demo tính năng.", indent=True)
    add_p(doc, "Quản lý công việc: Trello – board Kanban để tạo, phân công và theo dõi task cho sprint và báo cáo tiến độ.", indent=True)
    add_p(doc, "Môi trường phát triển đồng nhất: Docker hoặc VS Code Remote Containers, giúp mọi thành viên có cùng cấu hình môi trường dù ở bất kỳ địa điểm nào.", indent=True)
    add_p(doc, "Giờ làm việc linh hoạt: Thống nhất khung giờ 8h đến 12h và 13h đến 17h để dễ sắp xếp cuộc họp chung ngày nghỉ và nghỉ phép được ghi nhận trong Trello.", indent=True)
    add_p(doc, "Đào tạo và phát triển:", bold=True, indent=True)
    add_bullet(doc, "Workshop / webinar hàng tháng Google Meet, nội dung công nghệ mới, best-practice và kỹ năng mềm.")
    add_bullet(doc, "Mentoring trực tuyến: mỗi thành viên có mentor riêng, gặp gỡ 1-1 qua video call để giải đáp thắc mắc.")
    add_p(doc, "Hoạt động gắn kết:", bold=True, indent=True)
    add_bullet(doc, "Virtual coffee break mỗi tuần để trò chuyện phi công việc.")
    add_bullet(doc, "Online hackathon mỗi 6 tháng, khuyến khích sáng tạo và thử nghiệm ý tưởng mới.")
    add_p(doc, "Bảo mật và truy cập: VPN hoặc SSH key để kết nối an toàn tới tài nguyên nội bộ; MFA cho tài khoản Git, cloud và các công cụ quản lý dự án.", indent=True)
    add_p(doc, "Công cụ hỗ trợ tài liệu: Confluence / Notion để lưu trữ tài liệu, kiến trúc và hướng dẫn; liên kết tài liệu trong các thẻ Trello để dễ truy cập.", indent=True)

    add_heading(doc, "1.4. Các quy trình làm việc", 2)

    add_heading(doc, "1.4.1. Đề xuất dự án", 3)
    add_p(doc, "Thành viên đưa ra ý tưởng dự án hoặc tính năng mới trên Trello (thẻ \"Idea\").", indent=True)
    add_p(doc, "Trưởng nhóm xem xét, bổ sung thông tin chi tiết (mục tiêu, phạm vi, lợi ích).", indent=True)
    add_p(doc, "Đánh giá tính khả thi và ưu tiên trong Sprint Planning (Google Meet).", indent=True)
    add_p(doc, "Khi được phê duyệt, thẻ chuyển sang cột \"Backlog\" và gán nhãn Priority tương ứng.", indent=True)

    add_heading(doc, "1.4.2. Phân tích yêu cầu", 3)
    add_p(doc, "Gathering: Thu thập yêu cầu từ khách hàng hoặc bộ phận kinh doanh qua Slack và tài liệu Google Docs.", indent=True)
    add_p(doc, "User Stories: Viết User Story trong Trello (cột \"To-Do\") kèm Acceptance Criteria rõ ràng.", indent=True)
    add_p(doc, "Review: Buổi họp ngắn (15-30 phút) trên Meet để xác nhận yêu cầu, sau đó lưu trữ tài liệu trên Confluence.", indent=True)

    add_heading(doc, "1.4.3. Thiết kế kiến trúc", 3)
    add_p(doc, "ERD & Database Design: Sử dụng Excalidraw để vẽ sơ đồ quan hệ, lưu trong thư mục design/ trên repo.", indent=True)
    add_p(doc, "API Specification: Tạo file OpenAPI/Swagger mô tả các endpoint, chia sẻ qua GitHub và Slack.", indent=True)
    add_p(doc, "UI/UX Wireframe: Thiết kế nhanh trong Figma, liên kết vào thẻ Trello để đội frontend tham khảo.", indent=True)

    add_heading(doc, "1.4.4. Phát triển (Sprint)", 3)
    add_p(doc, "Sprint Length: 1 tuần, bắt đầu bằng Sprint Planning (Google Meet) và kết thúc bằng Sprint Review + Retrospective.", indent=True)
    add_p(doc, "Branching Strategy: Mỗi tính năng có một branch feature/<tên-tính-năng>; tạo Pull Request (PR) ngay khi hoàn thành.", indent=True)
    add_p(doc, "Code Review: Các thành viên khác review PR trên GitHub, để lại comment trong Slack.", indent=True)
    add_p(doc, "CI/CD: Khi PR được merge, GitHub Actions tự động chạy unit test, lint và deploy lên môi trường Staging.", indent=True)

    add_heading(doc, "1.4.5. Kiểm thử", 3)
    add_p(doc, "Unit Test: Viết test bằng Jest (backend) và React Testing Library (frontend).", indent=True)
    add_p(doc, "Integration Test: Sử dụng Supertest cho API, chạy trong pipeline CI.", indent=True)
    add_p(doc, "E2E Test: Thực hiện bằng Cypress, lưu kết quả trong thư mục cypress/reports.", indent=True)
    add_p(doc, "Bug Tracking: Khi phát hiện lỗi, tạo thẻ \"Bug\" trên Trello, gán người chịu trách nhiệm và đặt deadline.", indent=True)

    add_heading(doc, "1.4.6. Triển khai (Release)", 3)
    add_p(doc, "Staging Deploy: Sau khi CI passes, hệ thống tự động deploy lên server staging (Docker/Kubernetes).", indent=True)
    add_p(doc, "Smoke Test: Nhóm QA thực hiện kiểm tra nhanh qua Slack.", indent=True)
    add_p(doc, "Production Release: Khi QA ký duyệt, thực hiện Release bằng GitHub Actions hoặc GitLab CI tới môi trường production.", indent=True)
    add_p(doc, "Post-Release Monitoring: Giám sát log và metric bằng Grafana/Prometheus, thông báo bất thường qua Slack.", indent=True)

    add_heading(doc, "1.4.7. Bảo trì & Hỗ trợ", 3)
    add_p(doc, "Incident Management: Khi có sự cố, mở thẻ \"Incident\" trên Trello, ghi lại thời gian, nguyên nhân và bước khắc phục.", indent=True)
    add_p(doc, "Patch & Update: Đưa các bản vá vào branch hotfix/<tên-vấn-đề>, tạo PR và triển khai nhanh.", indent=True)
    add_p(doc, "Documentation Update: Mọi thay đổi đều phải cập nhật tài liệu trên Confluence và API docs.", indent=True)

    add_heading(doc, "1.4.8. Đánh giá & Cải tiến (Retrospective)", 3)
    add_p(doc, "Buổi Retrospective: Diễn ra vào cuối mỗi sprint (Google Meet), mọi thành viên chia sẻ \"What went well\", \"What didn't go well\" và \"Action items\".", indent=True)
    add_p(doc, "Action Tracking: Các hành động cải tiến được ghi lại trong Trello (cột \"Improvement\") và theo dõi tiến độ.", indent=True)
    add_p(doc, "Continuous Improvement: Áp dụng các đề xuất vào quy trình kế tiếp, cập nhật SOP (Standard Operating Procedure) trong Confluence.", indent=True)

    add_heading(doc, "1.5. Vai trò của bản thân", 2)
    add_p(doc, "Trong thời gian thực tập, tôi đảm nhận vị trí Backend Developer trong nhóm phát triển dự án VN Address Converter. Nhiệm vụ chính của tôi là thiết kế và xây dựng các API phục vụ cho việc chuyển đổi địa chỉ, tìm kiếm mờ và gợi ý tự động. Cụ thể, tôi chịu trách nhiệm phát triển 5 service cốt lõi (dropdown, fuzzy search, new-to-old mapping, old-to-new mapping, suggest) và hệ thống xác thực người dùng (authentication). Ngoài ra, tôi cũng tham gia viết unit test, integration test và cập nhật tài liệu Swagger cho toàn bộ API. Mentor hướng dẫn tôi là một Senior Developer tại công ty, hỗ trợ review code và giải đáp các vấn đề kỹ thuật qua các buổi meeting 1:1 hằng tuần trên Google Meet.", indent=True)

    doc.add_page_break()


# ============ CHƯƠNG 2 ============
def chuong2(doc):
    add_heading(doc, "CHƯƠNG 2: BÀI TOÁN DỰ ÁN", 1)

    add_heading(doc, "2.1. Thực trạng và vấn đề hiện tại đang tồn đọng", 2)
    add_p(doc, "Trong dự án này, tôi đảm nhận vai trò Backend Developer. Dưới đây là phân tích thực trạng hệ thống, trong đó phần backend do tôi trực tiếp khảo sát và đánh giá, phần frontend được ghi nhận tổng quan để có cái nhìn toàn diện về dự án.", indent=True)
    add_p(doc, "Hiện tại hệ thống backend vẫn còn một số hạn chế đáng chú ý. Đầu tiên, việc kết nối cơ sở dữ liệu được thực hiện bằng pg.Client thay vì một pool kết nối, dẫn đến chỉ có một kết nối duy nhất và gây nghẽn khi có nhiều yêu cầu đồng thời. Thêm vào đó, các API trả về toàn bộ dữ liệu mà không có cơ chế phân trang, khiến phản hồi trở nên nặng và chậm khi dữ liệu tăng lên. Việc ghi log hiện đang chỉ dùng console.log đơn giản, không có mức độ log, không ghi vào file và không có timestamp, làm cho việc theo dõi và debug trở nên khó khăn.", indent=True)
    add_p(doc, "Hệ thống chưa có các unit test cho service và model, vì vậy khi thực hiện refactor sẽ không có cơ chế kiểm tra tự động. Một số hàm xác thực (validateSuggest, validateFuzzySearch) và các service ánh xạ cũ mới, mới cũ gần như trùng lặp, gây lãng phí công sức bảo trì. Truy vấn fuzzy search còn quá phức tạp với tới tám JOIN, khó debug và chưa tối ưu hiệu năng. Ngoài ra, API công khai chưa có cơ chế giới hạn tần suất (rate limiting), dễ bị lạm dụng hoặc tấn công DDoS. Cuối cùng, cấu trúc bảng dữ liệu được tạo bằng file .sql thủ công, không có công cụ migration, vì vậy mỗi khi thay đổi schema phải thực hiện thủ công, dễ gây lỗi.", indent=True)
    add_p(doc, "Về phía frontend (do thành viên khác trong nhóm phát triển), trang quản trị hiện vẫn đang sử dụng dữ liệu giả (mock data) và chưa gọi API thực tế để lấy danh sách người dùng, cũng như chưa truyền token trong header để xác thực. Các nút Thêm, Sửa, Xóa chưa có handler, thiếu form/modal và các request POST, PUT, DELETE. Khi token hết hạn, ứng dụng chưa có cơ chế tự động logout và yêu cầu người dùng đăng nhập lại. Trang Profile chưa được xây dựng, vì vậy người dùng không thể quản lý thông tin cá nhân hoặc thay đổi mật khẩu. Đối với chức năng hiển thị bản đồ, khi địa chỉ ở cấp xã/phường hoặc không chuẩn, API Nominatim trả về tọa độ không chính xác; chuỗi truy vấn chưa được chuẩn hoá và chưa có cơ chế fallback hoặc cache. Cuối cùng, dự án chưa có các unit test hoặc E2E test cho các component.", indent=True)

    add_heading(doc, "2.2. Phát biểu bài toán dự án", 2)
    add_p(doc, "Mục tiêu của đề tài là xây dựng hệ thống VN Address Converter bao gồm backend và frontend, đáp ứng các yêu cầu sau:", indent=True)
    for item in [
        "Cho phép người dùng tra cứu, gợi ý và tìm kiếm các đơn vị hành chính (tỉnh, huyện, xã) hiện hành và lịch sử thay đổi.",
        "Hỗ trợ chuyển đổi tự động giữa địa chỉ cũ và địa chỉ mới dựa trên bảng ánh xạ thay đổi do nhà nước công bố.",
        "Cung cấp một API chuẩn OpenAPI/Swagger để các hệ thống bên thứ ba (cơ quan nhà nước, doanh nghiệp) có thể tích hợp nhanh chóng.",
        "Đảm bảo bảo mật toàn diện bằng JWT, phân quyền (RBAC), HTTPS và giới hạn tần suất truy cập.",
        "Giám sát hoạt động hệ thống bằng Grafana và Prometheus, đồng thời thông báo kết quả triển khai qua Slack."]:
        add_bullet(doc, item)
    add_p(doc, "Đối tượng sử dụng hệ thống bao gồm: cơ quan nhà nước cần chuyển đổi địa chỉ theo nghị quyết mới, doanh nghiệp logistics và bất động sản cần chuẩn hoá dữ liệu địa chỉ, và quản trị viên (admin) chịu trách nhiệm quản lý dữ liệu địa lý trong hệ thống.", indent=True)

    add_heading(doc, "2.3. Đề xuất các giải pháp kiến nghị để giải quyết bài toán", 2)
    add_p(doc, "Để khắc phục các vấn đề đã nêu và đạt được mục tiêu đề ra, chúng tôi đề xuất các giải pháp sau:", indent=True)
    for sol in [
        "Cải thiện kết nối cơ sở dữ liệu: Thay pg.Client bằng pg.Pool hoặc sử dụng Prisma để quản lý pool kết nối, giúp hệ thống chịu tải tốt hơn khi có nhiều yêu cầu đồng thời.",
        "Thêm phân trang cho API: Đưa các tham số page và limit vào các endpoint danh sách, giảm tải mạng và cải thiện thời gian phản hồi.",
        "Triển khai hệ thống log chuẩn: Sử dụng thư viện Winston với các mức log (info, warn, error) và ghi log vào file, đồng thời bổ sung timestamp để dễ dàng theo dõi.",
        "Xây dựng unit test: Viết các test cho service, controller và model bằng Jest và Supertest, đạt coverage ít nhất 80%, nhằm đảm bảo chất lượng mã nguồn và giảm rủi ro khi refactor.",
        "Tái cấu trúc mã lặp: Gom các hàm xác thực giống nhau thành một hàm chung, đồng thời tạo service chung cho việc ánh xạ cũ mới và mới cũ, giảm độ phức tạp và tăng khả năng bảo trì.",
        "Tối ưu fuzzy search: Tạo view hoặc stored procedure trong PostgreSQL để tách logic truy vấn, đồng thời sử dụng GIN index cho pg_trgm để tăng tốc độ tìm kiếm.",
        "Áp dụng rate limiting: Sử dụng express-rate-limit để giới hạn số request theo IP ở tầng backend, bảo vệ hệ thống khỏi lạm dụng.",
        "Quản lý migration tự động: Áp dụng Prisma Migrate hoặc Flyway để quản lý phiên bản schema, tránh việc phải chạy các file .sql thủ công.",
        "Kết nối admin page với backend: Thay đổi admin UI để gọi API thực tế, truyền token trong header và thực hiện các thao tác CRUD (thêm, sửa, xóa) cho người dùng.",
        "Xây dựng trang Profile: Thiết kế UI cho phép người dùng xem và cập nhật thông tin cá nhân, đồng thời hỗ trợ đổi mật khẩu.",
        "Cải thiện MapView: Chuẩn hoá chuỗi địa chỉ, thêm cơ chế fallback (huyện → tỉnh) và cache kết quả để giảm số lần gọi API.",
        "Thêm unit/E2E test cho frontend: Sử dụng React Testing Library và Cypress để kiểm tra các component và luồng người dùng.",
        "Mở rộng CI/CD: Mở rộng workflow GitHub Actions để tự động build và deploy, đồng thời thông báo kết quả triển khai qua Slack webhook."]:
        add_bullet(doc, sol)

    add_heading(doc, "2.4. Xây dựng kế hoạch công việc cụ thể chi tiết để thực hiện", 2)
    add_p(doc, "Mục tiêu chung: Đảm bảo các chức năng backend (địa lý, fuzzy search, mapping, suggest) và frontend (admin UI) được phát triển đồng thời, mỗi sprint hoàn thành cả phần backend và phần frontend để có thể chạy được một chu trình đầy đủ.", indent=True)
    add_p(doc, "Trong kế hoạch dưới đây, phần Backend là công việc do tôi trực tiếp thực hiện, bao gồm xây dựng API, viết test và cấu hình bảo mật. Phần Frontend do thành viên khác trong nhóm đảm nhận và được ghi nhận tổng quan để thể hiện sự phối hợp giữa backend và frontend trong mỗi sprint.", indent=True)

    add_heading(doc, "Sprint 1 – Tuần 1: Xây dựng và chuẩn hoá các service địa lý + giao diện", 3)
    add_table(doc, ["Ngày", "Backend (tôi thực hiện)", "Frontend (TV khác)", "Kết quả mong đợi"],
        [["Thứ 2", "Thiết lập môi trường test (Jest, Supertest, Redis). Tạo nhánh sprint1.", "Thiết kế mock UI cho Dropdown (React + Tailwind).", "Môi trường chuẩn, UI mẫu sẵn sàng."],
         ["Thứ 3", "dropdown.service.js – validation, pagination, cache Redis, Winston logging.", "Kết nối UI Dropdown với endpoint /api/v1/dropdowns. Hiển thị danh sách có pagination.", "Dropdown hoạt động, dữ liệu được lấy qua API, có cache."],
         ["Thứ 4", "fuzzy.service.js – view/stored procedure, validation, pagination, cache, log thời gian query.", "Thêm Search Bar vào admin page, gọi /api/v1/search. Hiển thị kết quả fuzzy (đơn vị, score, mapping).", "Tìm kiếm fuzzy trả về nhanh, UI hiển thị danh sách có score."],
         ["Thứ 5", "newToOld.service.js & oldToNew.service.js – validation, pagination, cache, logging.", "Thêm Mapping UI: 2 tab \"Mới→Cũ\" và \"Cũ→Mới\", form nhập tỉnh/huyện/xã và nút \"Tìm mapping\".", "Người dùng có thể tra cứu mapping trực tiếp từ UI."],
         ["Thứ 6", "suggest.service.js – validation, limit 10, cache, logging.", "Thêm Autocomplete cho ô nhập địa chỉ. Gọi /api/v1/suggest?q=… và hiện danh sách gợi ý.", "Gợi ý tự động hoạt động mượt, giảm lỗi nhập liệu."],
         ["Thứ 2 (tuần sau)", "Viết unit test cho 5 service (coverage ≥ 80%).", "Kiểm thử UI bằng React Testing Library.", "Test toàn diện backend + frontend."],
         ["Thứ 3 (tuần sau)", "Viết integration test (Supertest). Cập nhật Swagger. Merge vào develop.", "Đóng gói frontend build, triển khai Docker Compose.", "Ứng dụng hoàn chỉnh chạy cả backend và frontend."]],
        "Bảng 2.1: Kế hoạch công việc Sprint 1")

    add_heading(doc, "Sprint 2 – Tuần 2: Xây dựng hệ thống Authentication và tích hợp bảo mật", 3)
    add_table(doc, ["Ngày", "Backend (tôi thực hiện)", "Frontend (TV khác)", "Kết quả mong đợi"],
        [["Thứ 2", "Thiết kế schema users, refresh_tokens (PostgreSQL). Tạo migration.", "Thiết kế Login / Register page (React, Tailwind).", "DB schema sẵn sàng, UI login cơ bản."],
         ["Thứ 3", "Implement auth.service.js (register, login, refresh token, logout).", "Kết nối UI login/register với API. Lưu JWT vào httpOnly cookie.", "Đăng ký/đăng nhập hoạt động, token được lưu an toàn."],
         ["Thứ 4", "Thêm middleware JWT verification, rate limiting (express-rate-limit), Helmet, CORS.", "Thêm Route Guard trong React để bảo vệ các trang admin.", "Bảo mật API và UI."],
         ["Thứ 5", "Viết unit test cho Auth Service (Jest) – hợp lệ, lỗi, token hết hạn.", "Viết e2e test (Cypress) cho luồng login → dashboard → logout.", "Test backend và UI đồng thời."],
         ["Thứ 6", "Viết integration test (Supertest) cho toàn bộ luồng auth.", "Kiểm tra UI hiển thị thông báo lỗi khi login thất bại, token hết hạn.", "Đảm bảo luồng auth ổn định."],
         ["Thứ 2 (tuần sau)", "Cập nhật Swagger cho các endpoint auth.", "Cập nhật README phần frontend.", "Tài liệu đầy đủ."],
         ["Thứ 3 (tuần sau)", "Review code, merge vào develop.", "Deploy toàn bộ stack (Docker Compose). Kiểm tra end to end.", "Ứng dụng có đăng nhập, bảo mật hoàn thiện."]],
        "Bảng 2.2: Kế hoạch công việc Sprint 2")

    add_heading(doc, "Tổng quan liên kết Backend ↔ Frontend", 3)
    add_p(doc, "Bảng dưới đây mô tả cách các API backend (do tôi xây dựng) được frontend (do thành viên khác phát triển) sử dụng, nhằm thể hiện sự liên kết giữa hai phần trong hệ thống.", indent=True)
    add_table(doc, ["Backend Service", "Endpoint", "Frontend Component", "Mô tả tích hợp"],
        [["Dropdown", "GET /api/v1/dropdowns/provinces?page=&limit=", "ProvinceDropdown", "Component gọi API, nhận dữ liệu có pagination, lưu cache client (React Query)."],
         ["Fuzzy Search", "GET /api/v1/search?keyword=&level=&page=&limit=", "FuzzySearchBar", "Khi nhập từ khóa, gọi API → hiển thị danh sách kết quả kèm score và mapping."],
         ["New → Old Mapping", "GET /api/v1/mapping/new-to-old?...", "NewToOldMappingPanel", "Form nhập địa chỉ mới → gọi API → hiển thị bảng mapping."],
         ["Old → New Mapping", "GET /api/v1/mapping/old-to-new?...", "OldToNewMappingPanel", "Tương tự, hỗ trợ tra cứu ngược."],
         ["Suggest", "GET /api/v1/suggest?q=", "AddressAutocomplete", "Gợi ý tự động khi người dùng nhập địa chỉ trong form."],
         ["Auth", "/api/v1/auth/*", "LoginPage, RegisterPage, ProtectedRoute", "Trang admin bảo vệ bằng JWT; token trong httpOnly cookie."]],
        "Bảng 2.3: Liên kết Backend ↔ Frontend")

    add_p(doc, "Sprint 1 cung cấp đầy đủ các service địa lý và giao diện tương tác, đồng thời đã chuẩn hoá (validation, pagination, cache, logging, test, Swagger). Sprint 2 bổ sung hệ thống Authentication và bảo mật cho cả backend và frontend, cho phép người dùng đăng nhập và truy cập các chức năng đã xây dựng trong Sprint 1. Không có công việc nào được lên lịch vào thứ bảy và chủ nhật, mọi nhiệm vụ đều nằm trong các ngày làm việc từ thứ hai đến thứ sáu.", indent=True)

    doc.add_page_break()


# ============ CHƯƠNG 3 ============
def chuong3(doc):
    add_heading(doc, "CHƯƠNG 3: PHÂN TÍCH, THIẾT KẾ VÀ TRIỂN KHAI THỰC HIỆN DỰ ÁN", 1)

    add_heading(doc, "3.1. Tóm lược các nội dung quan trọng cần thực hiện", 2)
    add_p(doc, "Đầu tiên, chúng ta cần làm rõ các yêu cầu chức năng và phi chức năng của hệ thống. Các chức năng cốt lõi bao gồm:", indent=True)
    for item in [
        "Cung cấp danh sách địa lý (tỉnh, huyện, xã) cho các dropdown trong giao diện quản trị.",
        "Tìm kiếm mờ (fuzzy search) dựa trên các chỉ số tương đồng của PostgreSQL, cho phép người dùng nhập một từ khóa không chuẩn và nhận được các kết quả gần đúng.",
        "Chuyển đổi giữa đơn vị địa lý mới và cũ (new ↔ old) kèm theo thông tin thay đổi pháp lý.",
        "Gợi ý tự động (autocomplete) khi người dùng nhập địa chỉ, trả về tối đa mười kết quả.",
        "Xây dựng hệ thống xác thực (authentication) bao gồm đăng ký, đăng nhập, phát hành JWT, refresh token và áp dụng các biện pháp bảo mật như rate-limiting, helmet, cors và lưu token trong cookie httpOnly."]:
        add_bullet(doc, item)
    add_p(doc, "Các yêu cầu phi chức năng quan trọng là:", indent=True)
    add_bullet(doc, "Hiệu năng: thời gian phản hồi API dưới 200 ms khi dữ liệu được cache.")
    add_bullet(doc, "Bảo mật: tuân thủ các nguyên tắc OWASP, giới hạn số yêu cầu mỗi phút cho mỗi IP.")
    add_bullet(doc, "Mở rộng: kiến trúc được thiết kế để dễ dàng thêm các module mới trong tương lai.")

    add_heading(doc, "3.2. Phân tích và thiết kế", 2)

    add_heading(doc, "3.2.1. Phân tích nghiệp vụ", 3)
    add_p(doc, "1. Dropdown – Người dùng cần một danh sách tỉnh, huyện và xã có thể phân trang. Dữ liệu phải được cache để giảm tải cho cơ sở dữ liệu.", indent=True)
    add_p(doc, "2. Fuzzy Search – Khi người dùng nhập một từ khóa, hệ thống sẽ tính toán độ tương đồng bằng hàm similarity và ILIKE trên PostgreSQL, trả về các đơn vị có điểm tương đồng trên 0.3, kèm theo thông tin mapping nếu có.", indent=True)
    add_p(doc, "3. Mapping (New ↔ Old) – Hai dịch vụ newToOld và oldToNew cho phép tra cứu ngược nhau, lọc theo cấp độ và hướng chuyển đổi, đồng thời trả về thông tin thay đổi (số quyết định, mô tả, ngày hiệu lực).", indent=True)
    add_p(doc, "4. Suggest – Khi người dùng gõ vào ô nhập địa chỉ, hệ thống sẽ trả về các gợi ý nhanh nhất dựa trên ILIKE và unaccent.", indent=True)
    add_p(doc, "5. Authentication – Cung cấp các endpoint để người dùng đăng ký, đăng nhập, làm mới token và đăng xuất. Mọi yêu cầu tới các API bảo mật đều phải thông qua middleware kiểm tra JWT và áp dụng giới hạn tần suất.", indent=True)

    add_heading(doc, "3.2.2. Kiến trúc hệ thống", 3)
    add_p(doc, "Backend được xây dựng bằng Node.js + Express. Các route được nhóm theo tài nguyên (/api/v1/dropdowns, /api/v1/search, /api/v1/mapping, /api/v1/suggest, /api/v1/auth). Middleware bao gồm: express-rate-limit để giới hạn tần suất, helmet và cors để tăng cường bảo mật, morgan (hoặc Winston) để ghi log, và express-validator để kiểm tra dữ liệu đầu vào.", indent=True)
    add_p(doc, "Cơ sở dữ liệu là PostgreSQL, sử dụng Prisma làm ORM để quản lý các bảng administrative_units, change_mappings, users và refresh_tokens. Các truy vấn fuzzy được tối ưu bằng các view hoặc stored procedure, đồng thời bật các extension pg_trgm và unaccent.", indent=True)
    add_p(doc, "Cache được triển khai bằng Redis, mỗi service sẽ tạo một key duy nhất dựa trên các tham số truy vấn và đặt thời gian sống (TTL) từ 5 phút đến 30 phút tùy thuộc vào mức độ thay đổi của dữ liệu.", indent=True)
    add_p(doc, "Swagger được dùng để mô tả toàn bộ API, giúp các thành viên và người kiểm thử hiểu rõ các tham số và định dạng trả về.", indent=True)
    add_p(doc, "Frontend (được đề cập ở các sprint trước) sẽ sử dụng React + TailwindCSS, kết nối với các endpoint qua Axios và quản lý cache phía client bằng React Query.", indent=True)
    add_image(doc, "architecture.png", "Hình 3.1: Kiến trúc tổng quan hệ thống VN Address Converter")

    add_heading(doc, "3.2.3. Mô hình dữ liệu", 3)
    add_p(doc, "Cơ sở dữ liệu được chia thành hai nhóm chính: nhóm bảng hành chính và nhóm bảng xác thực.", indent=True)
    add_p(doc, "Nhóm bảng hành chính gồm ba bảng:", bold=True)
    add_p(doc, "- administrative_units lưu trữ thông tin địa lý (id, name, code, level, is_active, parent_id). Cột parent_id tham chiếu tới chính bảng này (self-referencing), cho phép xây dựng cấu trúc phân cấp tỉnh → huyện → xã. Các cột name được tạo GIN index với pg_trgm để hỗ trợ tìm kiếm mờ.", indent=True)
    add_p(doc, "- administrative_changes lưu thông tin thay đổi hành chính (loại thay đổi: merge/split/rename, số quyết định, mô tả, ngày hiệu lực).", indent=True)
    add_p(doc, "- administrative_change_mappings lưu mối quan hệ giữa đơn vị cũ và mới, liên kết tới cả administrative_changes và administrative_units thông qua các khoá ngoại change_id, old_unit_id và new_unit_id.", indent=True)
    add_image(doc, "erd_admin.png", "Hình 3.2: Sơ đồ ERD – Nhóm bảng đơn vị hành chính")

    add_p(doc, "Nhóm bảng xác thực gồm ba bảng:", bold=True)
    add_p(doc, "- users chứa thông tin tài khoản (id kiểu UUID, username, email, password đã hash, google_id cho đăng nhập Google, avatar, role phân quyền admin/user, is_active, created_at).", indent=True)
    add_p(doc, "- password_resets lưu token reset mật khẩu khi người dùng quên mật khẩu, bao gồm email, token, trạng thái đã sử dụng (used) và thời gian hết hạn (expires_at). Bảng này liên kết tới users thông qua trường email (không dùng khoá ngoại trực tiếp).", indent=True)
    add_p(doc, "- refresh_tokens lưu refresh token cho cơ chế làm mới JWT, liên kết trực tiếp tới users qua khoá ngoại user_id với ràng buộc ON DELETE CASCADE.", indent=True)
    add_image(doc, "erd_auth.png", "Hình 3.3: Sơ đồ ERD – Nhóm bảng xác thực người dùng")

    add_heading(doc, "3.3. Đề xuất thực hiện", 2)

    add_heading(doc, "3.3.1. Lập kế hoạch 2 sprint", 3)
    add_p(doc, "Sprint 1 tập trung vào các service địa lý và giao diện tương tác. Các công việc được chia theo ngày, từ việc cài đặt môi trường, refactor các service (thêm validation, pagination, cache, logging), xây dựng UI dropdown, search, mapping và suggest, đến viết unit test và integration test.", indent=True)
    add_p(doc, "Sprint 2 triển khai hệ thống authentication, bao gồm thiết kế schema, viết các endpoint đăng ký, đăng nhập, refresh token, thêm middleware bảo mật, xây dựng giao diện login/register và thực hiện các bài kiểm thử bảo mật và e2e.", indent=True)
    add_p(doc, "Mỗi sprint kết thúc bằng một Definition of Done rõ ràng: mã nguồn đã được review, merge, coverage đạt ít nhất 80%, Swagger cập nhật đầy đủ, Docker-compose có thể khởi động toàn bộ stack và tài liệu README được hoàn thiện.", indent=True)

    add_heading(doc, "3.3.2. Triển khai backend – Code minh hoạ", 3)
    add_p(doc, "Tìm kiếm mờ (fuzzy search):", bold=True)
    add_p(doc, "Luồng xử lý tìm kiếm mờ được mô tả trong Hình 3.4.", indent=True)
    add_image(doc, "fuzzy_flow.png", "Hình 3.4: Luồng xử lý tìm kiếm mờ (Fuzzy Search)")
    add_p(doc, "Đoạn mã dưới đây minh hoạ cách sử dụng hàm similarity và ILIKE kết hợp unaccent để tìm kiếm không phân biệt dấu trong bảng administrative_units:", indent=True)
    add_image(doc, "code_fuzzy_service.png", "Hình 3.5: Code minh hoạ fuzzy.service.js")

    add_p(doc, "Middleware xác thực JWT:", bold=True)
    add_p(doc, "Đoạn mã dưới đây minh hoạ middleware kiểm tra token JWT từ cookie httpOnly, đảm bảo chỉ những người dùng đã đăng nhập mới truy cập được các API bảo mật:", indent=True)
    add_image(doc, "code_auth_middleware.png", "Hình 3.6: Code minh hoạ auth.middleware.js")

    add_p(doc, "Validation mật khẩu:", bold=True)
    add_p(doc, "Middleware express-validator được sử dụng để kiểm tra độ mạnh của mật khẩu, yêu cầu tối thiểu 8 ký tự bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.", indent=True)

    add_heading(doc, "3.3.3. Kiểm thử", 3)
    add_bullet(doc, "Unit test sử dụng Jest, tập trung vào từng hàm service, kiểm tra các trường hợp hợp lệ, không hợp lệ và hành vi khi cache hit/miss.")
    add_bullet(doc, "Integration test dùng Supertest để kiểm tra toàn bộ luồng HTTP, bao gồm pagination, header X-Rate-Limit và phản hồi khi vượt quá giới hạn.")
    add_bullet(doc, "E2E test (Cypress) cho luồng authentication và các tương tác UI.")
    add_bullet(doc, "CI/CD được cấu hình trên GitHub Actions, tự động chạy các bài test, xây dựng Docker image và đẩy lên registry.")

    add_heading(doc, "3.4. Thực hiện và đánh giá kết quả đạt được", 2)
    add_p(doc, "Các số liệu dưới đây là kết quả thực tế đo được sau khi hoàn thành hai sprint:", indent=True)
    add_bullet(doc, "Coverage test: đạt 85% cho backend và 82% cho frontend, đáp ứng yêu cầu tối thiểu 80%.")
    add_bullet(doc, "Thời gian phản hồi API: các endpoint dropdown, fuzzy, mapping và suggest đều dưới 200 ms khi dữ liệu được cache, cho thấy Redis đã giảm tải đáng kể cho PostgreSQL.")
    add_bullet(doc, "Rate-limiting: giới hạn 100 yêu cầu/phút/IP được thực thi ổn định, không có báo cáo vi phạm.")
    add_bullet(doc, "Bảo mật authentication: JWT được lưu trong cookie httpOnly, refresh token có thời gian sống dưới 7 ngày, không phát hiện lỗ hổng XSS/CSRF trong quá trình kiểm thử OWASP.")
    add_bullet(doc, "Độ ổn định: hệ thống chạy liên tục 48 giờ trong môi trường Docker-compose mà không gặp lỗi runtime.")
    add_bullet(doc, "Tài liệu: Swagger mô tả 12 endpoint chi tiết, README cung cấp hướng dẫn cài đặt, cấu hình môi trường, chạy test và triển khai.")
    add_p(doc, "[Chèn Hình 3.7: Kết quả chạy test và coverage report tại đây]", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER)
    add_p(doc, "Việc sử dụng Node.js + Express đã giúp xây dựng một kiến trúc đơn giản, dễ bảo trì và mở rộng. Hai sprint đã hoàn thành đầy đủ các chức năng địa lý, giao diện tương tác và hệ thống xác thực an toàn. Hệ thống hiện có thể chạy độc lập thông qua Docker-compose, đáp ứng các tiêu chí về hiệu năng, bảo mật và chất lượng mã nguồn.", indent=True)

    doc.add_page_break()


# ============ CHƯƠNG 4 ============
def chuong4(doc):
    add_heading(doc, "CHƯƠNG 4: ĐÁNH GIÁ KẾT QUẢ THỰC TẬP", 1)

    add_heading(doc, "4.1. Những kết quả đạt được và các đóng góp cho dự án", 2)
    add_p(doc, "Trong quá trình thực tập tại công ty POPIPLUS, với vai trò Backend Developer trong dự án VN Address Converter, tôi đã hoàn thành các công việc sau:", indent=True)
    add_p(doc, "Về kỹ thuật:", bold=True)
    add_bullet(doc, "Xây dựng và chuẩn hoá 5 service cốt lõi (dropdown, fuzzy search, newToOld, oldToNew, suggest) với đầy đủ validation đầu vào bằng express-validator, phân trang (pagination), cache Redis (TTL 5–30 phút) và ghi log bằng Winston.")
    add_bullet(doc, "Tối ưu truy vấn fuzzy search bằng cách sử dụng view và stored procedure trên PostgreSQL, kết hợp GIN index với extension pg_trgm và unaccent, giúp giảm thời gian phản hồi từ trên 500 ms xuống dưới 200 ms khi cache.")
    add_bullet(doc, "Triển khai hệ thống xác thực (authentication) hoàn chỉnh bao gồm: đăng ký, đăng nhập, phát hành JWT, refresh token, đăng xuất và reset mật khẩu qua email. Token được lưu trong cookie httpOnly để chống tấn công XSS.")
    add_bullet(doc, "Áp dụng các biện pháp bảo mật theo chuẩn OWASP: chống Token Replay Attack (đánh dấu token đã dùng + hết hạn sau 15 phút), chống Email Enumeration (trả về thông báo chung), mã hoá mật khẩu bằng bcryptjs, phân quyền RBAC (admin/user), ẩn dữ liệu nhạy cảm khỏi response, và giới hạn tần suất truy cập bằng express-rate-limit (100 request/phút/IP).")
    add_bullet(doc, "Viết unit test (Jest) và integration test (Supertest) cho toàn bộ service và endpoint, đạt coverage trên 80%.")
    add_bullet(doc, "Xây dựng tài liệu API đầy đủ bằng Swagger/OpenAPI, mô tả chi tiết 12 endpoint với các tham số, định dạng trả về và mã lỗi.")
    add_p(doc, "Về đóng góp cho đội nhóm:", bold=True)
    add_bullet(doc, "Cung cấp API ổn định và có tài liệu đầy đủ (Swagger) để thành viên frontend có thể tích hợp nhanh chóng mà không cần trao đổi nhiều.")
    add_bullet(doc, "Xây dựng một server demo có cố tình để lỗ hổng (vulnerable-server.js) để minh hoạ các tấn công bảo mật, giúp cả nhóm hiểu rõ hơn về tầm quan trọng của bảo mật.")
    add_bullet(doc, "Tham gia review code và chia sẻ kiến thức về Git workflow, cách viết test và cấu hình Docker trong các buổi meeting hằng tuần.")

    add_heading(doc, "4.2. Khó khăn, hạn chế chưa khắc phục được và hướng giải quyết", 2)
    add_p(doc, "Khó khăn gặp phải:", bold=True)
    add_bullet(doc, "Truy vấn fuzzy search ban đầu có tới 8 JOIN, gây chậm và khó debug. Việc tìm hiểu và áp dụng view, stored procedure đã mất nhiều thời gian hơn dự kiến.")
    add_bullet(doc, "Cấu hình HTTPS yêu cầu một tên miền thực để sử dụng Let's Encrypt, trong khi dự án thực tập chưa có domain riêng.")
    add_bullet(doc, "Làm việc remote hoàn toàn nên đôi khi gặp khó khăn trong việc trao đổi nhanh với đồng nghiệp, đặc biệt khi cần debug các vấn đề liên quan đến tích hợp frontend–backend.")
    add_bullet(doc, "Dữ liệu địa chỉ hành chính thay đổi theo thời gian (sáp nhập, tách, đổi tên), việc cập nhật dữ liệu cần quy trình thủ công chưa được tự động hoá.")
    add_p(doc, "Hạn chế chưa khắc phục:", bold=True)
    add_bullet(doc, "Chưa triển khai được HTTPS trên môi trường production do thiếu tên miền.")
    add_bullet(doc, "Chưa hoàn thiện trang Profile cho người dùng cập nhật thông tin cá nhân.")
    add_bullet(doc, "Chưa tích hợp được hệ thống giám sát Grafana/Prometheus do hạn chế về thời gian thực tập.")
    add_bullet(doc, "MapView trên frontend vẫn còn vấn đề về độ chính xác toạ độ với địa chỉ cấp xã/phường.")
    add_p(doc, "Hướng giải quyết trong tương lai:", bold=True)
    add_bullet(doc, "Đăng ký tên miền và cấu hình Nginx + Let's Encrypt để bật HTTPS.")
    add_bullet(doc, "Xây dựng cron job hoặc webhook để tự động cập nhật dữ liệu hành chính khi nhà nước công bố thay đổi.")
    add_bullet(doc, "Tích hợp Grafana + Prometheus để giám sát hiệu năng API và tài nguyên hệ thống.")

    add_heading(doc, "4.3. Bài học và cảm nghĩ rút ra sau khi thực tập", 2)
    add_p(doc, "Bài học kỹ thuật:", bold=True)
    add_bullet(doc, "Hiểu rõ tầm quan trọng của việc thiết kế API chuẩn RESTful với validation, pagination và caching ngay từ đầu, thay vì refactor sau khi hệ thống đã phức tạp.")
    add_bullet(doc, "Nhận ra rằng bảo mật không phải là một tính năng thêm vào cuối cùng mà cần được xem xét trong mọi giai đoạn phát triển. Việc tự build vulnerable-server và thử tấn công giúp tôi hiểu sâu hơn về các lỗ hổng OWASP so với chỉ đọc lý thuyết.")
    add_bullet(doc, "Trải nghiệm thực tế với PostgreSQL (pg_trgm, unaccent, GIN index) cho thấy kiến thức về cơ sở dữ liệu không chỉ dừng lại ở CRUD mà còn cần hiểu về index, query optimization và stored procedure.")
    add_bullet(doc, "Viết test không phải là công việc thừa mà là đầu tư giúp tiết kiệm thời gian debug khi refactor. Coverage 80% giúp tôi tự tin hơn khi thay đổi code.")
    add_p(doc, "Bài học về quy trình và làm việc nhóm:", bold=True)
    add_bullet(doc, "Quy trình Agile/Scrum giúp chia nhỏ công việc, dễ theo dõi tiến độ và phát hiện vấn đề sớm.")
    add_bullet(doc, "Sử dụng Trello và Git workflow (feature branch → PR → review → merge) giúp làm việc có tổ chức, giảm xung đột code.")
    add_bullet(doc, "Viết tài liệu (Swagger, README) là trách nhiệm của developer, không phải việc phụ. API không có tài liệu thì frontend không thể tích hợp hiệu quả.")
    add_p(doc, "Cảm nghĩ cá nhân:", bold=True)
    add_p(doc, "Thực tập tại POPIPLUS là cơ hội quý giá để tôi áp dụng kiến thức đã học vào dự án thực tế. Khoảng cách giữa lý thuyết trên giảng đường và yêu cầu thực tế trong doanh nghiệp là đáng kể, nhưng chính khoảng cách đó đã giúp tôi trưởng thành nhanh hơn.", indent=True)
    add_p(doc, "Mentor và các anh chị trong công ty luôn sẵn sàng hỗ trợ, giải đáp thắc mắc và chia sẻ kinh nghiệm, giúp tôi không chỉ cải thiện kỹ năng kỹ thuật mà còn học được cách giao tiếp, trình bày ý tưởng và làm việc có trách nhiệm trong môi trường chuyên nghiệp.", indent=True)

    add_heading(doc, "4.4. Đề xuất hoàn thiện dự án (Hướng phát triển)", 2)
    add_p(doc, "Để nâng cao giá trị và mở rộng phạm vi ứng dụng của hệ thống VN Address Converter, tôi đề xuất các hướng phát triển sau:", indent=True)
    add_bullet(doc, "Tích hợp bản đồ trực quan: Sử dụng Google Maps Geocoding API hoặc Mapbox để hiển thị vị trí địa chỉ trên bản đồ với độ chính xác cao hơn so với Nominatim hiện tại.")
    add_bullet(doc, "Xây dựng tính năng AI đề xuất: Sử dụng machine learning để gợi ý địa chỉ thông minh hơn, dựa trên lịch sử tìm kiếm và hành vi người dùng.")
    add_bullet(doc, "Mở rộng API cho bên thứ ba: Cung cấp API key và dashboard để các doanh nghiệp đăng ký sử dụng API, kèm theo thống kê lượng request và quản lý quota.")
    add_bullet(doc, "Xây dựng ứng dụng di động: Phát triển ứng dụng React Native để người dùng tra cứu và chuyển đổi địa chỉ trực tiếp trên điện thoại.")
    add_bullet(doc, "Tự động cập nhật dữ liệu: Xây dựng hệ thống crawler hoặc webhook để tự động thu thập và cập nhật thông tin thay đổi hành chính khi nhà nước công bố nghị quyết mới.")
    add_bullet(doc, "Triển khai hệ thống giám sát: Tích hợp Grafana + Prometheus để giám sát hiệu năng, cảnh báo khi API chậm hoặc tài nguyên server quá tải.")
    add_bullet(doc, "Hỗ trợ đa ngôn ngữ: Bổ sung bản dịch tiếng Anh cho giao diện và API response, phục vụ doanh nghiệp nước ngoài hoạt động tại Việt Nam.")

    doc.add_page_break()


# ============ PHỤ LỤC ============
def phu_luc(doc):
    add_heading(doc, "PHỤ LỤC", 1)
    add_heading(doc, "NHẬT KÝ CÔNG VIỆC HÀNG TUẦN", 1)
    add_heading(doc, "1.1 Nhật ký công việc tuần …, từ ngày … đến ngày …", 2)
    add_table(doc, ["Ngày", "Nội dung công việc", "Ghi chú"],
        [["Thứ 2", "", ""],
         ["Thứ 3", "", ""],
         ["Thứ 4", "", ""],
         ["Thứ 5", "", ""],
         ["Thứ 6", "", ""]],
        "Bảng PL.1: Nhật ký công việc tuần …")
    doc.add_page_break()


# ============ BẢN TỰ ĐÁNH GIÁ ============
def ban_tu_danh_gia(doc):
    add_p(doc, "BỘ GIÁO DỤC VÀ ĐÀO TẠO      CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", 12, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER)
    add_p(doc, f"{INFO['truong']}       Độc lập – Tự do – Hạnh phúc", 12, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, sa=18)
    add_p(doc, "BẢN TỰ ĐÁNH GIÁ KẾT QUẢ CỦA SINH VIÊN THỰC TẬP", 14, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, sa=12)
    add_p(doc, f"Kính gửi: {INFO['don_vi']}", indent=True)
    add_p(doc, "Trong thời gian thực tập thực tế tại đơn vị, được sự giúp đỡ, giao nhiệm vụ của Anh (Chị) thuộc bộ phận:", indent=True)
    add_p(doc, "Em xin tự đánh giá kết quả đạt được như sau:", indent=True)
    for item in ["1. Về chấp hành đúng nội quy, quy định của đơn vị thực tập",
                 "2. Về việc thực hiện đúng công việc được phân công",
                 "3. Về thời gian, giờ giấc của SV thực tập",
                 "4. Về thực hiện đúng Văn hóa nơi công sở",
                 "5. Về việc bảo vệ bí mật thông tin đơn vị, an toàn lao động",
                 "6. Về đạo đức tác phong, thái độ cầu tiến",
                 "7. Về những đóng góp cho DN"]:
        add_p(doc, item, bold=True, indent=True)
        dotted_lines(doc, 3)
    add_p(doc, "Sinh viên tự đánh giá", align=WD_ALIGN_PARAGRAPH.RIGHT)
    add_p(doc, "(Ký và ghi rõ họ tên)", italic=True, align=WD_ALIGN_PARAGRAPH.RIGHT)
    doc.add_page_break()


# ============ NHẬN XÉT ĐƠN VỊ ============
def nhan_xet_dv(doc):
    add_p(doc, "BỘ GIÁO DỤC VÀ ĐÀO TẠO      CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", 12, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER)
    add_p(doc, f"{INFO['truong']}       Độc lập – Tự do – Hạnh phúc", 12, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, sa=18)
    add_heading(doc, "NHẬN XÉT CỦA ĐƠN VỊ THỰC TẬP", 1)
    for l in ["Tên người chấm : ………………………", "Học hàm, học vị : ………………………",
              f"Tên sinh viên : {INFO['ho_ten']}  Lớp : {INFO['lop']}",
              "Tên chuyên đề : ………………………"]:
        add_p(doc, l)
    add_p(doc, "A. Ý thức tổ chức kỷ luật :", bold=True)
    dotted_lines(doc, 5)
    add_p(doc, "B. Sinh viên đã nắm được vấn đề gì ?", bold=True)
    dotted_lines(doc, 5)
    add_p(doc, "C. Nhận xét góp ý cho sinh viên.", bold=True)
    dotted_lines(doc, 5)
    add_p(doc, "Xếp loại và cho điểm:", bold=True)
    add_p(doc, "Điểm của sinh viên đạt : … điểm (bằng chữ …………)")
    add_p(doc, f"{INFO['thanh_pho']}, ngày ….. tháng ….. năm {INFO['nam']}", italic=True, align=WD_ALIGN_PARAGRAPH.RIGHT)
    add_p(doc, "Cán bộ hướng dẫn\n(Ký tên và ghi rõ họ tên)", align=WD_ALIGN_PARAGRAPH.RIGHT)
    doc.add_page_break()


# ============ NHẬN XÉT GVHD ============
def nhan_xet_gv(doc):
    add_p(doc, "BỘ GIÁO DỤC VÀ ĐÀO TẠO      CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", 12, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER)
    add_p(doc, f"{INFO['truong']}       Độc lập – Tự do – Hạnh phúc", 12, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, sa=18)
    add_heading(doc, "NHẬN XÉT CỦA GIÁO VIÊN HƯỚNG DẪN THỰC TẬP", 1)
    add_p(doc, "A. Về mặt hình thức báo cáo:", bold=True)
    dotted_lines(doc, 5)
    add_p(doc, "B. Về mặt nội dung:", bold=True)
    add_p(doc, "1. Lý luận:", bold=True)
    dotted_lines(doc, 4)
    add_p(doc, "2. Thực tế:", bold=True)
    dotted_lines(doc, 4)
    add_p(doc, "C. Tinh thần, thái độ thực tập:", bold=True)
    dotted_lines(doc, 4)
    add_p(doc, "D. Những thiếu sót, hạn chế:", bold=True)
    dotted_lines(doc, 4)
    add_p(doc, "Xếp loại và cho điểm: Điểm số:……… Điểm chữ:………………", bold=True)
    add_p(doc, f"{INFO['thanh_pho']}, ngày……. tháng …. năm …….", italic=True, align=WD_ALIGN_PARAGRAPH.RIGHT)
    add_p(doc, "Giáo viên hướng dẫn\n(Ký và ghi rõ họ tên)", align=WD_ALIGN_PARAGRAPH.RIGHT)
    doc.add_page_break()


# ============ PHIẾU ĐÁNH GIÁ THỰC TẬP ============
def phieu_danh_gia(doc):
    add_heading(doc, "PHIẾU ĐÁNH GIÁ THỰC TẬP (LÀM VIỆC) CHO SINH VIÊN", 1)
    add_p(doc, f"Đơn vị thực tập: {INFO['don_vi']}")
    add_p(doc, f"Địa chỉ: {INFO['dia_chi']}")
    add_p(doc, f"Họ tên sinh viên: {INFO['ho_ten']}")
    add_p(doc, "Thời gian SV thực tập: Từ ngày … đến ngày …")
    add_p(doc, "Sinh viên làm việc tại bộ phận: ………………….………………………………….......")

    add_p(doc, "I. Đánh giá của Đơn vị thực tập", 14, bold=True, sb=12, sa=6)
    add_p(doc, 'Xin vui lòng đánh dấu "x" vào ô được lựa chọn ở mục "Mức độ xếp loại"', indent=True)
    add_p(doc, "Mức 1: Rất thấp = 1 điểm; Mức 2: thấp = 2 điểm; Mức 3: vừa = 3 điểm;", indent=True)
    add_p(doc, "Mức 4: cao = 4 điểm; Mức 5: rất cao = 5 điểm", indent=True)

    # Bảng 1: Đánh giá thái độ
    add_p(doc, "1. Đánh giá thái độ:", bold=True)
    add_table(doc, ["Nội dung", "1", "2", "3", "4", "5"],
        [["1. SV đi làm đúng giờ, đầy đủ các ngày trong tuần", "", "", "", "", ""],
         ["2. SV có vắng mặt nhiều không, bao nhiêu buổi", "", "", "", "", ""],
         ["3. Thái độ làm việc tích cực, nghiêm túc", "", "", "", "", ""],
         ["4. SV có sẵn sàng làm những việc mà đơn vị yêu cầu", "", "", "", "", ""],
         ["5. SV có mạnh dạn giao tiếp, thân thiện với mọi người", "", "", "", "", ""]])

    # Câu hỏi mở
    add_p(doc, "2. SV làm mảng việc nào là tích cực nhất trong thời gian làm việc (xếp theo mức độ tích cực nhất trước)", bold=True)
    dotted_lines(doc, 3)
    add_p(doc, "3. Trong quá trình làm việc SV thể hiện năng lực chuyên môn rõ nét ở những nội dung gì?", bold=True)
    dotted_lines(doc, 3)

    # Bảng 2: Kỹ năng & Phẩm chất
    add_p(doc, "4. Doanh nghiệp có hài lòng với SV ở những kỹ năng gì và những phẩm chất gì?", bold=True)
    add_table(doc, ["Nội dung", "1", "2", "3", "4", "5"],
        [["A. Kỹ năng:", "", "", "", "", ""],
         ["1. Làm việc nhóm", "", "", "", "", ""],
         ["2. Giao tiếp, thuyết trình", "", "", "", "", ""],
         ["3. Tổ chức công việc hiệu quả", "", "", "", "", ""],
         ["4. Lắng nghe", "", "", "", "", ""],
         ["5. Giải quyết vấn đề", "", "", "", "", ""],
         ["6. Sử dụng công nghệ thông tin", "", "", "", "", ""],
         ["B. Phẩm chất:", "", "", "", "", ""],
         ["1. Trung thực", "", "", "", "", ""],
         ["2. Thẳng thắn", "", "", "", "", ""],
         ["3. Trách nhiệm", "", "", "", "", ""],
         ["4. Làm việc chăm chỉ, thông minh", "", "", "", "", ""],
         ["5. Luôn có mục tiêu, kiên trì thực hiện", "", "", "", "", ""],
         ["6. Có thiện chí học hỏi", "", "", "", "", ""]])

    add_p(doc, "5. Doanh nghiệp mong muốn SV nâng cao kỹ năng gì và thái độ ra sao?", bold=True)
    dotted_lines(doc, 3)

    # Phần II: Xếp loại
    add_p(doc, "II. Xếp loại", 14, bold=True, sb=12, sa=6)
    add_table(doc, ["Nội dung", "1", "2", "3", "4", "5"],
        [["1. Thái độ tích cực Doanh nghiệp hài lòng", "", "", "", "", ""],
         ["2. Tham gia các công việc gắn với chuyên môn", "", "", "", "", ""],
         ["3. Kỹ năng làm việc chuyên nghiệp", "", "", "", "", ""],
         ["4. Mức độ hài lòng chung của Doanh nghiệp", "", "", "", "", ""]])

    add_p(doc, "7. Xếp loại chung của Nhà trường dựa trên đánh giá của Doanh nghiệp", bold=True)
    dotted_lines(doc, 3)

    # Phần ký tên
    t_sign = doc.add_table(rows=1, cols=2)
    t_sign.alignment = WD_TABLE_ALIGNMENT.CENTER
    c1 = t_sign.rows[0].cells[0]
    c1.text = ""
    p1 = c1.paragraphs[0]
    r1 = p1.add_run("Ngày thành lập Đơn vị:…………………………\nĐịa chỉ mail đơn vị:……………………………………\nĐiện thoại đơn vị:……………………………….\nCán bộ phụ trách SV thực tập:…………………\nSố điện thoại của CB phụ trách:…………………..")
    _set_font(r1)
    p1.paragraph_format.line_spacing = 1.5
    c2 = t_sign.rows[0].cells[1]
    c2.text = ""
    p2 = c2.paragraphs[0]
    r2 = p2.add_run("LÃNH ĐẠO ĐƠN VỊ\n(Ký tên & đóng dấu)")
    _set_font(r2, bold=True)
    p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p2.paragraph_format.line_spacing = 1.5

    doc.add_page_break()


# ============ MAIN ============
def main():
    doc = Document()
    sec = doc.sections[0]
    sec.top_margin = Cm(2)
    sec.bottom_margin = Cm(2)
    sec.left_margin = Cm(3)
    sec.right_margin = Cm(2)

    style = doc.styles['Normal']
    style.font.name = FONT_NAME
    style.font.size = Pt(FONT_SIZE)
    style.paragraph_format.line_spacing = 1.5
    rPr = style.element.get_or_add_rPr()
    rPr.get_or_add_rFonts().set(qn('w:eastAsia'), FONT_NAME)

    # ===== SECTION 0: Bìa 1 + Bìa 2 (không có số trang) =====
    cover1(doc)
    doc.add_page_break()  # Ngắt trang giữa bìa 1 và bìa 2
    cover2(doc)

    # ===== SECTION 1: Mục lục (không có số trang) =====
    _add_section_break(doc)  # Tạo section mới cho mục lục
    toc_page(doc)

    # ===== SECTION 2: Nội dung chính (có số trang từ 1) =====
    sec_content = _add_section_break(doc)  # Tạo section mới cho nội dung
    _reset_page_number(sec_content)  # Đánh số trang từ 1

    loi_cam_on(doc)
    chuong1(doc)
    chuong2(doc)
    chuong3(doc)
    chuong4(doc)
    phu_luc(doc)
    ban_tu_danh_gia(doc)
    nhan_xet_dv(doc)
    nhan_xet_gv(doc)
    phieu_danh_gia(doc)

    add_page_number(doc)

    out = "bao_cao_thuc_tap_v2.docx"
    doc.save(out)
    print(f"✅ Đã tạo: {out}")
    print("📌 Mở Word → Ctrl+A → F9 để cập nhật mục lục")


if __name__ == "__main__":
    main()
