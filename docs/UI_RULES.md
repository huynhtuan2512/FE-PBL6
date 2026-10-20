# Quy chuẩn giao diện frontend

Tài liệu này là quy chuẩn bắt buộc cho mọi thay đổi giao diện trong frontend `FE-internal`. Áp dụng cho trang mới, chỉnh sửa trang, component, CSS và nội dung hiển thị. Khi yêu cầu nghiệp vụ bắt buộc khác quy chuẩn, phải ghi rõ lý do trong pull request hoặc mô tả bàn giao và giới hạn ngoại lệ ở đúng phạm vi cần thiết.

## 1. Nguyên tắc sản phẩm

- Thiết kế phục vụ công việc thực tế của nhân viên sảnh, bếp, thu ngân và quản trị viên. Ưu tiên thông tin cần quyết định và thao tác tiếp theo.
- Giữ nguyên hành vi nghiệp vụ, route, quyền truy cập, trạng thái API và phản hồi backend khi chỉ thực hiện thay đổi giao diện.
- Không trình bày dữ liệu demo như dữ liệu trực tiếp. Nội dung demo phải có nhãn nhìn thấy được; thao tác demo phải nói rõ là mô phỏng và không được báo thành công như thể backend đã thực hiện.
- Không khẳng định thao tác đã hoàn tất nếu API chưa xác nhận. Với chức năng chưa được backend hỗ trợ, nêu rõ giới hạn và không tạo phản hồi gây hiểu nhầm.
- Mỗi màn hình phải có thứ bậc thị giác rõ: tiêu đề trang, nội dung chính, thao tác chính và trạng thái cần chú ý.

## 2. Layout và bố cục

- Dùng layout ứng dụng hiện có: sidebar cho điều hướng chính, topbar cho ngữ cảnh và thao tác toàn cục, vùng nội dung cho công việc của trang. Chỉ thêm vùng điều hướng mới khi có yêu cầu nghiệp vụ rõ ràng.
- Giữ nội dung trong một vùng đọc và thao tác hợp lý; dùng lưới theo nhu cầu nội dung, không thêm cột chỉ để lấp khoảng trống.
- Dashboard ưu tiên tóm tắt trạng thái, cảnh báo và các tác vụ tiếp theo. Staff ưu tiên luồng bàn, bếp và thu ngân. Admin ưu tiên danh sách dữ liệu, bộ lọc và thao tác quản lý.
- Không đặt thành phần cố định hoặc sticky che nội dung, thông báo lỗi, điều khiển đang được focus hay hành động chính.
- Giữ nhịp khoảng cách nhất quán theo token hiện hành. Không tự tạo giá trị spacing cục bộ khi token phù hợp đã có.

## 3. Card, panel và phân cấp thông tin

- Chỉ dùng card/panel khi cần nhóm nội dung có quan hệ hoặc tạo vùng thao tác riêng. Nội dung đơn giản không cần bọc card chỉ để tăng số lượng khối.
- Một card có một tiêu đề mô tả đúng nội dung; phần phụ trợ không được cạnh tranh với tiêu đề hoặc hành động chính.
- Dùng cùng quy tắc về padding, viền, radius và shadow từ token. Không thêm gradient, glow, shadow lớn hoặc hiệu ứng hover chỉ để trang trí.
- Không dùng màu sắc hoặc biểu tượng làm tín hiệu duy nhất cho trạng thái; phải có nhãn văn bản.

## 4. Button và thao tác

- Mỗi vùng giao diện chỉ nên có một hành động chính nổi bật. Hành động phụ dùng kiểu ít nhấn hơn; hành động phá huỷ hoặc nguy hiểm phải được phân biệt rõ.
- Nhãn nút bắt đầu bằng động từ và nêu kết quả, ví dụ: “Tạo tài khoản”, “Lưu món”, “Thử lại”. Tránh nhãn mơ hồ như “OK”, “Xác nhận” nếu không có ngữ cảnh.
- Mỗi nút phải có hành vi xác định. Nút chưa khả dụng phải disabled kèm lý do gần nút hoặc giải thích truy cập được; không để nút trông hoạt động nhưng không làm gì.
- Khi đang gửi yêu cầu, khóa thao tác lặp phù hợp, thể hiện trạng thái đang xử lý và tránh thông báo thành công trước khi nhận kết quả.
- Thao tác phá huỷ, khó đảo ngược hoặc ảnh hưởng vận hành cần xác nhận rõ đối tượng và hệ quả. Nút dừng khẩn cấp chỉ được mô tả là đã dừng khi hệ thống thực sự xác nhận.
- Không dùng animation nhấp nháy hoặc pulse liên tục để thu hút chú ý. Chỉ nhấn mạnh cảnh báo đang hoạt động khi có nhu cầu vận hành thực sự và vẫn giữ nội dung dễ đọc.

## 5. Table và danh sách dữ liệu

- Dùng bảng khi người dùng cần so sánh thuộc tính giữa nhiều bản ghi. Dùng danh sách/card khi mỗi bản ghi có nội dung dài hoặc cần thao tác theo ngữ cảnh.
- Cột phải có tiêu đề dễ hiểu; giá trị dùng cùng định dạng trong toàn bảng. Sắp xếp thứ tự cột theo mức độ quan trọng của tác vụ.
- Gắn nhãn trạng thái bằng chữ và giữ màu theo cùng ngữ nghĩa trên mọi trang. Không dùng màu hoặc icon thay cho giá trị trạng thái.
- Hàng hoặc bản ghi có thao tác phải thể hiện rõ vùng kích hoạt; nút icon-only cần accessible name phù hợp với bản ghi.
- Trên màn hình hẹp, ưu tiên cuộn ngang có nhận biết, ẩn cột ít quan trọng có chủ đích hoặc trình bày dạng danh sách thích ứng. Không làm mất dữ liệu quan trọng hoặc thao tác duy nhất.
- Hiển thị trạng thái tải, lỗi, rỗng và có dữ liệu một cách riêng biệt. Giữ tiêu đề cột và ngữ cảnh khi danh sách rỗng hoặc lỗi.

## 6. Form và nhập liệu

- Mỗi trường có label hiển thị gắn đúng với input. Placeholder chỉ minh hoạ định dạng hoặc ví dụ, không thay thế label.
- Nêu rõ trường bắt buộc, tùy chọn, định dạng và giới hạn có ý nghĩa. Dùng kiểu input phù hợp để hỗ trợ bàn phím và autofill.
- Kiểm tra dữ liệu tại nơi nhập để phản hồi sớm, đồng thời vẫn xử lý lỗi backend. Không tự suy diễn lỗi thành công hoặc loại bỏ dữ liệu người dùng khi request thất bại.
- Lỗi phải gắn với trường liên quan khi có thể, dùng ngôn ngữ rõ ràng và hướng dẫn cách sửa. Không chỉ đổi màu viền để báo lỗi.
- Khi gửi thất bại, giữ lại dữ liệu đã nhập. Nút gửi có nhãn và trạng thái đang xử lý nhất quán.
- Dùng component form hiện có hoặc của UI library đã được dự án chính thức chấp thuận. Không tạo bộ style/validation song song cho từng trang.

## 7. Modal và overlay

- Chỉ dùng modal cho tác vụ ngắn, cần giữ ngữ cảnh trang; tác vụ dài hoặc nhiều bước nên cân nhắc trang riêng.
- Modal có tiêu đề mô tả mục đích, nút đóng có accessible name và hành động chính/phụ được đặt nhất quán.
- Khi mở modal, chuyển focus vào vùng phù hợp; giữ focus trong modal, hỗ trợ đóng bằng Escape nếu không có lý do nghiệp vụ ngăn cản, và trả focus về phần tử đã mở modal.
- Không đóng modal hoặc làm mất dữ liệu nhập do click backdrop ngoài ý muốn. Nếu đóng sẽ bỏ dữ liệu chưa lưu, phải xác nhận hoặc cảnh báo thích hợp.
- Trên viewport thấp/hẹp, nội dung modal phải cuộn được; header hoặc nút hành động không được che khuất trường đang dùng.
- Xác nhận riêng cho thao tác phá huỷ hoặc không thể hoàn tác; không yêu cầu xác nhận cho mọi thao tác thông thường.

## 8. Icon

- Dùng Phosphor (`@phosphor-icons/react`) làm bộ icon hiện hành để duy trì phong cách thống nhất.
- Không trộn thư viện icon mới hoặc tự thay icon library trong một thay đổi giao diện thông thường. Việc đổi thư viện cần được phê duyệt như thay đổi nền tảng.
- Chọn icon theo nghĩa nghiệp vụ, không dùng icon trang trí thay cho nhãn. Icon đứng cạnh chữ thường là bổ trợ; icon điều khiển độc lập phải có tên truy cập được.
- Duy trì kích thước, độ dày nét và căn chỉnh nhất quán theo vai trò; không dùng emoji làm icon điều hướng, trạng thái hoặc điều khiển.

## 9. Nội dung giao diện và trạng thái

### Tiêu đề và nhãn

- Viết nội dung giao diện bằng tiếng Việt tự nhiên, nhất quán. Chỉ giữ thuật ngữ tiếng Anh khi đó là tên nghiệp vụ, trạng thái backend cần đối chiếu hoặc từ chuyên môn người dùng thực sự sử dụng.
- Tiêu đề trang nêu công việc hoặc khu vực, không dùng khẩu hiệu. Tiêu đề section ngắn, mô tả đúng nội dung bên dưới.
- Tránh viết hoa toàn bộ cho câu/nội dung dài. Mã trạng thái kỹ thuật có thể giữ nguyên khi cần đối chiếu; nên kèm nhãn dễ hiểu nếu mã không hiển nhiên với người dùng.

### Lỗi, empty state và tải dữ liệu

- Lỗi nêu việc gì không thực hiện được, nguyên nhân nếu biết và hành động tiếp theo khi có thể. Không đưa stack trace, token, nội dung nhạy cảm hoặc thông tin nội bộ vào UI.
- Empty state mô tả đúng việc không có dữ liệu, giữ ngữ cảnh của khu vực và chỉ đưa CTA khi có hành động phù hợp.
- Loading phải gắn với vùng dữ liệu đang tải; tránh thay toàn trang bằng spinner nếu phần còn lại vẫn dùng được.
- Khi mất kết nối hoặc polling thất bại, không trình bày dữ liệu cũ như mới cập nhật. Nếu vẫn giữ dữ liệu cũ để người dùng tham chiếu, chỉ rõ thời điểm cập nhật gần nhất và trạng thái kết nối.

### Trạng thái nghiệp vụ

- Dùng một ánh xạ ngữ nghĩa thống nhất cho trạng thái như đang xử lý, hoàn tất, lỗi, cảnh báo, ngoại tuyến và demo; cùng một trạng thái phải giữ cùng màu/nhãn trên mọi trang.
- Phân biệt trạng thái robot, đơn hàng, món, tài khoản và kết nối; không dùng cùng badge nếu ý nghĩa khác nhau.
- Trạng thái phải lấy từ dữ liệu thực của nguồn tương ứng. Dữ liệu mô phỏng phải được đánh dấu rõ; không trộn dữ liệu giả và thật mà không phân biệt.
- Thông báo toast dùng cho kết quả ngắn hạn; lỗi cần người dùng sửa hoặc lưu ý lâu hơn phải hiển thị gần vùng liên quan, không chỉ thoáng qua.

## 10. Hành vi cần tránh để hạn chế “AI slop”

Không áp dụng các cách dưới đây khi chúng không giải quyết nhu cầu sử dụng cụ thể:

- Dashboard đại trà với mọi số liệu được biến thành card, biểu đồ hoặc KPI dù không giúp quyết định vận hành.
- Gradient, nền phát sáng, glassmorphism, viền neon, shadow nặng, badge trang trí và nhiều màu nhấn cùng lúc.
- Cụm eyebrow/nhãn viết hoa kiểu kỹ thuật lặp lại trên mọi khối, breadcrumb giả, trạng thái “LIVE” tĩnh hoặc số liệu không có nguồn xác thực.
- Chuyển động lặp, rung, nhấp nháy, parallax hoặc hiệu ứng vào trang ảnh hưởng khả năng đọc và tốc độ thao tác.
- Placeholder giả làm dữ liệu thật; nút không có chức năng; thông báo xác nhận hành động mà backend chưa thực hiện.
- Emoji làm icon hệ thống; icon-only không nhãn; màu sắc là dấu hiệu duy nhất cho trạng thái.
- Nội dung chung chung như “Có lỗi xảy ra” khi đã có thông tin lỗi an toàn và hành động khắc phục cụ thể.
- Tạo abstraction hoặc component tổng quát chỉ để tái sử dụng một lần, hoặc nhân bản cùng một mẫu giao diện vào nhiều file.

Thành phần trang trí hoặc hiệu ứng không bị cấm tuyệt đối: chỉ giữ khi có mục đích rõ, không làm giảm khả năng đọc/thao tác, và được kiểm tra với reduced motion.

## 11. Responsive

- Giao diện không được tràn ngang toàn trang ở viewport rộng từ `320px` trở lên. Bảng dữ liệu có thể cuộn ngang trong vùng bảng nếu đó là cách bảo toàn dữ liệu phù hợp nhất.
- Dùng breakpoint tập trung của dự án; không thêm breakpoint riêng cho một component nếu layout hiện có giải quyết được bằng grid/flex thích ứng.
- Sidebar, điều hướng, form, modal, bảng và thao tác chính phải dùng được trên màn hình hẹp. Menu mobile cần mở, đóng và không che nội dung khi đang đóng.
- Không cắt cụt tiêu đề/nút quan trọng; nội dung dài phải xuống dòng hoặc có cách xem đầy đủ.
- Kiểm tra tối thiểu tại chiều rộng `375px`, `760px`, `1100px` và màn hình desktop; thêm kiểm tra chiều cao thấp cho modal hoặc trang có nhiều nội dung.

## 12. Accessibility

- Điều khiển tương tác dùng phần tử HTML có ngữ nghĩa phù hợp; hỗ trợ thao tác bàn phím và có focus indicator dễ nhận biết.
- Mọi input có label; mọi nút icon-only có accessible name; trạng thái như disabled, expanded, selected phải được biểu đạt bằng thuộc tính phù hợp khi áp dụng.
- Nội dung lỗi quan trọng được công bố cho công nghệ hỗ trợ (ví dụ `role="alert"` phù hợp); cập nhật trạng thái không chỉ dựa vào màu hoặc animation.
- Đảm bảo tương phản tối thiểu WCAG 2.2 AA: `4.5:1` cho chữ thường, `3:1` cho chữ lớn và thành phần đồ hoạ/điều khiển cần nhận biết.
- Mục tiêu tương tác tối thiểu `44 × 44 CSS px` khi có thể; nếu bố cục nghiệp vụ bắt buộc nhỏ hơn, tăng vùng hit hoặc tạo khoảng cách để tránh bấm nhầm.
- Tôn trọng `prefers-reduced-motion`; không phụ thuộc chuyển động để truyền trạng thái hoặc hoàn thành tác vụ.
- Dialog phải có tên truy cập được và quản lý focus đúng; thứ tự focus phải theo thứ tự đọc hợp lý.

## 13. Token và UI library

- Token chính thức của dự án là nguồn duy nhất cho màu, typography, spacing, radius, shadow, kích thước control và breakpoint. Trước khi một token được chính thức tạo/cập nhật, không tự ý phát minh token cục bộ hoặc tạo bộ biến tương đương.
- Dùng token có sẵn thay vì hardcode giá trị ở component hoặc thêm biến CSS trùng nghĩa. Ngoại lệ chỉ dành cho giá trị dữ liệu động hoặc giá trị cần thiết không thuộc ngôn ngữ thiết kế; phải giữ trong phạm vi nhỏ và nêu lý do.
- Không thay đổi token để “vừa mắt” riêng một trang. Điều chỉnh token là thay đổi dùng chung, cần rà soát ảnh hưởng toàn ứng dụng.
- Ant Design là UI library chính thức của frontend. Ưu tiên component có sẵn và theme/token qua `ConfigProvider`; không thêm UI library thứ hai hoặc dựng lại component tương đương bằng CSS riêng khi AntD đáp ứng yêu cầu.
- Theme Ant Design và CSS custom properties phải lấy từ nguồn token tập trung của dự án. Không ghi đè token riêng trong từng trang hoặc component.
- Tiếp tục dùng cấu trúc component theo tính năng hiện có. Trích component dùng chung khi có ít nhất hai nơi dùng cùng hành vi/markup hoặc khi component tạo ranh giới nghiệp vụ rõ. Không gom các khu vực chỉ giống bề ngoài nhưng có hành vi khác nhau.
- Tách dữ liệu/API và trình bày theo pattern hiện tại: tái sử dụng service/hook cho dữ liệu; component không tự gọi endpoint lặp lại nếu đã có service phù hợp.

## 14. Tiêu chí kiểm tra tuân thủ

Trước khi bàn giao mỗi thay đổi frontend, xác nhận tất cả mục áp dụng:

- [ ] Thay đổi phục vụ một tác vụ/ngữ cảnh nghiệp vụ xác định; không thêm thành phần chỉ để trang trí.
- [ ] Route, quyền, API, callback và trạng thái nghiệp vụ hiện có được giữ nguyên nếu không nằm trong phạm vi được duyệt.
- [ ] Không có dữ liệu demo hoặc mô phỏng bị trình bày như dữ liệu thật.
- [ ] Có hierarchy rõ; chỉ có hành động chính cần thiết và mọi nút đều có hành vi/disabled state giải thích được.
- [ ] Form có label; lỗi, tải, rỗng và kết quả thành công được phân biệt, có nội dung hành động được.
- [ ] Trạng thái không chỉ dựa vào màu; icon-only có accessible name.
- [ ] Không tạo token/breakpoint/UI library mới trùng hoặc cạnh tranh với nguồn chính thức.
- [ ] Component mới được tái sử dụng khi có nhu cầu thực; không sao chép mẫu giao diện hoặc logic sẵn có.
- [ ] Responsive được kiểm tra tại `375px`, `760px`, `1100px` và desktop; không có tràn trang ngoài vùng cuộn chủ đích.
- [ ] Có thể thao tác bằng bàn phím; focus nhìn thấy được; dialog và thông báo quan trọng truy cập được.
- [ ] Đạt kiểm tra tương phản WCAG 2.2 AA cho màu và trạng thái mới; animation tôn trọng reduced motion.
- [ ] Build/lint/test hiện có phù hợp với phạm vi thay đổi được chạy; ghi rõ lệnh và kết quả khi bàn giao.

Nếu một mục không áp dụng, nêu lý do ngắn gọn khi bàn giao. Ngoại lệ đã được chấp thuận không tự động trở thành quy tắc cho các trang khác.
