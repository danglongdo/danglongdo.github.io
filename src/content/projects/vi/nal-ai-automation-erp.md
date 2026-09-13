---
title: "Tự động hoá Quy trình Doanh nghiệp với AI Agents & ERP Nội bộ"
slug: "nal-ai-automation-erp"
locale: "vi"
summary: "Kiến trúc nền tảng vận hành doanh nghiệp kết hợp cổng ERP nội bộ trên Refine/React cùng hệ sinh thái AI agent tự trị trên Mattermost, tối ưu hoá quy trình tuyển dụng, tra cứu chính sách, điều phối phản hồi nội bộ và sắp xếp lịch họp liên phòng ban."
role: "Kỹ sư Full-Stack & Tự động hoá AI"
timeline: "Tháng 6/2025 - Hiện tại"
techStack:
  - "Mattermost API"
  - "AI Agents"
  - "Refine Framework"
  - "React"
  - "Supabase"
  - "Edge Functions"
  - "PostgreSQL"
  - "TypeScript"
highlight: true
securityNotice: "Hệ thống doanh nghiệp nội bộ tuân thủ thoả thuận bảo mật (NDA). Mọi sơ đồ kiến trúc, tương tác hệ thống và quy trình đều được tổng quát hoá nhằm bảo vệ logic nghiệp vụ độc quyền, các chỉ số vận hành và thông tin mật của công ty."
challenge: "Sự tăng trưởng nhanh chóng về quy mô tổ chức dẫn đến sự phân mảnh giữa các công cụ nội bộ, tạo gánh nặng lớn cho khối Nhân sự và Quản lý với việc lọc hồ sơ ứng viên thủ công, giải đáp chính sách lặp lại, thất thoát ý kiến đóng góp và xung đột lịch họp phức tạp."
ownership: "Đảm nhiệm thiết kế và phát triển toàn diện cổng quản trị ERP nội bộ, xây dựng đường ống xử lý webhook serverless trên Supabase Edge Functions, và thiết kế kiến trúc 4 AI agent tự trị trên Mattermost từ định tuyến ý định đến thực thi quy trình cuối."
approach: "Tách bạch giao diện hội thoại khỏi tầng quản trị dữ liệu bằng kiến trúc hướng sự kiện (event-driven), phân quyền bảo mật cấp hàng PostgreSQL RLS, máy trạng thái xác định (state machine) và kiểm thực dữ liệu JSON có cấu trúc từ mô hình ngôn ngữ lớn (LLM)."
solution: "Triển khai cổng quản trị ERP tập trung sử dụng Refine và Supabase Edge Functions kết hợp cùng 4 AI agent chuyên biệt trên Mattermost: trợ lý lọc hồ sơ tuyển dụng, bot hỏi đáp quy chế/chính sách, bộ điều phối phản hồi nội bộ và bot sắp xếp lịch họp tự động."
outcome: "Xoá bỏ các bước trung gian thủ công tốn thời gian trong vận hành nhân sự, rút ngắn đáng kể thời gian điều phối lịch họp liên phòng ban, thống nhất toàn bộ dữ liệu vào một nguồn kiểm toán duy nhất, và cho phép nhân viên kích hoạt quy trình trực tiếp ngay trong cửa sổ chat thường nhật."
reflection: "Sự thành công của AI agent trong môi trường doanh nghiệp phụ thuộc vào nền tảng kiến trúc vững chắc: chuẩn hoá dữ liệu chặt chẽ, xử lý webhook bất biến (idempotent), cơ chế dự phòng rõ ràng và luôn duy trì quyền kiểm soát phê duyệt của con người đối với các quyết định quan trọng."
order: 1
---

## Tổng quan Dự án

Khi một tổ chức mở rộng quy mô nhân sự, chi phí vận hành phi kỹ thuật thường tăng theo hàm số mũ. Các nhóm liên phòng ban thường xuyên lãng phí hàng giờ làm việc để chuyển đổi qua lại giữa các dashboard SaaS riêng lẻ, phân loại hồ sơ ứng viên bằng tay, giải đáp các câu hỏi quy chế lặp đi lặp lại, căn chỉnh lịch trình bận rộn giữa các cấp quản lý và thu thập ý kiến đóng góp một cách phân tán.

Tại **NAL Vietnam**, tôi đã trực tiếp đảm nhiệm vai trò kiến trúc và phát triển giải pháp tự động hoá vận hành doanh nghiệp toàn diện nhằm giải quyết triệt để các điểm nghẽn này. Giải pháp liên kết chặt chẽ hai trụ cột chính:

1. **Cổng ERP Quản trị Nội bộ Tập trung**: Xây dựng trên nền tảng **Refine Framework**, **React** và **TypeScript**, kết hợp với hạ tầng backend serverless **Supabase Edge Functions** cùng cơ sở dữ liệu **PostgreSQL** tích hợp chính sách bảo mật cấp hàng **Row-Level Security (RLS)** nghiêm ngặt.
2. **Hệ sinh thái AI Agent Tự trị**: Tích hợp trực tiếp vào nền tảng giao tiếp **Mattermost** thông qua webhook tương tác, lệnh slash command và lắng nghe sự kiện, cung cấp 4 bot hội thoại chuyên biệt có khả năng tự động xử lý tác vụ dưới sự giám sát và phê duyệt của con người (human-in-the-loop).

---

## Thách thức Vận hành Thực tế

Trước khi triển khai hệ thống, các quy trình nội bộ phụ thuộc vào các bảng tính Excel rời rạc, các biểu mẫu thủ công và các tin nhắn trao đổi rải rác:

- **Nghẽn cổ chai trong quy trình tuyển dụng**: Bộ phận tuyển dụng phải đọc thủ công hàng trăm CV, sao chép thông tin ứng viên qua các bảng tính, và mất nhiều thời gian trao đổi với kỹ sư phỏng vấn để thống nhất tiêu chí đánh giá kỹ thuật cho từng vị trí.
- **Áp lực hỗ trợ hành chính lặp lại**: Đội ngũ Nhân sự và Vận hành dành phần lớn thời gian trong ngày chỉ để giải đáp những thắc mắc quen thuộc về chính sách công ty, hạn mức bảo hiểm sức khoẻ, quy định làm việc từ xa và cách tính ngày phép còn lại.
- **Thất thoát tín hiệu đóng góp của nhân viên**: Các phản hồi và đề xuất cải tiến môi trường làm việc khi gửi qua kênh chat cá nhân thường thiếu người tiếp nhận rõ ràng, dẫn đến việc xử lý chậm trễ và bỏ lỡ những góc nhìn quan trọng từ tập thể.
- **Bế tắc trong việc sắp xếp lịch họp**: Để tìm được một khung giờ trống chung giữa 3–5 thành viên cấp cao (Tech Lead, Solution Architect, PM) cho các buổi phỏng vấn hay phản biện kỹ thuật, các bên thường phải nhắn tin qua lại hàng chục lượt gây mất tập trung.

Mục tiêu đặt ra: hợp nhất toàn bộ dữ liệu nghiệp vụ về một nguồn dữ liệu duy nhất và trao quyền cho nhân viên kích hoạt quy trình làm việc ngay từ công cụ giao tiếp hàng ngày—Mattermost.

---

## Kiến trúc Nền tảng

### 1. Cổng ERP Nội bộ: Refine + React + Supabase

Nhằm cung cấp cho các nhà quản lý và chuyên viên nhân sự cái nhìn toàn cảnh và quyền kiểm soát tập trung, chúng tôi xây dựng cổng web quản trị hiện đại sử dụng framework **Refine** trên nền **React** và **TypeScript**.

- **Kiến trúc Headless & Tốc độ phát triển**: Cơ chế trừu tượng hoá data-provider của Refine cho phép nhanh chóng kết nối các tập dữ liệu quan hệ phức tạp (ứng viên, nhân sự, quy chế, nhật ký kiểm toán) với các thành phần giao diện chỉn chu, tích hợp sẵn các bộ lọc, sắp xếp và phân trang hiệu quả.
- **Xử lý Serverless với Supabase Edge Functions**: Các tác vụ xử lý logic nặng, xác minh chữ ký webhook và tích hợp bên thứ ba được thực thi trên hạ tầng phân tán Supabase Edge Functions (runtime Deno/TypeScript), giúp cách ly hoàn toàn cơ sở dữ liệu khỏi các đột biến tải từ mạng bên ngoài.
- **Bảo vệ dữ liệu Không Tin Tưởng (Zero-Trust) với PostgreSQL RLS**: Mỗi bảng dữ liệu đều áp dụng chính sách phân quyền cấp dòng Row-Level Security chi tiết. Quyền hạn của Quản trị viên, Trưởng nhóm tuyển dụng và Nhân viên thông thường được phân định rành mạch từ tầng lõi cơ sở dữ liệu, loại bỏ hoàn toàn nguy cơ leo thang đặc quyền.
- **Nhật ký Kiểm toán Toàn diện (Audit Trails)**: Mọi thay đổi trạng thái dù được kích hoạt bởi AI agent hay người dùng quản trị đều sinh ra một bản ghi kiểm toán bất biến chứa mã người thao tác, dấu thời gian, trạng thái trước và trạng thái sau khi cập nhật.

---

## Hệ sinh thái 4 AI Agent Tự trị trên Mattermost

Thay vì xây dựng một chatbot tổng hợp cồng kềnh, chúng tôi thiết kế 4 agent chuyên biệt, mỗi bot phụ trách một miền nghiệp vụ rõ ràng với đầu vào cụ thể, máy trạng thái xác định và định dạng đầu ra chuẩn hoá.

```typescript
// Định dạng Payload Webhook Mattermost & Hợp đồng Định tuyến Ý định Agent
export interface MattermostWebhookEvent {
  event_id: string;
  timestamp: number;
  channel_id: string;
  user_id: string;
  trigger_type: 'slash_command' | 'interactive_action' | 'dialog_submission';
  agent_target: 'recruitment' | 'policy' | 'feedback' | 'scheduler';
  payload: {
    command?: string;
    text?: string;
    action_id?: string;
    selected_option?: string;
    context?: Record<string, unknown>;
  };
}
```

### 1. Bot Trợ lý Tuyển dụng (Recruitment Assistant Bot)

Hỗ trợ chuyên viên tuyển dụng và trưởng bộ phận kỹ thuật trong suốt vòng đời sàng lọc ứng viên:

- **Trích xuất Hồ sơ Chuẩn hoá**: Khi chuyên viên tải CV lên kênh tuyển dụng chuyên trách, bot tự động phân tích văn bản phi cấu trúc thành dữ liệu JSON chuẩn mực bao gồm: danh mục kỹ năng chuyên môn, số năm kinh nghiệm thực tế, học vấn và các dự án tiêu biểu.
- **Tự động Sinh Bộ Câu hỏi Phỏng vấn**: Dựa trên mô tả công việc (JD) lưu trữ trong ERP, bot gợi ý danh sách câu hỏi phỏng vấn kỹ thuật và tiêu chí chấm điểm chuyên sâu, phân cấp linh hoạt theo trình độ (Junior, Mid, Senior).
- **Đồng bộ Trực tiếp Quy trình Tuyển dụng**: Chuyên viên có thể chuyển đổi trạng thái ứng viên (`Sàng lọc`, `Phỏng vấn Kỹ thuật`, `Gửi Đề nghị`) thông qua các nút bấm tương tác ngay trên Mattermost mà không cần mở giao diện web ERP.

### 2. Bot Hỏi đáp Quy chế & Chính sách Công ty (Policy Q&A Bot)

Đóng vai trò như một bàn trợ giúp nội bộ hoạt động liên tục 24/7 giúp nhân sự tra cứu nhanh chóng và chính xác các thông tin quy chế:

- **Truy xuất Tri thức Theo Ngữ cảnh (RAG)**: Lập chỉ mục toàn bộ sổ tay nhân viên, quy chế công tác phí, quy định làm việc linh hoạt và chính sách phúc lợi bằng công nghệ tìm kiếm ngữ nghĩa vector embeddings.
- **Dẫn nguồn Minh bạch**: Mỗi câu trả lời đều trích dẫn chính xác số chương, điều mục và tên tài liệu gốc trong kho quy chuẩn nội bộ, ngăn ngừa hiện tượng suy diễn sai lệch hoặc thông tin không có căn cứ.
- **Chuyển giao Linh hoạt (Graceful Escalation)**: Khi gặp các câu hỏi liên quan đến trường hợp ngoại lệ hoặc vấn đề cá nhân nhạy cảm, bot nhận biết giới hạn và cung cấp nút bấm chuyển tiếp vụ việc trực tiếp đến chuyên viên nhân sự phụ trách.

### 3. Bộ Điều phối Ý kiến & Phản hồi Nội bộ (Employee Feedback Dispatcher)

Kênh tiếp nhận chính thức các đề xuất cải tiến quy trình, kiến nghị trang thiết bị và phản hồi môi trường làm việc:

- **Tiếp nhận Có Cấu trúc**: Nhân viên tương tác qua lệnh slash command hoặc tin nhắn trực tiếp với bot, lựa chọn danh mục rõ ràng (Cơ sở vật chất, Công cụ làm việc, Quy trình vận hành, Văn hoá doanh nghiệp).
- **Phân loại Cảm xúc & Mức độ Ưu tiên**: Đánh giá ngữ cảnh và mức độ khẩn cấp của nội dung, chuyển đổi yêu cầu thành một phiếu xử lý (ticket) hoàn chỉnh.
- **Định tuyến Tự động Đến Trưởng Bộ phận**: Chuyển tiếp phiếu trực tiếp vào kênh điều hành của phòng ban liên quan kèm các nút thao tác trạng thái (`Đã tiếp nhận`, `Đang xử lý`, `Đã giải quyết`), đảm bảo phản hồi luôn được theo dõi xuyên suốt và phản hồi kịp thời đến người gửi.

### 4. Bot Sắp xếp Lịch họp Tự động Đa thành viên (Meeting Scheduler Bot)

Giải quyết bài toán xung đột lịch trình khi cần tổ chức các cuộc họp kỹ thuật hoặc phỏng vấn nhiều bên:

- **Hiểu Ngôn ngữ Tự nhiên**: Tiếp nhận yêu cầu bằng câu lệnh giao tiếp tự nhiên, ví dụ: *"Sắp xếp cuộc họp kỹ thuật 45 phút với @lead.architect và @project.pm vào chiều thứ Tư tuần sau"*.
- **Tính toán Ma trận Lịch trống**: Tích hợp với hệ thống lịch để đối chiếu thời gian rảnh của tất cả người tham gia, chủ động loại trừ các khung giờ tập trung cá nhân và các cuộc hẹn định kỳ.
- **Đề xuất Khung giờ Tối ưu**: Gửi thẻ gợi ý tương tác liệt kê các khung giờ thích hợp nhất dựa trên mức độ thuận tiện chung.
- **Kích hoạt Lịch họp Nhanh chóng**: Ngay khi người tổ chức chọn khung giờ, bot tự động phát hành thư mời lịch chính thức, đặt phòng họp nội bộ và thông báo xác nhận vào kênh chat.

---

## Thực hành Kỹ nghệ Hỗ trợ bởi AI & Chuẩn mực Nội bộ

Để duy trì tốc độ phát triển cao song hành cùng tính ổn định tuyệt đối của hệ thống, quy trình xây dựng tuân thủ các chuẩn mực kỹ thuật khắt khe:

- **Kỹ nghệ Prompt Dựa trên Schema (Schema-First)**: Mọi lệnh gọi mô hình LLM đều bắt buộc tuân theo ràng buộc JSON schema chặt chẽ. Agent sẽ từ chối các định dạng phản hồi sai lệch và tự động kích hoạt chu kỳ sửa lỗi, đảm bảo dữ liệu luôn hợp lệ trước khi gửi về các API nghiệp vụ.
- **Xử lý Bất biến & Khử trùng lặp Sự kiện**: Các sự kiện webhook từ Mattermost được xác thực bằng chữ ký mật mã (HMAC signature) và kiểm tra đối soát với bộ nhớ đệm chống trùng lặp, đảm bảo không bao giờ xảy ra tình trạng thực thi lặp lại khi có sự cố retry từ mạng.
- **Quản trị An toàn Dữ liệu Doanh nghiệp**: Toàn bộ thông tin định danh cá nhân (PII) đều được làm sạch trước khi xử lý qua mô hình. Hệ thống áp dụng các thoả thuận không sử dụng dữ liệu để huấn luyện, đảm bảo mã nguồn và dữ liệu nội bộ được bảo vệ tuyệt đối.

---

## Hiệu quả Vận hành Thực tế

Dù các quy định bảo mật không cho phép công bố chi tiết về quy mô nhân sự hoặc số liệu lưu lượng độc quyền, dự án đã mang lại những giá trị định tính rõ nét cho toàn bộ tổ chức:

- **Tối ưu hoá Quy trình Tuyển dụng**: Đội ngũ kỹ sư phỏng vấn nhận được hồ sơ tóm tắt chuẩn hoá cùng bộ câu hỏi đánh giá chuyên môn chỉ trong vài phút sau khi có CV mới.
- **Phản hồi Thắc mắc Quy chế Tức thì**: Hơn 75% các câu hỏi thường nhật về chính sách công ty được giải đáp ngay lập tức kèm trích dẫn văn bản, giúp bộ phận Nhân sự tập trung nguồn lực vào việc phát triển văn hoá và đào tạo con người.
- **Loại bỏ Hoàn toàn Trở ngại Đặt lịch**: Việc sắp xếp lịch họp nhiều thành viên chuyển đổi từ hàng giờ nhắn tin thủ công sang một quy trình phê duyệt tự động chỉ mất khoảng 30 giây.
- **Thống nhất Một Nguồn Dữ liệu Duy nhất**: Mọi dữ liệu phát sinh từ các luồng trao đổi trong kênh chat được đồng bộ mạch lạc về ERP Refine, cung cấp cho ban quản lý bức tranh vận hành minh bạch và đầy đủ khả năng kiểm toán.

---

## Bài học Kỹ thuật & Đúc kết

1. **Ưu tiên Máy Trạng thái hơn Trò chuyện Tự do**: Trong các thử nghiệm ban đầu, chúng tôi cho phép hội thoại mở, nhưng các quy trình doanh nghiệp đòi hỏi tính xác định cao. Việc giới hạn agent hoạt động theo các máy trạng thái hữu hạn với các nút bấm hành động cụ thể đã nâng cao rõ rệt độ tin cậy và sự đón nhận của người dùng.
2. **Ràng buộc Cơ sở Dữ liệu là Lá chắn Cuối cùng**: Dù các bộ lọc AI và xác thực schema hoạt động hiệu quả ở lớp ngoài, sự ổn định thực sự phải đến từ tầng lưu trữ. Khóa ngoại, ràng buộc kiểm tra (check constraints) và chính sách RLS trên PostgreSQL bảo đảm rằng ngay cả khi mô hình AI trả về kết quả bất thường, dữ liệu cốt lõi cũng không bao giờ bị sai lệch.
3. **Luôn Giữ Con người trong Vòng Phê duyệt (Human-in-the-Loop)**: AI agent nên đóng vai trò là trợ lý đắc lực nâng cao hiệu suất thay vì tự đưa ra các phán quyết cuối cùng. Các hành động mang tính bước ngoặt—như thay đổi trạng thái tuyển dụng, xử lý ngoại lệ chính sách hay đặt phòng họp quan trọng—luôn cần sự xác nhận tường minh từ con người thông qua các thẻ giao diện tương tác.
