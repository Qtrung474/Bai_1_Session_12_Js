const TICKET_STATUS = {
    BOOKED: "BOOKED",
    CHECKED_IN: "CHECKED_IN",
    CANCELLED: "CANCELLED"
};

const BAGGAGE_ALLOWANCE = {
    ECONOMY: 20,
    BUSINESS: 30
};

const EXCESS_BAGGAGE_RATE = 50000;

const flightTickets = [
    {
        pnr: "VN101",
        passengerName: "Nguyen Van A",
        seatNumber: "12A",
        flightNumber: "VN210",
        ticketClass: "ECONOMY",
        status: TICKET_STATUS.BOOKED,
        baggageWeight: 0,
        excessFee: 0
    },
    {
        pnr: "VN102",
        passengerName: "Tran Thi B",
        seatNumber: "02C",
        flightNumber: "VN210",
        ticketClass: "BUSINESS",
        status: TICKET_STATUS.BOOKED,
        baggageWeight: 0,
        excessFee: 0
    },
    {
        pnr: "VN103",
        passengerName: "Le Van C",
        seatNumber: "15D",
        flightNumber: "VN210",
        ticketClass: "ECONOMY",
        status: TICKET_STATUS.CHECKED_IN,
        baggageWeight: 22,
        excessFee: 100000
    },
    {
        pnr: "VN104",
        passengerName: "Pham Thi D",
        seatNumber: "18F",
        flightNumber: "VN210",
        ticketClass: "ECONOMY",
        status: TICKET_STATUS.CANCELLED,
        baggageWeight: 0,
        excessFee: 0
    }
];

function formatCurrency(amount) {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

function findTicketByPnr(pnr) {
    if (!pnr) return null;
    const cleanPnr = pnr.trim().toUpperCase();
    return flightTickets.find(ticket => ticket.pnr.toUpperCase() === cleanPnr) || null;
}

function calculateExcessBaggageFee(ticketClass, weight) {
    const allowance = BAGGAGE_ALLOWANCE[ticketClass] || 0;
    if (weight > allowance) {
        return (weight - allowance) * EXCESS_BAGGAGE_RATE;
    }
    return 0;
}

function displayBoardingPass(ticket) {
    console.log("\n========================================================");
    console.log("                  THẺ LÊN TÀU BAY (BOARDING PASS)        ");
    console.log("========================================================");
    console.log(` Hành khách (Passenger) : ${ticket.passengerName}`);
    console.log(` Chuyến bay (Flight)    : ${ticket.flightNumber}`);
    console.log(` Ghế ngồi (Seat)        : ${ticket.seatNumber}`);
    console.log(` Hạng vé (Class)        : ${ticket.ticketClass}`);
    console.log(` Mã đặt chỗ (PNR)       : ${ticket.pnr}`);
    console.log(` Hành lý (Baggage)      : ${ticket.baggageWeight} kg`);
    if (ticket.excessFee > 0) {
        console.log(` Phụ cước hành lý       : ${formatCurrency(ticket.excessFee)}`);
    }
    console.log("--------------------------------------------------------");
    console.log(" Chúc Quý khách một chuyến bay an toàn và tốt đẹp!");
    console.log("========================================================\n");
}

function listTickets() {
    console.log("\n--- DANH SÁCH VÉ CHUYẾN BAY ---");
    const displayData = flightTickets.map(t => ({
        "PNR": t.pnr,
        "Hành khách": t.passengerName,
        "Chuyến bay": t.flightNumber,
        "Ghế": t.seatNumber,
        "Hạng": t.ticketClass,
        "Hành lý (kg)": t.baggageWeight,
        "Phụ thu": formatCurrency(t.excessFee),
        "Trạng thái": t.status
    }));
    console.table(displayData);
}

function checkIn() {
    const pnrInput = prompt("Nhập mã đặt chỗ PNR cần làm thủ tục check-in:");
    if (!pnrInput) {
        alert("Thao tác bị hủy: Mã PNR không được để trống!");
        return;
    }

    const ticket = findTicketByPnr(pnrInput);
    if (!ticket) {
        alert(`Lỗi: Không tìm thấy vé với mã PNR "${pnrInput.trim().toUpperCase()}".`);
        return;
    }

    if (ticket.status === TICKET_STATUS.CHECKED_IN) {
        alert(`Vé mã [${ticket.pnr}] đã hoàn tất thủ tục trước đó.`);
        return;
    }

    if (ticket.status === TICKET_STATUS.CANCELLED) {
        alert(`Vé mã [${ticket.pnr}] đã bị HỦY. Không thể làm thủ tục.`);
        return;
    }

    const weightInput = prompt(
        `Thông tin vé: ${ticket.passengerName} | Hạng: ${ticket.ticketClass}\n` +
        `Định mức miễn cước: ${BAGGAGE_ALLOWANCE[ticket.ticketClass]} kg\n` +
        `Nhập trọng lượng hành lý ký gửi (kg):`,
        "0"
    );

    if (weightInput === null) {
        alert("Đã hủy quy trình check-in.");
        return;
    }

    const weight = parseFloat(weightInput);
    if (isNaN(weight) || weight < 0) {
        alert("Lỗi: Khối lượng hành lý nhập vào không hợp lệ (phải là số >= 0).");
        return;
    }

    const excessFee = calculateExcessBaggageFee(ticket.ticketClass, weight);

    if (excessFee > 0) {
        const excessKg = weight - BAGGAGE_ALLOWANCE[ticket.ticketClass];
        const confirmPayment = confirm(
            `Hành lý quá cước: ${excessKg} kg.\n` +
            `Phí phụ thu: ${formatCurrency(excessFee)}.\n` +
            `Xác nhận thu tiền và tiếp tục xuất thẻ lên tàu?`
        );
        if (!confirmPayment) {
            alert("Quy trình check-in bị tạm hoãn do chưa thanh toán phụ thu.");
            return;
        }
    }

    ticket.baggageWeight = weight;
    ticket.excessFee = excessFee;
    ticket.status = TICKET_STATUS.CHECKED_IN;

    alert(`Check-in thành công cho hành khách ${ticket.passengerName}!`);
    displayBoardingPass(ticket);
}

function searchTicket() {
    const keyword = prompt("Nhập mã PNR hoặc tên hành khách cần tra cứu:");
    if (!keyword) {
        alert("Từ khóa tìm kiếm không được rỗng!");
        return;
    }

    const cleanKeyword = keyword.trim().toLowerCase();
    const results = flightTickets.filter(t =>
        t.pnr.toLowerCase().includes(cleanKeyword) ||
        t.passengerName.toLowerCase().includes(cleanKeyword)
    );

    if (results.length === 0) {
        alert(`Không tìm thấy kết quả nào khớp với "${keyword}".`);
        return;
    }

    console.log(`\n--- KẾT QUẢ TÌM KIẾM CHO: "${keyword}" ---`);
    console.table(results.map(t => ({
        "PNR": t.pnr,
        "Hành khách": t.passengerName,
        "Ghế": t.seatNumber,
        "Hạng": t.ticketClass,
        "Trạng thái": t.status,
        "Hành lý": `${t.baggageWeight} kg`,
        "Phụ thu": formatCurrency(t.excessFee)
    })));
}

function cancelTicket() {
    const pnrInput = prompt("Nhập mã PNR của vé cần hủy:");
    if (!pnrInput) {
        alert("Mã PNR không được để trống!");
        return;
    }

    const ticket = findTicketByPnr(pnrInput);
    if (!ticket) {
        alert(`Không tìm thấy vé có mã [${pnrInput.trim().toUpperCase()}].`);
        return;
    }

    if (ticket.status === TICKET_STATUS.CANCELLED) {
        alert(`Vé [${ticket.pnr}] hiện đã ở trạng thái CANCELLED.`);
        return;
    }

    const confirmCancel = confirm(
        `Xác nhận hủy vé của khách hàng: ${ticket.passengerName} (PNR: ${ticket.pnr})?\n` +
        `Trạng thái hiện tại: ${ticket.status}`
    );

    if (confirmCancel) {
        ticket.status = TICKET_STATUS.CANCELLED;
        ticket.baggageWeight = 0;
        ticket.excessFee = 0;
        alert(`Đã hủy vé thành công cho mã PNR: ${ticket.pnr}`);
    } else {
        alert("Đã hủy thao tác.");
    }
}

function main() {
    let running = true;

    do {
        const menuPrompt = 
            "==========================================\n" +
            "    HỆ THỐNG QUẦY CHECK-IN SÂN BAY        \n" +
            "==========================================\n" +
            "1. Hiển thị danh sách vé chuyến bay\n" +
            "2. Tiếp nhận check-in, cân hành lý & thu phí\n" +
            "3. Tra cứu vé theo mã PNR / Tên hành khách\n" +
            "4. Hủy vé theo yêu cầu\n" +
            "5. Thoát ca làm việc\n" +
            "------------------------------------------\n" +
            "Vui lòng nhập lựa chọn của bạn (1-5):";

        const choice = prompt(menuPrompt);

        if (choice === null) {
            const confirmExit = confirm("Bạn có chắc chắn muốn kết thúc ca làm việc?");
            if (confirmExit) {
                running = false;
                break;
            } else {
                continue;
            }
        }

        switch (choice.trim()) {
            case "1":
                listTickets();
                break;
            case "2":
                checkIn();
                break;
            case "3":
                searchTicket();
                break;
            case "4":
                cancelTicket();
                break;
            case "5":
                alert("Kết thúc ca làm việc. Đang lưu trạng thái và đóng hệ thống...");
                running = false;
                break;
            default:
                alert("Lựa chọn không hợp lệ! Vui lòng chỉ nhập các số từ 1 đến 5.");
                break;
        }
    } while (running);

    console.log("Hệ thống đã dừng hoạt động.");
}

main();