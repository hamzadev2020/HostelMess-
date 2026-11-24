// Client-side LocalStorage Database & API Service
// Enables 100% standalone frontend deployment on GitHub Pages, Vercel, or Netlify without needing any backend server!

const STORAGE_KEY = 'hostel_mess_db_v1';

// Initial realistic default data
const defaultInitialData = {
  settings: {
    messName: "Greenwood Hostel Mess",
    ownerName: "Rajesh Sharma",
    contactPhone: "+91 98765 43210",
    defaultDailyRate: 200,
    currencySymbol: "Rs. "
  },
  members: [
    {
      id: "mem_101",
      name: "Aman Verma",
      phone: "9876512340",
      roomNumber: "101",
      dailyRate: 200,
      joiningDate: "2026-11-01",
      status: "active",
      notes: "Vegetarian preference",
      createdAt: "2026-11-01T08:00:00.000Z"
    },
    {
      id: "mem_102",
      name: "Rohan Kulkarni",
      phone: "9876523451",
      roomNumber: "102",
      dailyRate: 200,
      joiningDate: "2026-11-01",
      status: "active",
      notes: "",
      createdAt: "2026-11-01T08:00:00.000Z"
    },
    {
      id: "mem_103",
      name: "Sameer Ahmed",
      phone: "9876534562",
      roomNumber: "103",
      dailyRate: 200,
      joiningDate: "2026-11-01",
      status: "active",
      notes: "",
      createdAt: "2026-11-01T08:00:00.000Z"
    },
    {
      id: "mem_104",
      name: "Vikas Patel",
      phone: "9876545673",
      roomNumber: "104",
      dailyRate: 200,
      joiningDate: "2026-11-02",
      status: "active",
      notes: "",
      createdAt: "2026-11-02T08:00:00.000Z"
    },
    {
      id: "mem_105",
      name: "Deepak Choudhary",
      phone: "9876556784",
      roomNumber: "105",
      dailyRate: 200,
      joiningDate: "2026-11-03",
      status: "active",
      notes: "",
      createdAt: "2026-11-03T08:00:00.000Z"
    },
    {
      id: "mem_106",
      name: "Karan Singh",
      phone: "9876567895",
      roomNumber: "106",
      dailyRate: 200,
      joiningDate: "2026-11-04",
      status: "active",
      notes: "",
      createdAt: "2026-11-04T08:00:00.000Z"
    },
    {
      id: "mem_107",
      name: "Nikhil Joshi",
      phone: "9876578906",
      roomNumber: "107",
      dailyRate: 200,
      joiningDate: "2026-11-05",
      status: "active",
      notes: "",
      createdAt: "2026-11-05T08:00:00.000Z"
    },
    {
      id: "mem_108",
      name: "Pooja Hegde",
      phone: "9876589017",
      roomNumber: "201",
      dailyRate: 200,
      joiningDate: "2026-11-01",
      status: "active",
      notes: "",
      createdAt: "2026-11-01T08:00:00.000Z"
    },
    {
      id: "mem_109",
      name: "Ananya Deshmukh",
      phone: "9876590128",
      roomNumber: "202",
      dailyRate: 200,
      joiningDate: "2026-11-01",
      status: "active",
      notes: "",
      createdAt: "2026-11-01T08:00:00.000Z"
    },
    {
      id: "mem_110",
      name: "Siddharth Rao",
      phone: "9876501239",
      roomNumber: "203",
      dailyRate: 200,
      joiningDate: "2026-11-01",
      status: "active",
      notes: "",
      createdAt: "2026-11-01T08:00:00.000Z"
    }
  ],
  attendance: [],
  expenses: [],
  payments: [
    {
      id: "pay_1",
      memberId: "mem_101",
      amount: 6000,
      paymentDate: "2026-11-01",
      paymentMethod: "UPI",
      receiptNo: "REC-1011",
      notes: "Advance monthly payment",
      createdAt: "2026-11-01T09:00:00.000Z"
    },
    {
      id: "pay_2",
      memberId: "mem_102",
      amount: 6000,
      paymentDate: "2026-11-01",
      paymentMethod: "Cash",
      receiptNo: "REC-1012",
      notes: "Monthly fee",
      createdAt: "2026-11-01T10:00:00.000Z"
    },
    {
      id: "pay_3",
      memberId: "mem_103",
      amount: 5000,
      paymentDate: "2026-11-02",
      paymentMethod: "UPI",
      receiptNo: "REC-1013",
      notes: "Part payment",
      createdAt: "2026-11-02T11:00:00.000Z"
    }
  ]
};

function createSeedData() {
  const data = JSON.parse(JSON.stringify(defaultInitialData));
  const dates = [
    "2026-11-18", "2026-11-19", "2026-11-20", 
    "2026-11-21", "2026-11-22", "2026-11-23", "2026-11-24"
  ];

  // Seed attendance
  dates.forEach(date => {
    data.members.forEach(m => {
      let isAbsent = false;
      if (m.id === "mem_103" && (date === "2026-11-19" || date === "2026-11-20" || date === "2026-11-24")) {
        isAbsent = true;
      } else if (m.id === "mem_106" && (date === "2026-11-21" || date === "2026-11-22")) {
        isAbsent = true;
      } else if (m.id === "mem_105" && date === "2026-11-24") {
        isAbsent = true;
      } else if (m.id === "mem_108" && date === "2026-11-23") {
        isAbsent = true;
      }

      data.attendance.push({
        id: `att_${date}_${m.id}`,
        memberId: m.id,
        date: date,
        status: isAbsent ? "absent" : "present",
        updatedAt: `${date}T10:00:00.000Z`
      });
    });
  });

  // Seed expenses
  const expenseSeeds = [
    { itemName: "Potatoes", quantity: 15, unit: "KG", pricePerUnit: 35, date: "2026-11-20", category: "Vegetables", desc: "Sabzi supply" },
    { itemName: "Onions", quantity: 10, unit: "KG", pricePerUnit: 40, date: "2026-11-20", category: "Vegetables", desc: "Kitchen stock" },
    { itemName: "Cooking Oil (Fortune Sunflower)", quantity: 5, unit: "Liter", pricePerUnit: 145, date: "2026-11-20", category: "Spices & Oil", desc: "5L can" },
    { itemName: "Rice (Basmati & Kolam)", quantity: 25, unit: "KG", pricePerUnit: 70, date: "2026-11-21", category: "Grains & Pulses", desc: "Weekly rice sack" },
    { itemName: "Fresh Cow Milk", quantity: 12, unit: "Liter", pricePerUnit: 60, date: "2026-11-22", category: "Dairy", desc: "Morning tea and curd" },
    { itemName: "Toor Dal", quantity: 8, unit: "KG", pricePerUnit: 150, date: "2026-11-22", category: "Grains & Pulses", desc: "Dal tadka" },
    { itemName: "Chicken (Fresh Curry Cut)", quantity: 6, unit: "KG", pricePerUnit: 240, date: "2026-11-23", category: "Meat & Poultry", desc: "Sunday special dinner" },
    { itemName: "Wheat Flour (Aashirvaad Atta)", quantity: 20, unit: "KG", pricePerUnit: 42, date: "2026-11-23", category: "Grains & Pulses", desc: "Roti flour" },
    { itemName: "Tomatoes", quantity: 8, unit: "KG", pricePerUnit: 45, date: "2026-11-24", category: "Vegetables", desc: "Daily veggies" },
    { itemName: "Paneer", quantity: 3, unit: "KG", pricePerUnit: 360, date: "2026-11-24", category: "Dairy", desc: "Matar Paneer evening" },
    { itemName: "Fresh Cow Milk", quantity: 12, unit: "Liter", pricePerUnit: 60, date: "2026-11-24", category: "Dairy", desc: "Daily milk" },
    { itemName: "Green Chillies & Ginger", quantity: 2, unit: "KG", pricePerUnit: 90, date: "2026-11-24", category: "Vegetables", desc: "Spices" }
  ];

  data.expenses = expenseSeeds.map((item, idx) => ({
    id: `exp_${idx + 1}`,
    itemName: item.itemName,
    quantity: item.quantity,
    unit: item.unit,
    pricePerUnit: item.pricePerUnit,
    totalPrice: item.quantity * item.pricePerUnit,
    purchaseDate: item.date,
    category: item.category,
    description: item.desc,
    createdAt: `${item.date}T09:30:00.000Z`
  }));

  return data;
}

// LocalStorage Helper
function getStoredData() {
  if (typeof window === 'undefined') return createSeedData();
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seed = createSeedData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(raw);
  } catch (err) {
    const seed = createSeedData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }
}

function saveStoredData(data) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

function getTodayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// ----------------------------------------------------------------------
// EXPORTED API FUNCTIONS (Direct LocalStorage with Promise compatibility)
// ----------------------------------------------------------------------

export async function fetchDashboard(date) {
  const today = date || getTodayString();
  const currentMonth = today.slice(0, 7);
  const data = getStoredData();

  const members = data.members || [];
  const activeMembers = members.filter(m => m.status === 'active');
  const allAttendance = data.attendance || [];
  const allExpenses = data.expenses || [];

  const todayAttendance = allAttendance.filter(a => a.date === today);
  let todayPresent = 0;
  let todayAbsent = 0;

  activeMembers.forEach(m => {
    const rec = todayAttendance.find(a => a.memberId === m.id);
    if (rec) {
      if (rec.status === 'present') todayPresent++;
      else if (rec.status === 'absent') todayAbsent++;
    }
  });

  const todayExpensesList = allExpenses.filter(e => e.purchaseDate === today);
  const todayExpenses = todayExpensesList.reduce((sum, e) => sum + (Number(e.totalPrice) || 0), 0);

  const monthlyExpensesList = allExpenses.filter(e => e.purchaseDate && e.purchaseDate.startsWith(currentMonth));
  const monthlyTotalExpenses = monthlyExpensesList.reduce((sum, e) => sum + (Number(e.totalPrice) || 0), 0);

  const monthlyAttendance = allAttendance.filter(a => a.date && a.date.startsWith(currentMonth));
  let monthlyRefundAmount = 0;
  let totalPresentDaysMonth = 0;
  let totalAbsentDaysMonth = 0;

  monthlyAttendance.forEach(a => {
    const member = members.find(m => m.id === a.memberId);
    const rate = member ? (Number(member.dailyRate) || 200) : 200;
    if (a.status === 'absent') {
      monthlyRefundAmount += rate;
      totalAbsentDaysMonth++;
    } else if (a.status === 'present') {
      totalPresentDaysMonth++;
    }
  });

  let todayRefundAmount = 0;
  todayAttendance.forEach(a => {
    if (a.status === 'absent') {
      const member = members.find(m => m.id === a.memberId);
      const rate = member ? (Number(member.dailyRate) || 200) : 200;
      todayRefundAmount += rate;
    }
  });

  return {
    success: true,
    data: {
      date: today,
      month: currentMonth,
      totalMembers: members.length,
      activeMembers: activeMembers.length,
      inactiveMembers: members.length - activeMembers.length,
      todayPresent,
      todayAbsent,
      todayUnmarked: Math.max(0, activeMembers.length - (todayPresent + todayAbsent)),
      todayExpenses,
      todayRefundAmount,
      monthlyTotalExpenses,
      totalRefundAmount: monthlyRefundAmount,
      monthlySummary: {
        totalPresentDays: totalPresentDaysMonth,
        totalAbsentDays: totalAbsentDaysMonth,
        totalMealsRecorded: totalPresentDaysMonth + totalAbsentDaysMonth,
        attendanceRate: (totalPresentDaysMonth + totalAbsentDaysMonth) > 0 
          ? Math.round((totalPresentDaysMonth / (totalPresentDaysMonth + totalAbsentDaysMonth)) * 100) 
          : 0,
        currencySymbol: data.settings?.currencySymbol || "Rs. ",
        messName: data.settings?.messName || "Hostel Mess"
      }
    }
  };
}

export async function fetchMembers() {
  const data = getStoredData();
  const members = data.members || [];
  const attendance = data.attendance || [];
  const payments = data.payments || [];

  const enriched = members.map(m => {
    const memberAtt = attendance.filter(a => a.memberId === m.id);
    const presentDays = memberAtt.filter(a => a.status === 'present').length;
    const absentDays = memberAtt.filter(a => a.status === 'absent').length;
    const dailyRate = Number(m.dailyRate) || 200;
    const totalRefundable = absentDays * dailyRate;
    
    const memberPayments = payments.filter(p => p.memberId === m.id);
    const totalPaid = memberPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const usedCharges = presentDays * dailyRate;
    const balance = totalPaid - usedCharges;

    return {
      ...m,
      presentDays,
      absentDays,
      totalRefundable,
      totalPaid,
      usedCharges,
      balance
    };
  });

  return { success: true, data: enriched };
}

export async function fetchMemberDetails(id) {
  const data = getStoredData();
  const member = (data.members || []).find(m => m.id === id);
  if (!member) return { success: false, message: 'Member not found' };

  const memberAttendance = (data.attendance || [])
    .filter(a => a.memberId === member.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const memberPayments = (data.payments || [])
    .filter(p => p.memberId === member.id)
    .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate));

  const dailyRate = Number(member.dailyRate) || 200;
  const presentDays = memberAttendance.filter(a => a.status === 'present').length;
  const absentDays = memberAttendance.filter(a => a.status === 'absent').length;
  const totalRefundableAmount = absentDays * dailyRate;
  const usedCharges = presentDays * dailyRate;
  const totalPaid = memberPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const finalBalance = totalPaid - usedCharges;

  return {
    success: true,
    data: {
      ...member,
      totalDaysPresent: presentDays,
      totalDaysAbsent: absentDays,
      dailyMessCharges: dailyRate,
      totalRefundableAmount,
      totalUsedCharges: usedCharges,
      totalAmountPaid: totalPaid,
      finalBalance,
      attendanceHistory: memberAttendance,
      paymentHistory: memberPayments
    }
  };
}

export async function createMember(memberData) {
  const data = getStoredData();
  const newMember = {
    id: `mem_${Date.now()}`,
    name: memberData.name.trim(),
    phone: memberData.phone ? memberData.phone.trim() : '',
    roomNumber: memberData.roomNumber.trim(),
    dailyRate: Number(memberData.dailyRate) > 0 ? Number(memberData.dailyRate) : 200,
    joiningDate: memberData.joiningDate || getTodayString(),
    status: memberData.status || 'active',
    notes: memberData.notes ? memberData.notes.trim() : '',
    createdAt: new Date().toISOString()
  };
  data.members.push(newMember);
  saveStoredData(data);
  return { success: true, data: newMember };
}

export async function updateMember(id, memberData) {
  const data = getStoredData();
  const idx = data.members.findIndex(m => m.id === id);
  if (idx >= 0) {
    data.members[idx] = {
      ...data.members[idx],
      ...memberData,
      dailyRate: Number(memberData.dailyRate) > 0 ? Number(memberData.dailyRate) : data.members[idx].dailyRate,
      updatedAt: new Date().toISOString()
    };
    saveStoredData(data);
    return { success: true, data: data.members[idx] };
  }
  return { success: false, message: 'Member not found' };
}

export async function deleteMember(id) {
  const data = getStoredData();
  data.members = (data.members || []).filter(m => m.id !== id);
  data.attendance = (data.attendance || []).filter(a => a.memberId !== id);
  data.payments = (data.payments || []).filter(p => p.memberId !== id);
  saveStoredData(data);
  return { success: true, message: 'Member deleted successfully' };
}

export async function fetchAttendance(date) {
  const targetDate = date || getTodayString();
  const data = getStoredData();
  const records = (data.attendance || []).filter(a => a.date === targetDate);
  const members = data.members || [];

  const list = members.map(m => {
    const rec = records.find(r => r.memberId === m.id);
    return {
      memberId: m.id,
      name: m.name,
      roomNumber: m.roomNumber,
      dailyRate: Number(m.dailyRate) || 200,
      status: rec ? rec.status : 'unmarked',
      recordId: rec ? rec.id : null,
      updatedAt: rec ? rec.updatedAt : null,
      isMemberActive: m.status === 'active'
    };
  });

  return {
    success: true,
    data: {
      date: targetDate,
      records: list
    }
  };
}

export async function markAttendance(memberId, date, status) {
  const data = getStoredData();
  const member = data.members.find(m => m.id === memberId);
  if (!member) return { success: false, message: 'Member not found' };

  if (!data.attendance) data.attendance = [];
  const idx = data.attendance.findIndex(a => a.memberId === memberId && a.date === date);
  const now = new Date().toISOString();

  if (idx >= 0) {
    data.attendance[idx].status = status;
    data.attendance[idx].updatedAt = now;
  } else {
    data.attendance.push({
      id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      memberId,
      date,
      status,
      updatedAt: now
    });
  }

  saveStoredData(data);
  return {
    success: true,
    message: `Marked ${status} for ${member.name} on ${date}`,
    data: {
      memberId,
      date,
      status,
      refundImpact: status === 'absent' ? (Number(member.dailyRate) || 200) : 0
    }
  };
}

export async function bulkMarkAttendance(date, records) {
  const data = getStoredData();
  if (!data.attendance) data.attendance = [];
  const now = new Date().toISOString();

  records.forEach(rec => {
    const idx = data.attendance.findIndex(a => a.memberId === rec.memberId && a.date === date);
    if (idx >= 0) {
      data.attendance[idx].status = rec.status;
      data.attendance[idx].updatedAt = now;
    } else {
      data.attendance.push({
        id: `att_${date}_${rec.memberId}`,
        memberId: rec.memberId,
        date: date,
        status: rec.status,
        updatedAt: now
      });
    }
  });

  saveStoredData(data);
  return { success: true, message: `Updated attendance on ${date}` };
}

export async function fetchExpenses(filters = {}) {
  const data = getStoredData();
  let list = data.expenses || [];

  if (filters.date) {
    list = list.filter(e => e.purchaseDate === filters.date);
  }
  if (filters.month) {
    list = list.filter(e => e.purchaseDate && e.purchaseDate.startsWith(filters.month));
  }
  if (filters.category && filters.category !== 'all') {
    list = list.filter(e => e.category === filters.category);
  }

  list.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));

  return {
    success: true,
    totalAmount: list.reduce((sum, e) => sum + (Number(e.totalPrice) || 0), 0),
    count: list.length,
    data: list
  };
}

export async function createExpense(expenseData) {
  const data = getStoredData();
  if (!data.expenses) data.expenses = [];
  const quantity = Number(expenseData.quantity);
  const pricePerUnit = Number(expenseData.pricePerUnit);
  const totalPrice = quantity * pricePerUnit;

  const newExpense = {
    id: `exp_${Date.now()}`,
    itemName: expenseData.itemName.trim(),
    quantity,
    unit: expenseData.unit || 'KG',
    pricePerUnit,
    totalPrice: Number.isFinite(totalPrice) ? totalPrice : 0,
    purchaseDate: expenseData.purchaseDate || getTodayString(),
    category: expenseData.category || 'Vegetables',
    description: expenseData.description ? expenseData.description.trim() : '',
    createdAt: new Date().toISOString()
  };

  data.expenses.push(newExpense);
  saveStoredData(data);
  return { success: true, data: newExpense };
}

export async function updateExpense(id, expenseData) {
  const data = getStoredData();
  const idx = data.expenses.findIndex(e => e.id === id);
  if (idx >= 0) {
    const quantity = Number(expenseData.quantity);
    const pricePerUnit = Number(expenseData.pricePerUnit);
    data.expenses[idx] = {
      ...data.expenses[idx],
      ...expenseData,
      quantity,
      pricePerUnit,
      totalPrice: quantity * pricePerUnit,
      updatedAt: new Date().toISOString()
    };
    saveStoredData(data);
    return { success: true, data: data.expenses[idx] };
  }
  return { success: false, message: 'Expense not found' };
}

export async function deleteExpense(id) {
  const data = getStoredData();
  data.expenses = (data.expenses || []).filter(e => e.id !== id);
  saveStoredData(data);
  return { success: true, message: 'Expense deleted successfully' };
}

export async function fetchPayments(memberId) {
  const data = getStoredData();
  let payments = data.payments || [];
  if (memberId) {
    payments = payments.filter(p => p.memberId === memberId);
  }
  const members = data.members || [];
  const enriched = payments.map(p => {
    const member = members.find(m => m.id === p.memberId);
    return {
      ...p,
      memberName: member ? member.name : 'Unknown',
      roomNumber: member ? member.roomNumber : '-'
    };
  }).sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate));

  return { success: true, data: enriched };
}

export async function createPayment(paymentData) {
  const data = getStoredData();
  if (!data.payments) data.payments = [];
  const item = {
    id: `pay_${Date.now()}`,
    memberId: paymentData.memberId,
    amount: Number(paymentData.amount),
    paymentDate: paymentData.paymentDate || getTodayString(),
    paymentMethod: paymentData.paymentMethod || "Cash",
    receiptNo: paymentData.receiptNo || `REC-${Math.floor(1000 + Math.random() * 9000)}`,
    notes: paymentData.notes || "",
    createdAt: new Date().toISOString()
  };
  data.payments.push(item);
  saveStoredData(data);
  return { success: true, data: item };
}

export async function deletePayment(id) {
  const data = getStoredData();
  data.payments = (data.payments || []).filter(p => p.id !== id);
  saveStoredData(data);
  return { success: true, message: 'Payment record deleted' };
}

export async function fetchMonthlyReport(month) {
  const targetMonth = month || getTodayString().slice(0, 7);
  const data = getStoredData();
  const members = data.members || [];
  const allAttendance = data.attendance || [];
  const allExpenses = (data.expenses || []).filter(e => e.purchaseDate && e.purchaseDate.startsWith(targetMonth));
  const allPayments = data.payments || [];
  const settings = data.settings || defaultInitialData.settings;

  const monthAttendance = allAttendance.filter(a => a.date && a.date.startsWith(targetMonth));

  let totalPresentDays = 0;
  let totalAbsentDays = 0;
  let totalRefundAmount = 0;

  const memberBreakdown = members.map(m => {
    const att = monthAttendance.filter(a => a.memberId === m.id);
    const present = att.filter(a => a.status === 'present').length;
    const absent = att.filter(a => a.status === 'absent').length;
    const rate = Number(m.dailyRate) || 200;
    const memberRefund = absent * rate;
    const usedCharges = present * rate;

    totalPresentDays += present;
    totalAbsentDays += absent;
    totalRefundAmount += memberRefund;

    const monthPayments = allPayments.filter(p => p.memberId === m.id && p.paymentDate && p.paymentDate.startsWith(targetMonth));
    const paidThisMonth = monthPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    const allMemberPayments = allPayments.filter(p => p.memberId === m.id);
    const totalAllPaid = allMemberPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const allAtt = allAttendance.filter(a => a.memberId === m.id);
    const allPresent = allAtt.filter(a => a.status === 'present').length;
    const finalBalance = totalAllPaid - (allPresent * rate);

    return {
      memberId: m.id,
      name: m.name,
      roomNumber: m.roomNumber,
      phone: m.phone,
      status: m.status,
      dailyRate: rate,
      presentDays: present,
      absentDays: absent,
      refundableAmount: memberRefund,
      usedCharges: usedCharges,
      paidThisMonth,
      finalBalance
    };
  });

  const categoryBreakdown = {};
  let totalFoodExpenses = 0;
  allExpenses.forEach(e => {
    const cat = e.category || 'Other';
    const amt = Number(e.totalPrice) || 0;
    totalFoodExpenses += amt;
    categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + amt;
  });

  const categoryList = Object.keys(categoryBreakdown).map(cat => ({
    category: cat,
    amount: categoryBreakdown[cat],
    percentage: totalFoodExpenses > 0 ? Math.round((categoryBreakdown[cat] / totalFoodExpenses) * 100) : 0
  })).sort((a, b) => b.amount - a.amount);

  return {
    success: true,
    data: {
      month: targetMonth,
      settings,
      totalActiveMembers: members.filter(m => m.status === 'active').length,
      totalMembersCount: members.length,
      totalPresentDays,
      totalAbsentDays,
      totalFoodExpenses,
      totalRefundAmount,
      netMessProfitOrDeficit: (totalPresentDays * (settings.defaultDailyRate || 200)) - totalFoodExpenses,
      memberBreakdown,
      categoryList,
      expenses: allExpenses
    }
  };
}

export async function fetchSettings() {
  const data = getStoredData();
  return { success: true, data: data.settings || defaultInitialData.settings };
}

export async function updateSettings(newSettings) {
  const data = getStoredData();
  data.settings = { ...data.settings, ...newSettings };
  saveStoredData(data);
  return { success: true, data: data.settings };
}

export async function resetDemoData() {
  const seed = createSeedData();
  saveStoredData(seed);
  return { success: true, message: 'Demo data restored successfully' };
}
