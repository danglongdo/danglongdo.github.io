---
title: "Hệ thống Quản lý Thi công San lấp Mặt bằng (SLMS)"
slug: "sep490-construction-slms"
locale: "vi"
summary: "Nền tảng toàn diện quản lý vòng đời dự án thi công và điều phối nguồn lực với cơ chế kiểm soát chỉnh sửa đồng thời."
role: "Kỹ sư Backend chính (~340 Commits) & Tác giả cơ chế Plan Edit Lock"
timeline: "Tháng 12/2024 - Tháng 5/2025"
techStack:
  - "ASP.NET Core 8"
  - "C#"
  - "PostgreSQL"
  - "Entity Framework Core"
  - "Redis Cache & Pub/Sub"
  - "SignalR"
  - "MailKit"
  - "Azure App Service"
  - "Vue 3"
highlight: true
order: 2
securityNotice: "Liên kết kho mã nguồn tạm thời được hạn chế để bảo vệ an toàn thông tin trước khi lọc sạch lịch sử Git. Kiến trúc, lược đồ dữ liệu và thiết kế mã nguồn được trình bày dưới dạng nghiên cứu điển hình."
challenge: "Quy trình thi công san lấp mặt bằng đòi hỏi đồng bộ hóa thời gian thực giữa số liệu khảo sát trắc địa, điều phối máy móc cơ giới nặng và nhật ký thi công theo ca. Nhiều kỹ sư cùng chỉnh sửa kế hoạch điều độ dự án cùng lúc đã gây ra tranh chấp dữ liệu (race conditions), ghi đè trạng thái và phân mảnh báo cáo tiến độ hàng ngày."
ownership: "Đảm nhận vai trò Kỹ sư Backend chính với khoảng 340 commits (chiếm hơn 80% mã nguồn backend), thiết kế toàn bộ mô hình nghiệp vụ (domain model), tầng lưu trữ dữ liệu và background services trên ASP.NET Core 8; đồng thời trực tiếp xây dựng luồng giao diện cơ chế khóa kế hoạch (Plan Edit Lock) trên Vue 3."
approach: "Thiết kế kiến trúc Modular Monolith chuẩn Clean Architecture với ASP.NET Core 8 và EF Core 7 trên PostgreSQL. Triển khai cơ chế khóa chỉnh sửa phân tán (pessimistic distributed lease) với cơ chế tự động gia hạn và hết hạn, kết hợp Redis Cache và SignalR để đồng bộ trạng thái ngay lập tức."
solution: "Xây dựng thực thể PlanEditLock được duy trì bởi dịch vụ nền định kỳ (IHostedService), áp dụng bộ lọc truy vấn xóa mềm toàn cục (EF Core Global Query Filters) và tự động ghi log kiểm toán (audit trail interceptor), tích hợp Redis Pub/Sub đồng bộ với SignalR hub để phát cảnh báo tức thì đến các chỉ huy công trường."
outcome: "Loại bỏ 100% xung đột ghi đè kế hoạch thi công qua hơn 40 giai đoạn thực tế, giảm độ trễ truy vấn tổng hợp tiến độ xuống dưới 50ms nhờ bộ nhớ đệm Redis, và tự động hóa toàn bộ thông báo bàn giao ca thi công."
reflection: "Đối với các phần mềm vận hành công trường thực tế, khóa lạc quan (optimistic locking) thường gây ức chế lớn cho người dùng khi lập kế hoạch dài; cơ chế khóa bi quan (pessimistic lease) với hiển thị trực quan và nhịp tim tự động (heartbeat) mang lại trải nghiệm tin cậy vượt trội cho kỹ sư hiện trường."
---

## 1. Tóm tắt Dự án & Bối cảnh Vận hành

**Hệ thống Quản lý Thi công San lấp Mặt bằng (Site Leveling Management System - SLMS)** là nền tảng điều hành dự án xây dựng công nghiệp được thiết kế để quản lý toàn diện các công trình san lấp và giải phóng mặt bằng quy mô lớn. Trong kỹ thuật xây dựng dân dụng, công tác đào đắp và san lấp mặt bằng là giai đoạn đòi hỏi chi phí đầu tư cao cùng độ phức tạp vận hành lớn:

- **Khảo sát trắc địa & Thể tích đào đắp**: Quản lý tọa độ cao độ, tính toán khối lượng đào đắp (cut-and-fill volume) và chỉ tiêu đào lấp hàng ngày theo từng ô lưới địa hình.
- **Điều phối đội xe cơ giới nặng**: Điều phối và giám sát các trang thiết bị giá trị cao (máy xúc, máy ủi, xe lu rung, đoàn xe ben vận chuyển) kèm định mức tiêu hao nhiên liệu và bảo dưỡng.
- **Quản lý nhân sự & Bàn giao ca trực**: Điều hành quy trình bàn giao ca giữa kỹ sư hiện trường, đội trưởng trắc địa và ban giám đốc ban điều hành dự án.
- **Lập kế hoạch tiến độ đa bên liên quan**: Thiết lập tiến độ thi công nhiều tuần liên tiếp, nơi kế hoạch thường xuyên biến động theo thời tiết, điều kiện địa chất và tình trạng sẵn sàng của thiết bị.

Trước khi áp dụng SLMS, các đội ngũ hiện trường phụ thuộc vào các bảng tính rời rạc và các nhóm tin nhắn thủ công. Điều này dẫn đến sự chậm trễ trong việc nắm bắt tiến độ và nghiêm trọng hơn là tình trạng ghi đè dữ liệu khi nhiều kỹ sư cùng cập nhật kế hoạch thi công tại một thời điểm. SLMS ra đời nhằm hợp nhất toàn bộ quy trình vận hành với độ toàn vẹn giao dịch tuyệt đối và phản hồi thông tin tức thì.

---

## 2. Vai trò Ứng viên & Phạm vi Trách nhiệm Kỹ thuật

Với vai trò **Kỹ sư Backend chính (Backend Lead & Primary Author)**, tôi chịu trách nhiệm xây dựng nền tảng kiến trúc và triển khai toàn bộ dịch vụ cốt lõi trong suốt vòng đời dự án (Tháng 12/2024 – Tháng 5/2025):

- **Đóng góp mã nguồn Backend**: Tác giả của xấp xỉ **340 commits**, chiếm hơn 80% tổng số commit trong kho mã nguồn backend của hệ thống.
- **Mô hình hóa nghiệp vụ & Thiết kế CSDL**: Trực tiếp thiết kế toàn bộ lược đồ quan hệ trong PostgreSQL, bao gồm quản lý dự án, giai đoạn, phân khu san lấp, danh mục thiết bị, mốc trắc địa, nhật ký thi công hàng ngày và phân quyền theo vai trò.
- **Đảm bảo tính toàn vẹn trạng thái & Kiểm soát đồng thời**: Thiết kế và phát triển cơ chế **Plan Edit Lock**, giải quyết dứt điểm vấn đề tranh chấp dữ liệu trong quá trình lập kế hoạch.
- **Phối hợp Full-Stack**: Bên cạnh nhiệm vụ chính ở backend, tôi trực tiếp tham gia phát triển phía client trên **Vue 3** để xây dựng giao diện hiển thị trạng thái khóa, bộ đếm nhịp tim (heartbeat timer) tự động gia hạn khóa và luồng modal thông báo giải quyết xung đột khi có người dùng khác đang chỉnh sửa.

---

## 3. Kiến trúc Modular Monolith & Tầng Lưu trữ Dữ liệu

### 3.1 Cấu trúc Modular Monolith trên ASP.NET Core 8
Để tối ưu hóa chi phí vận hành và duy trì ranh giới nghiệp vụ mạch lạc, hệ thống backend được tổ chức theo mô hình Modular Monolith tuân thủ các nguyên tắc Clean Architecture:
- **Tầng Domain**: Các thực thể nghiệp vụ thuần túy, sự kiện domain, quy tắc bất biến (invariants) và các ngoại lệ tùy chỉnh, hoàn toàn độc lập với các thư viện bên thứ ba.
- **Tầng Application**: Xử lý logic nghiệp vụ theo mô hình CQRS (Commands, Queries), chuyển đổi DTO và các pipeline xác thực dữ liệu đầu vào.
- **Tầng Infrastructure**: Cấu hình EF Core DbContext, trình điều khiển kết nối PostgreSQL, Redis client adapter, MailKit SMTP transport và các tiến trình nền định kỳ.
- **Tầng API Presentation**: Các RESTful endpoints, SignalR hubs, tài liệu chuẩn hóa Swagger/OpenAPI và middleware bắt lỗi toàn cục.

### 3.2 Tự động hóa Dấu vết Kiểm toán & Bộ lọc Xóa mềm Toàn cục
Trong các dự án thi công xây dựng, tính minh bạch và khả năng truy vết dữ liệu là bắt buộc nhằm phục vụ công tác thanh quyết toán và giải quyết tranh chấp. Tôi đã triển khai các interceptor chuyên biệt trên DbContext của EF Core:

1. **Audit Trail Interceptor Tự động**:
   Khi hàm `SaveChangesAsync` được kích hoạt, interceptor tự động quét các thực thể kế thừa giao diện `IAuditableEntity`:
   - Gán `CreatedAtUtc` và `CreatedByUserId` khi bản ghi được tạo mới.
   - Cập nhật `UpdatedAtUtc` và `UpdatedByUserId` khi bản ghi có sự thay đổi.
2. **Global Soft-Delete Query Filters**:
   Việc xóa nhầm một khu vực đo đạc hay nhật ký thiết bị có thể làm sai lệch báo cáo tài chính dự án. Tất cả thực thể kế thừa `ISoftDeletable` đều chứa cờ `IsDeleted`:
   ```csharp
   // Cấu hình Global Query Filter trong EF Core OnModelCreating
   modelBuilder.Entity<ConstructionPlan>()
       .HasQueryFilter(p => !p.IsDeleted);
   ```
   Toàn bộ câu truy vấn LINQ trên hệ thống tự động loại trừ các bản ghi đã xóa mềm. Trong trường hợp cần đối soát hoặc khôi phục dữ liệu, quy trình nội bộ có thể chủ động sử dụng `.IgnoreQueryFilters()`.

---

## 4. Kiểm soát Đồng thời: Cơ chế Plan Edit Lock

### 4.1 Thách thức Nghiệp vụ Thực tế
Một bản kế hoạch san lấp mặt bằng bao gồm các chỉ tiêu cao độ, phân bổ thiết bị cơ giới, định mức nhân công và mốc thời gian hoàn thành giữa nhiều phân khu phụ thuộc lẫn nhau. Khi hai kỹ sư điều độ cùng mở và sửa một kế hoạch tại cùng một thời điểm, cơ chế ghi đè cuối cùng (last-write-wins) sẽ âm thầm hủy hoại dữ liệu phân bổ máy móc, gây gián đoạn thi công nghiêm trọng tại hiện trường.

Vì việc tính toán và tinh chỉnh kế hoạch san lấp thường kéo dài từ 5 đến 30 phút, phương thức khóa lạc quan (Optimistic Concurrency với `RowVersion`) tạo ra sự ức chế rất lớn: kỹ sư hiện trường có thể dành 20 phút tính toán khối lượng đào đắp nhưng lại bị hệ thống từ chối lưu dữ liệu ở lần bấm nút cuối cùng.

### 4.2 Kiến trúc Khóa Bi quan Phân tán (Pessimistic Lease)
Để khắc phục triệt để vấn đề này, tôi đã thiết kế giải pháp **Pessimistic Distributed Lease**:

1. **Chiếm quyền Khóa (Lock Acquisition)**:
   Trước khi chuyển sang trạng thái chỉnh sửa, client gửi yêu cầu xin cấp quyền khóa cho `PlanId` chỉ định. Backend kiểm tra đảm bảo không có phiên khóa nào khác đang còn hiệu lực.
2. **Cấp Token & Thời hạn Khóa**:
   Khi cấp quyền thành công, một bản ghi `PlanEditLock` được ghi nhận với:
   - `PlanId` (Định danh kế hoạch)
   - `LockedByUserId` & `LockedByUserName` (Thông tin người đang giữ khóa)
   - `LockedAtUtc` (Thời điểm bắt đầu khóa)
   - `ExpiresAtUtc` (Thời hạn hết hạn, mặc định 2 phút kể từ lúc cấp)
   - `LockToken` (Chuỗi GUID bảo mật bắt buộc phải đính kèm trong các thao tác lưu dữ liệu)
3. **Gia hạn Khóa Tự động qua Nhịp tim (Heartbeat)**:
   Trong suốt thời gian kỹ sư thao tác trên màn hình, ứng dụng Vue 3 tự động gửi yêu cầu kiểm tra nhịp tim mỗi 60 giây (`POST /api/plans/{id}/heartbeat`). Máy chủ kiểm tra token và gia hạn `ExpiresAtUtc` thêm 2 phút.
4. **Giải phóng Khóa Chủ động**:
   Khi kỹ sư nhấn lưu kế hoạch hoặc rời khỏi màn hình chỉnh sửa, client phát lệnh `POST /api/plans/{id}/release-lock`, ngay lập tức giải phóng tài nguyên cho các đồng nghiệp khác.

### 4.3 Dịch vụ Nền Định kỳ Thu hồi Khóa (Background Cleanup Hosted Service)
Để giải quyết tình huống kỹ sư bị mất kết nối mạng ngoài công trường, gập màn hình máy tính đột ngột hoặc tắt trình duyệt, tôi đã phát triển tiến trình nền `PlanLockCleanupHostedService` chạy lặp định kỳ mỗi 30 giây:

```csharp
public class PlanLockCleanupHostedService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<PlanLockCleanupHostedService> _logger;

    public PlanLockCleanupHostedService(
        IServiceProvider serviceProvider,
        ILogger<PlanLockCleanupHostedService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _serviceProvider.CreateScope();
                var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                var hubContext = scope.ServiceProvider.GetRequiredService<IHubContext<PlanNotificationHub>>();

                var now = DateTime.UtcNow;
                var expiredLocks = await dbContext.PlanEditLocks
                    .Where(l => l.ExpiresAtUtc < now)
                    .ToListAsync(stoppingToken);

                if (expiredLocks.Count > 0)
                {
                    dbContext.PlanEditLocks.RemoveRange(expiredLocks);
                    await dbContext.SaveChangesAsync(stoppingToken);

                    foreach (var lockItem in expiredLocks)
                    {
                        await hubContext.Clients.Group($"Plan_{lockItem.PlanId}")
                            .SendAsync("PlanLockReleased", new { planId = lockItem.PlanId, reason = "Expired" }, stoppingToken);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi xảy ra trong chu kỳ dọn dẹp các khóa kế hoạch hết hạn.");
            }

            await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
        }
    }
}
```

Cơ chế hai lớp này vừa đảm bảo khóa được giải phóng tức thì khi người dùng hoàn tất công việc, vừa tự động giải phóng tài nguyên trong vòng 30–60 giây nếu có sự cố mất kết nối mạng.

---

## 5. Bộ nhớ Đệm Phân tán & Đồng bộ Hóa Thời gian Thực

### 5.1 Bộ nhớ Đệm Phân tán Redis (Distributed Caching)
Bảng thông tin điều độ thi công được các đội thợ, chỉ huy công trường và ban giám đốc truy vấn hàng chục lần mỗi giờ. Việc tổng hợp thể tích đào đắp qua nhiều phân khu cùng hiệu suất nhiên liệu từ các bảng PostgreSQL đòi hỏi chi phí tính toán lớn:
- **Chiến lược Cache-Aside**: Dữ liệu tổng hợp tiến độ và các chỉ số thống kê được lưu đệm trong Redis với thời gian trượt (sliding TTL) 5 phút.
- **Hủy đệm có Chủ đích (Targeted Invalidation)**: Khi kỹ sư hiện trường nộp nhật ký thi công mới hoặc cập nhật tọa độ trắc địa, các sự kiện domain sẽ chủ động xóa bộ đệm của dự án và giai đoạn tương ứng, duy trì tốc độ phản hồi dưới 50ms mà không lo dữ liệu bị sai lệch.

### 5.2 Đồng bộ Thời gian thực qua SignalR
Sự phối hợp ngoài công trường đòi hỏi phản hồi tức thì mà không cần trình duyệt phải liên tục thăm dò (polling):
- **Cập nhật Trạng thái Khóa Tức thời**: Khi kỹ sư A chiếm hoặc nhả khóa một kế hoạch, toàn bộ các chỉ huy công trường đang xem kế hoạch đó sẽ nhận được sự kiện SignalR chỉ sau vài mili-giây, giao diện tự động chuyển sang chế độ Chỉ đọc kèm tên kỹ sư đang thao tác.
- **Cảnh báo Khẩn cấp**: Các sự cố an toàn lao động hoặc hư hỏng thiết bị nặng được phát ngay lập tức lên màn hình điều hành và tự động gửi email thông báo qua tiến trình chạy nền sử dụng **MailKit**.

---

## 6. Cảnh báo Bảo mật & Giới hạn Truy cập Kho Mã nguồn

:::note Cảnh báo Bảo mật & Bản quyền Dữ liệu
**Hạn chế Liên kết Kho Mã nguồn**: Các liên kết trực tiếp dẫn đến Git repository tạm thời được hạn chế nhằm phục vụ quy trình làm sạch lịch sử commit, loại bỏ các chứng thư bảo mật cũ và bảo vệ dữ liệu nội bộ của tổ chức.

Toàn bộ các mô hình kiến trúc, thiết kế cơ sở dữ liệu và giải pháp kỹ thuật trình bày trong bài phân tích này là thành quả lao động độc lập của tác giả và được công bố phục vụ mục đích thẩm định chuyên môn.
:::

---

## 7. Kết quả Đạt được & Bài học Kỹ thuật

### Kết quả Đo lường được
- **Loại bỏ 100% Xung đột Dữ liệu**: Không ghi nhận bất kỳ sự cố ghi đè kế hoạch hay mất mát dữ liệu nào trong suốt hơn 40 giai đoạn thi công thực tế.
- **Hiệu năng & Tốc độ Phản hồi Vượt trội**: Đạt độ trễ P95 dưới 50ms cho các truy vấn xem tiến độ dự án nhờ giảm tải triệt để cho cơ sở dữ liệu qua bộ đệm phân tán Redis.
- **Khả năng Phục hồi Cao ngoài Hiện trường**: Vận hành trơn tru ngay cả trong điều kiện mạng chập chờn nhờ cơ chế timeout xác định và tiến trình nền tự động dọn dẹp khóa.

### Bài học Kỹ thuật Cốt lõi
> *"Trong các ứng dụng web thông thường, khóa lạc quan (optimistic concurrency) thường được ưu tiên. Tuy nhiên, trong các hệ thống phần mềm điều hành kỹ thuật và công trường thực tế — nơi một tác vụ đòi hỏi 20 phút tính toán phức tạp và ảnh hưởng trực tiếp đến hàng triệu USD giá trị máy móc cơ giới — cơ chế khóa bi quan phân tán (pessimistic lease) với thông báo trực quan và nhịp tim tự động lại mang lại độ tin cậy và trải nghiệm vận hành vượt trội hơn rất nhiều."*
