import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Search, 
  Calendar, 
  Edit2, 
  Trash2, 
  Filter, 
  X, 
  Receipt, 
  Coins, 
  Tag, 
  ChevronRight 
} from 'lucide-react';
import { fetchExpenses, createExpense, updateExpense, deleteExpense } from '../api';

const COMMON_PRESETS = [
  { name: 'Potatoes', unit: 'KG', category: 'Vegetables' },
  { name: 'Onions', unit: 'KG', category: 'Vegetables' },
  { name: 'Tomatoes', unit: 'KG', category: 'Vegetables' },
  { name: 'Rice', unit: 'KG', category: 'Grains & Pulses' },
  { name: 'Wheat Flour (Atta)', unit: 'KG', category: 'Grains & Pulses' },
  { name: 'Toor Dal', unit: 'KG', category: 'Grains & Pulses' },
  { name: 'Cooking Oil', unit: 'Liter', category: 'Spices & Oil' },
  { name: 'Fresh Milk', unit: 'Liter', category: 'Dairy' },
  { name: 'Paneer', unit: 'KG', category: 'Dairy' },
  { name: 'Chicken', unit: 'KG', category: 'Meat & Poultry' },
  { name: 'Gas Cylinder', unit: 'Packet', category: 'Fuel & Utilities' }
];

const UNITS = ['KG', 'Gram', 'Liter', 'Packet', 'Dozen', 'Piece', 'Bag'];
const CATEGORIES = [
  'Vegetables', 
  'Grains & Pulses', 
  'Dairy', 
  'Meat & Poultry', 
  'Spices & Oil', 
  'Fuel & Utilities', 
  'Miscellaneous'
];

export default function DailyExpenses({ onExpenseChange, settings }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    itemName: '',
    quantity: '',
    unit: 'KG',
    pricePerUnit: '',
    purchaseDate: new Date().toISOString().slice(0, 10),
    category: 'Vegetables',
    description: ''
  });

  const currency = settings?.currencySymbol || "Rs. ";

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const res = await fetchExpenses({
        date: filterDate || undefined,
        category: filterCategory !== 'all' ? filterCategory : undefined
      });
      if (res.success) {
        setExpenses(res.data || []);
      }
    } catch (err) {
      console.error("Failed to load expenses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, [filterDate, filterCategory]);

  const handleOpenAdd = () => {
    setEditingExpense(null);
    setFormData({
      itemName: '',
      quantity: '',
      unit: 'KG',
      pricePerUnit: '',
      purchaseDate: new Date().toISOString().slice(0, 10),
      category: 'Vegetables',
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingExpense(item);
    setFormData({
      itemName: item.itemName,
      quantity: item.quantity,
      unit: item.unit || 'KG',
      pricePerUnit: item.pricePerUnit,
      purchaseDate: item.purchaseDate,
      category: item.category || 'Vegetables',
      description: item.description || ''
    });
    setIsModalOpen(true);
  };

  const handleApplyPreset = (preset) => {
    setFormData(prev => ({
      ...prev,
      itemName: preset.name,
      unit: preset.unit,
      category: preset.category
    }));
  };

  // Auto total price preview
  const calculatedTotal = (Number(formData.quantity) || 0) * (Number(formData.pricePerUnit) || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.itemName.trim()) {
      alert("Please enter the item name.");
      return;
    }
    if (!formData.quantity || Number(formData.quantity) <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }
    if (formData.pricePerUnit === '' || Number(formData.pricePerUnit) < 0) {
      alert("Please enter a valid price per unit.");
      return;
    }

    try {
      setSubmitting(true);
      if (editingExpense) {
        await updateExpense(editingExpense.id, formData);
      } else {
        await createExpense(formData);
      }
      setIsModalOpen(false);
      loadExpenses();
      if (onExpenseChange) onExpenseChange();
    } catch (err) {
      alert("Error saving expense: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete expense record for "${name}"?`)) {
      try {
        await deleteExpense(id);
        loadExpenses();
        if (onExpenseChange) onExpenseChange();
      } catch (err) {
        alert("Error deleting expense: " + err.message);
      }
    }
  };

  // Filtered by search
  const displayedExpenses = expenses.filter(e => 
    e.itemName?.toLowerCase().includes(search.toLowerCase()) ||
    e.description?.toLowerCase().includes(search.toLowerCase()) ||
    e.category?.toLowerCase().includes(search.toLowerCase())
  );

  const totalFilteredAmount = displayedExpenses.reduce(
    (sum, e) => sum + (Number(e.totalPrice) || 0), 0
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Daily Kitchen Expenses</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Log daily vegetables, groceries, milk, and fuel purchases for the mess
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-md shadow-blue-600/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Expense</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search items, notes, categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
          />
        </div>

        {/* Date Filter & Category Filter */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Date Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="bg-transparent font-medium text-slate-700 focus:outline-none text-xs"
            />
            {filterDate && (
              <button 
                onClick={() => setFilterDate('')} 
                className="text-slate-400 hover:text-slate-600 ml-1"
                title="Clear date filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs">
            <Tag className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-transparent font-medium text-slate-700 focus:outline-none text-xs"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Total Amount Pill */}
          <div className="ml-auto font-bold text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-200">
            Total: {currency}{totalFilteredAmount.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold border-b border-slate-200 tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Purchased Item</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Quantity</th>
                <th className="px-4 py-3.5">Price / Unit</th>
                <th className="px-4 py-3.5">Total Amount</th>
                <th className="px-4 py-3.5">Purchase Date</th>
                <th className="px-4 py-3.5">Notes</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedExpenses.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-slate-400">
                    <ShoppingBag className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-medium text-slate-600">No expenses recorded</p>
                    <p className="text-xs text-slate-400 mt-1">Click "Add New Expense" to record daily purchases</p>
                  </td>
                </tr>
              ) : (
                displayedExpenses.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Item Name */}
                    <td className="px-5 py-4 font-bold text-slate-900">
                      {item.itemName}
                    </td>

                    {/* Category */}
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {item.category || 'General'}
                      </span>
                    </td>

                    {/* Quantity & Unit */}
                    <td className="px-4 py-4 font-semibold text-slate-700 text-xs">
                      {item.quantity} {item.unit}
                    </td>

                    {/* Price / Unit */}
                    <td className="px-4 py-4 text-xs text-slate-600">
                      {currency}{Number(item.pricePerUnit).toLocaleString()} / {item.unit}
                    </td>

                    {/* Total Price */}
                    <td className="px-4 py-4 font-bold text-slate-900 text-xs">
                      {currency}{Number(item.totalPrice).toLocaleString()}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4 text-xs text-slate-500 whitespace-nowrap">
                      {item.purchaseDate}
                    </td>

                    {/* Notes */}
                    <td className="px-4 py-4 text-xs text-slate-400 max-w-[150px] truncate">
                      {item.description || '-'}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          title="Edit Expense"
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.itemName)}
                          title="Delete Expense"
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingExpense ? 'Edit Expense Record' : 'Record Daily Purchased Item'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Presets chips */}
              {!editingExpense && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Quick Grocery Presets (Click to Fill)
                  </label>
                  <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
                    {COMMON_PRESETS.map((preset) => (
                      <button
                        type="button"
                        key={preset.name}
                        onClick={() => handleApplyPreset(preset)}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white text-slate-700 border border-slate-200 hover:border-blue-500 hover:text-blue-600 transition-colors shadow-2xs"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Item Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Item Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Potatoes, Onions, Milk, Rice, Chicken"
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Quantity, Unit, Price per Unit */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Quantity <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="e.g. 5"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Unit
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Rate / Unit <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">
                      {currency}
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      placeholder="100"
                      value={formData.pricePerUnit}
                      onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Auto Total Price Card */}
              <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-blue-900 font-semibold uppercase tracking-wider block">
                    Total Price (Auto-Calculated)
                  </span>
                  <span className="text-[11px] text-blue-600">
                    {formData.quantity || 0} {formData.unit} &times; {currency}{formData.pricePerUnit || 0}
                  </span>
                </div>
                <div className="text-xl font-black text-blue-800">
                  {currency}{calculatedTotal.toLocaleString()}
                </div>
              </div>

              {/* Purchase Date & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Purchase Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Optional Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Optional Description / Vendor
                </label>
                <input
                  type="text"
                  placeholder="e.g. Purchased from Mandi, Vendor: Sharma Dairy"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-600/20 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingExpense ? 'Update Expense' : 'Add Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
