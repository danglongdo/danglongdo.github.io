# Hướng Dẫn Đăng Ký Tên Miền `.id.vn` / `.name.vn` & Cấu Hình Cloudflare DNS Chi Phí Dưới 100.000 VNĐ

Tài liệu hướng dẫn chi tiết quy trình sở hữu tên miền cá nhân mang thương hiệu lập trình viên (`dandanglong.id.vn` hoặc `dandanglong.name.vn`) theo đúng quy định của Trung tâm Internet Việt Nam (VNNIC) với ngân sách siêu tiết kiệm (< 100.000 VNĐ/năm, hoặc 0 VNĐ cho công dân 18–23 tuổi), kết nối hệ thống DNS và SSL toàn cầu trên Cloudflare Pages.

---

## Mục Lục
1. [Tại Sao Chọn Tên Miền Quốc Gia `.id.vn` / `.name.vn`?](#1-tại-sao-chọn-tên-miền-quốc-gia-idvn--namevn)
2. [Biểu Phí Quy Định & Chính Sách Miễn Phí VNNIC](#2-biểu-phí-quy-định--chính-sách-miễn-phí-vnnic)
3. [Cảnh Báo: Tránh Bẫy Gia Hạn Tên Miền Giá Rẻ (.xyz, .site, .online)](#3-cảnh-báo-tránh-bẫy-gia-hạn-tên-miền-giá-rẻ-xyz-site-online)
4. [Quy Trình Đăng Ký Từng Bước Qua Nhà Đăng Ký Ủy Quyền](#4-quy-trình-đăng-ký-từng-bước-qua-nhà-đăng-ký-ủy-quyền)
5. [Cấu Hình Quản Lý DNS & Tên Miền Trên Cloudflare](#5-cấu-hình-quản-lý-dns--tên-miền-trên-cloudflare)
6. [Thiết Lập Custom Domain Trên Cloudflare Pages](#6-thiết-lập-custom-domain-trên-cloudflare-pages)
7. [Bật Chứng Chỉ SSL/TLS Tự Động Miễn Phí](#7-bật-chứng-chỉ-ssltls-tự-động-miễn-phí)
8. [Phương Án Dự Phòng 0 VNĐ (Fallback URL Strategy)](#8-phương-án-dự-phòng-0-vnđ-fallback-url-strategy)
9. [Bảng Kiểm Tra Nghiệm Thu & Khắc Phục Lỗi Thường Gặp](#9-bảng-kiểm-tra-nghiệm-thu--khắc-phục-lỗi-thường-gặp)

---

## 1. Tại Sao Chọn Tên Miền Quốc Gia `.id.vn` / `.name.vn`?

Đối với lập trình viên và kỹ sư phần mềm tại Việt Nam, xây dựng danh tính số chuyên nghiệp thông qua portfolio đòi hỏi một tên miền ngắn gọn, uy tín và gắn liền với danh tính thực:
- **Độ tin cậy pháp lý**: Tên miền quốc gia `.vn` được pháp luật Việt Nam và VNNIC bảo hộ, định danh chính chủ qua Căn cước công dân (CCCD/eKYC), ngăn chặn hoàn toàn rủi ro mạo danh hoặc tranh chấp bản quyền.
- **Tính nhận diện thương hiệu cá nhân**: Đuôi `.id.vn` (Identity Việt Nam) hoặc `.name.vn` là không gian định danh chính thống dành riêng cho công dân Việt Nam quảng bá portfolio cá nhân, CV trực tuyến, blog kỹ thuật.
- **Tiết kiệm chi phí dài hạn**: Giá đăng ký và duy trì được Bộ Tài chính và Bộ Thông tin & Truyền thông quy định cố định, không bị thả nổi biến động theo tỉ giá USD hay chính sách tăng giá vô căn cứ của các nhà cung cấp nước ngoài.

---

## 2. Biểu Phí Quy Định & Chính Sách Miễn Phí VNNIC

### 2.1. Căn Cứ Pháp Lý & Văn Bản Quy Định
- **Thông tư 48/2025/TT-BKHCN** (kế thừa Thông tư 20/2023/TT-BTC của Bộ Tài chính): Quy định mức thu, chế độ thu, nộp, quản lý và sử dụng phí, lệ phí tên miền quốc gia `.vn`.
- **Quyết định số 826/QĐ-BTTTT** của Bộ Thông tin và Truyền thông: Phê duyệt Chương trình thúc đẩy, hỗ trợ người dân, doanh nghiệp, hộ kinh doanh hiện diện trực tuyến tin cậy, an toàn với các dịch vụ số sử dụng tên miền quốc gia `.vn` giai đoạn 2024–2025.

### 2.2. Bảng Biểu Phí Chuẩn (Đã bao gồm VAT)

| Đuôi Tên Miền | Đối Tượng Sử Dụng | Lệ Phí Đăng Ký (Lần đầu) | Phí Duy Trì Hàng Năm | Tổng Chi Phí Năm Đầu |
| :--- | :--- | :--- | :--- | :--- |
| **`.id.vn`** *(Ưu đãi 18–23 tuổi)* | Công dân Việt Nam đủ 18 đến 23 tuổi | **0 VNĐ** *(Miễn 100%)* | **0 VNĐ** *(Miễn 2 năm đầu)* | **0 VNĐ** |
| **`.id.vn`** *(Tiêu chuẩn)* | Công dân Việt Nam > 23 tuổi | 10.000 VNĐ | 50.000 VNĐ | **60.000 VNĐ** |
| **`.name.vn`** | Công dân Việt Nam | 10.000 VNĐ | 20.000 VNĐ | **30.000 VNĐ** |
| **`.io.vn`** *(Cá nhân / DN số)* | Tổ chức, cá nhân công nghệ | 10.000 VNĐ | 50.000 VNĐ | **60.000 VNĐ** |

> **Chính sách miễn phí 100% cho độ tuổi 18–23**:
> Khi đăng ký tên miền `.id.vn`, nếu độ tuổi của chủ thể tại thời điểm đăng ký từ đủ 18 đến 23 tuổi (tính theo ngày tháng năm sinh trên CCCD), hệ thống của VNNIC sẽ **tự động miễn 100% lệ phí đăng ký và phí duy trì trong 02 năm liên tiếp**. Từ năm thứ 3 trở đi, mức phí duy trì chỉ là 50.000 VNĐ/năm.

---

## 3. Cảnh Báo: Tránh Bẫy Gia Hạn Tên Miền Giá Rẻ (.xyz, .site, .online)

Nhiều lập trình viên mới bắt đầu xây dựng portfolio thường bị thu hút bởi các chương trình quảng cáo tên miền quốc tế giá rẻ như `.xyz`, `.site`, `.top`, `.online`, `.tech` với giá chỉ $0.99 hoặc 19.000 – 49.000 VNĐ tại các sàn quốc tế (Namecheap, GoDaddy, Hostinger). 

Tuy nhiên, đây là mô hình định giá "bẫy phễu" (loss-leader pricing):

```
+-------------------------------------------------------------------------+
|                  SO SÁNH CHI PHÍ THỰC TẾ TRONG 3 NĂM                     |
+-------------------------------------------------------------------------+
| Tiêu chí                  | .id.vn (VNNIC)          | .xyz / .site      |
+---------------------------+-------------------------+-------------------+
| Năm 1 (Đăng ký)           | 0 - 60.000 VNĐ          | 25.000 - 50.000   |
| Năm 2 (Duy trì)           | 0 - 50.000 VNĐ          | 350.000 - 450.000 |
| Năm 3 (Duy trì)           | 50.000 VNĐ              | 380.000 - 500.000 |
| Bảo mật thông tin (Whois) | Miễn phí (Mặc định)     | 100.000 - 200.000 |
+---------------------------+-------------------------+-------------------+
| TỔNG CHI PHÍ 3 NĂM        | 50.000 - 160.000 VNĐ    | 850.000 - 1.6tr   |
+---------------------------+-------------------------+-------------------+
```

### Rủi Ro Khi Dùng TLD Rác Khuyến Mãi:
1. **Phí gia hạn tăng vọt gấp 10 – 15 lần**: Năm thứ 2 trở đi bị tự động gia hạn với mức 350.000 – 600.000 VNĐ/năm. Nếu không gia hạn, bạn sẽ mất toàn bộ uy tín liên kết trên CV, profile LinkedIn và portfolio gửi nhà tuyển dụng.
2. **Nguy cơ rơi vào Spam Filter**: Các TLD như `.xyz`, `.top`, `.click` thường xuyên bị giới phát tán thư rác lạm dụng, dẫn đến điểm uy tín tên miền (domain reputation) thấp, dễ bị trình duyệt chặn hoặc bộ lọc tuyển dụng phân loại vào trang web rủi ro.
3. **Phí ẩn bảo vệ danh tính (Whois Privacy)**: Nhiều sàn quốc tế tính thêm phí ẩn hàng năm cho tính năng ẩn email/số điện thoại chủ sở hữu. Trong khi với `.vn`, thông tin cá nhân được VNNIC bảo vệ theo luật An toàn thông tin mạng Việt Nam.

**Kết luận**: Luôn ưu tiên tên miền quốc gia `.id.vn` hoặc `.name.vn` để đảm bảo chi phí trọn đời luôn ổn định dưới mức **50.000 VNĐ/năm**.

---

## 4. Quy Trình Đăng Ký Từng Bước Qua Nhà Đăng Ký Ủy Quyền

### 4.1. Danh Sách Nhà Đăng Ký VNNIC Khuyến Nghị
Nên chọn các Registrar có cổng eKYC tự động tích hợp ưu đãi chính phủ:
- **TND.vn** (Quy trình eKYC nhanh, giao diện tối giản, hỗ trợ tự quản lý Nameserver Cloudflare nhanh chóng).
- **iNET** (inet.vn — Hệ sinh thái tên miền quốc gia lớn, hỗ trợ phê duyệt trực tuyến 24/7).
- **PA Việt Nam** (pavietnam.vn — Nhà đăng ký lâu năm, hỗ trợ kỹ thuật tận tình).
- **Mắt Bão** (matbao.net — Cổng quản trị chuyên nghiệp).

### 4.2. Quy Tắc Đặt Tên Miền `.id.vn`
Theo quy định định danh của VNNIC:
- Tên miền `.id.vn` dành cho cá nhân phải phản ánh **Họ và Tên**, **Tên viết tắt + Họ**, hoặc **Bút danh/Biệt hiệu chính thức** của người đăng ký.
- *Ví dụ hợp lệ cho Đỗ Đăng Long*:
  - `dandanglong.id.vn` (Khuyến nghị cao nhất — chuẩn mực tuyển dụng)
  - `dandanglong.name.vn`
  - `longdd.id.vn`
  - `dolong.id.vn`

### 4.3. Các Bước Thao Tác Trực Tuyến

1. **Bước 1: Tra cứu tên miền**
   - Truy cập website của nhà đăng ký (ví dụ: `https://tnd.vn` hoặc `https://inet.vn`).
   - Nhập `dandanglong.id.vn` vào thanh tìm kiếm. Nếu khả dụng, nhấn **Đăng ký** hoặc **Thêm vào giỏ hàng**.

2. **Bước 2: Xác thực eKYC Căn cước công dân**
   - Chọn loại chủ thể: **Cá nhân**.
   - Tải ảnh chụp mặt trước và mặt sau thẻ **CCCD gắn chip** rõ nét, không lóa sáng, không cắt góc.
   - Tiến hành quét khuôn mặt (Face Recognition) qua webcam máy tính hoặc quét mã QR bằng điện thoại thông minh.
   - Hệ thống AI sẽ tự động đọc dữ liệu OCR: Số CCCD, Họ và tên ("ĐỖ ĐĂNG LONG"), Ngày sinh, Quê quán và Nơi thường trú.

3. **Bước 3: Nhận ưu đãi 0 VNĐ hoặc Thanh toán**
   - Nếu ngày sinh trên CCCD nằm trong độ tuổi 18–23: Hệ thống kích hoạt mã giảm giá chương trình VNNIC, số tiền thanh toán hiển thị **0 VNĐ**.
   - Nếu ngoài 23 tuổi: Tổng thanh toán cho `.id.vn` là **60.000 VNĐ** (hoặc `.name.vn` là **30.000 VNĐ**). Thanh toán qua chuyển khoản VietQR / MoMo / thẻ ATM nội địa.

4. **Bước 4: Ký hợp đồng điện tử & Chờ kích hoạt**
   - Ký số hợp đồng điện tử qua mã xác thực OTP gửi về số điện thoại đã đăng ký.
   - Hồ sơ được gửi lên hệ thống đăng ký quốc gia VNNIC. Tên miền thường được kích hoạt trong vòng **15 – 30 phút**.

---

## 5. Cấu Hình Quản Lý DNS & Tên Miền Trên Cloudflare

Để trang portfolio có tốc độ phản hồi tính bằng mili-giây trên toàn cầu và bảo mật SSL đạt chuẩn A+, chúng ta ủy quyền phân giải DNS của tên miền về **Cloudflare DNS (Free Plan)**.

### 5.1. Thêm Tên Miền Vào Cloudflare
1. Đăng ký/Đăng nhập tài khoản tại [dash.cloudflare.com](https://dash.cloudflare.com/).
2. Nhấn **Add a site** (Thêm trang web).
3. Nhập tên miền vừa đăng ký: `dandanglong.id.vn` (hoặc `dandanglong.name.vn`).
4. Chọn gói dịch vụ: **Free Plan ($0/tháng)** -> Nhấn **Continue**.
5. Cloudflare quét bản ghi DNS hiện có. Nhấn **Continue**.

### 5.2. Thay Đổi Cặp Nameservers Tại Nhà Đăng Ký Tên Miền
Cloudflare sẽ cung cấp 2 địa chỉ máy chủ tên miền (Nameservers), ví dụ:
- `drew.ns.cloudflare.com`
- `isla.ns.cloudflare.com`

**Thao tác**:
1. Đăng nhập trang quản trị dịch vụ của Nhà đăng ký (TND, iNET hoặc PA Việt Nam).
2. Vào mục **Quản lý tên miền** -> Chọn `dandanglong.id.vn` -> Tìm phần **Cấu hình Nameserver / Máy chủ DNS**.
3. Chọn chế độ **Sử dụng Nameserver tùy biến (Custom Nameserver)**.
4. Xóa các Nameserver mặc định cũ và điền đúng 2 địa chỉ Nameserver của Cloudflare vào:
   - Primary Nameserver: `drew.ns.cloudflare.com`
   - Secondary Nameserver: `isla.ns.cloudflare.com`
5. Nhấn **Lưu thay đổi**. Thời gian cập nhật DNS toàn cầu thường mất từ 5 đến 45 phút.

---

## 6. Thiết Lập Custom Domain Trên Cloudflare Pages

Giả sử dự án portfolio của bạn đã được deploy lên Cloudflare Pages với URL mặc định là `<project>.pages.dev` (ví dụ: `portfolio-longdd.pages.dev` hoặc `longdd.pages.dev`).

### 6.1. Khai Báo Custom Domain Trên Pages
1. Tại Cloudflare Dashboard, vào menu trái: **Workers & Pages**.
2. Chọn dự án portfolio của bạn (ví dụ: `portfolio`).
3. Chuyển sang tab **Custom domains**.
4. Nhấn **Set up a custom domain**.
5. Nhập tên miền gốc: `dandanglong.id.vn` -> Nhấn **Continue**.
6. Cloudflare sẽ tự động nhận diện tên miền đang được quản lý bởi cùng tài khoản Cloudflare và đề xuất thêm bản ghi DNS tương ứng. Nhấn **Activate domain**.
7. Lặp lại thao tác trên cho tên miền phụ `www`: Nhấn **Set up a custom domain** -> Nhập `www.dandanglong.id.vn` -> Nhấn **Activate domain**.

### 6.2. Bảng Bản Ghi DNS Tiêu Chuẩn (DNS Records)

Sau khi thêm, tại mục **DNS** -> **Records** của domain trên Cloudflare, các bản ghi cần có dạng như sau:

| Type | Name | Content / Target | Proxy status | TTL | Ghi Chú |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CNAME** | `@` *(hoặc `dandanglong.id.vn`)* | `<project>.pages.dev` | **Proxied (Đám mây cam)** | Auto | Trỏ tên miền gốc về máy chủ biên Pages |
| **CNAME** | `www` | `<project>.pages.dev` | **Proxied (Đám mây cam)** | Auto | Hỗ trợ truy cập qua tiền tố www |

> **Lưu ý về CNAME Flattening**:
> Bình thường chuẩn RFC 1034 cấm tạo bản ghi CNAME tại tên miền gốc (`@`). Tuy nhiên, Cloudflare tự động hỗ trợ tính năng **CNAME Flattening** (làm phẳng CNAME thành các bản ghi A/AAAA tại biên), cho phép tên miền gốc `dandanglong.id.vn` trỏ trực tiếp đến `pages.dev` mà không cần thuê thêm máy chủ IP tĩnh!

---

## 7. Bật Chứng Chỉ SSL/TLS Tự Động Miễn Phí

Để đảm bảo kết nối mã hóa HTTPS và hiển thị biểu tượng ổ khóa an toàn:

1. Trong Dashboard tên miền trên Cloudflare, chọn menu **SSL/TLS** > **Overview**.
2. Đặt chế độ mã hóa: **Full (strict)** hoặc **Full**.
   - Cloudflare Pages luôn cung cấp chứng chỉ hợp lệ ở máy chủ nguồn (`.pages.dev`), do đó chế độ **Full (strict)** là lựa chọn an toàn và tối ưu nhất để chống tấn công Man-in-the-Middle.
3. Chuyển sang tab **SSL/TLS** > **Edge Certificates**:
   - **Always Use HTTPS**: Bật **ON** (Tự động chuyển hướng toàn bộ kết nối HTTP sang HTTPS an toàn).
   - **Automatic HTTPS Rewrites**: Bật **ON** (Tự động nâng cấp các tài nguyên không an toàn).
   - **Minimum TLS Version**: Chọn **TLS 1.2** hoặc **TLS 1.3** để đạt điểm bảo mật cao nhất.
4. Chứng chỉ Universal SSL (do Let's Encrypt hoặc Google Trust Services cấp phát) sẽ được hoàn tất trong vòng 10–15 phút.

---

## 8. Phương Án Dự Phòng 0 VNĐ (Fallback URL Strategy)

Trong trường hợp bạn chưa kịp đăng ký tên miền, hồ sơ eKYC đang chờ duyệt, hoặc không có nhu cầu chi tiêu trước khi đi làm, trang portfolio được thiết kế với phương án hoạt động hoàn toàn miễn phí 0 VNĐ mà không đánh mất tính chuyên nghiệp:

### 8.1. Tên Miền Phụ Mặc Định: Cloudflare Pages (`*.pages.dev`)
- Mỗi dự án Cloudflare Pages được cấp phát miễn phí một subdomain chuẩn: `<tên-dự-án>.pages.dev` (ví dụ: `longdd.pages.dev`).
- **Ưu điểm**:
  - 100% miễn phí trọn đời, băng thông không giới hạn (Unlimited Bandwidth).
  - Tích hợp sẵn SSL chính hãng từ Cloudflare.
  - Tốc độ tải trang cực nhanh qua 300+ PoP toàn cầu của Cloudflare.
- **Cách đặt tên**: Đặt tên dự án ngắn gọn, mang họ tên lập trình viên (ví dụ: `longdd`, `dandanglong`, `lombeo-dev`) để link gửi nhà tuyển dụng trông gọn gàng, sáng tạo và uy tín.

### 8.2. Kênh Dự Phòng Phụ: GitHub Pages (`*.github.io`)
- Subdomain `lombeo.github.io` được liên kết với tài khoản GitHub cá nhân [github.com/lombeo](https://github.com/lombeo).
- Cho phép clone mã nguồn tĩnh vào nhánh `gh-pages` làm phương án dự phòng khi cần thiết.

### 8.3. Cấu Hình Redirect Không Mất Điểm SEO
Khi bạn chính thức gắn tên miền `dandanglong.id.vn`, toàn bộ traffic truy cập từ `longdd.pages.dev` sẽ tự động chuyển hướng hoặc cùng chia sẻ chung mã nguồn mà không gây lỗi phân mảnh liên kết.

---

## 9. Bảng Kiểm Tra Nghiệm Thu & Khắc Phục Lỗi Thường Gặp

### 9.1. Bảng Kiểm Tra Hoàn Tất (Checklist)
- [ ] Đã hoàn tất eKYC và kích hoạt tên miền `.id.vn` / `.name.vn` tại nhà đăng ký VNNIC.
- [ ] Đã đổi cặp Nameservers sang Cloudflare thành công (`Status: Active` trên Cloudflare).
- [ ] Đã thêm cả 2 bản ghi `dandanglong.id.vn` và `www.dandanglong.id.vn` vào Custom Domains của Cloudflare Pages.
- [ ] Chế độ SSL/TLS được cấu hình ở mức **Full (strict)**.
- [ ] Kích hoạt **Always Use HTTPS**.
- [ ] Kiểm tra lệnh `dig` hoặc `nslookup` trả về IP biên của Cloudflare.
- [ ] Truy cập thử cả 4 biến thể URL và xác nhận chuyển hướng HTTPS thành công:
  - `http://dandanglong.id.vn` -> chuyển sang `https://dandanglong.id.vn`
  - `http://www.dandanglong.id.vn` -> chuyển sang `https://dandanglong.id.vn`
  - `https://www.dandanglong.id.vn` -> hoạt động ổn định
  - `https://dandanglong.id.vn` -> tải trang chính xác

### 9.2. Khắc Phục Lỗi Phổ Biến

1. **Lỗi `Error 521: Web server is down`**:
   - *Nguyên nhân*: CNAME trỏ sai địa chỉ dự án `.pages.dev` hoặc dự án trên Cloudflare Pages chưa build thành công.
   - *Cách xử lý*: Kiểm tra lại tên miền target của bản ghi CNAME trong Cloudflare DNS phải khớp 100% với URL trong Pages settings (ví dụ: `portfolio-longdd.pages.dev`).

2. **Lỗi `ERR_TOO_MANY_REDIRECTS` (Vòng lặp chuyển hướng)**:
   - *Nguyên nhân*: Chọn chế độ SSL/TLS là **Flexible** trong khi Pages mặc định đã có chứng chỉ HTTPS.
   - *Cách xử lý*: Chuyển ngay chế độ SSL/TLS trong Cloudflare sang **Full** hoặc **Full (strict)**.

3. **Chưa thấy hiệu lực tên miền sau khi đổi Nameservers**:
   - *Nguyên nhân*: Bộ nhớ đệm DNS cục bộ của máy tính hoặc nhà mạng (ISP) chưa hết hạn TTL.
   - *Cách xử lý*: Đổi DNS trên máy tính sang Google DNS (`8.8.8.8`) hoặc Cloudflare DNS (`1.1.1.1`), hoặc xóa cache DNS bằng lệnh:
     ```bash
     # macOS:
     sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
     # Windows:
     ipconfig /flushdns
     ```

---
*Tài liệu được biên soạn và bảo trì bởi Đỗ Đăng Long phục vụ mục tiêu chuẩn hóa hạ tầng số portfolio cá nhân.*
