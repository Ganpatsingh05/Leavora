import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import toast from 'react-hot-toast';
import { reimbursementCategoryLabels } from '../utils/helpers';
import {
  HiOutlineCurrencyRupee,
  HiOutlineCalendar,
  HiOutlineAnnotation,
  HiOutlineArrowLeft,
  HiOutlineTag,
  HiOutlineReceiptTax,
} from 'react-icons/hi';

const SubmitReimbursement = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    category: '',
    amount: '',
    date: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category || !form.amount || !form.date || !form.description) {
      toast.error('Please fill in all fields');
      return;
    }
    if (Number(form.amount) < 1) {
      toast.error('Amount must be at least ₹1');
      return;
    }
    setLoading(true);
    try {
      await API.post('/reimbursements', { ...form, amount: Number(form.amount) });
      toast.success('Reimbursement submitted successfully!');
      navigate(-1);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit reimbursement');
    } finally {
      setLoading(false);
    }
  };

  const categories = Object.entries(reimbursementCategoryLabels).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-indigo-300 hover:text-gray-700 dark:hover:text-white mb-6 transition-colors"
      >
        <HiOutlineArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-indigo-800/20 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-linear-to-r from-emerald-500/5 to-teal-500/5 dark:from-emerald-500/10 dark:to-teal-500/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
              <HiOutlineReceiptTax className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Submit Reimbursement</h2>
              <p className="text-sm text-gray-500 dark:text-indigo-300">Fill in the expense details below</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-indigo-200 mb-1.5">
              Expense Title
            </label>
            <div className="relative">
              <HiOutlineTag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Client site travel"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-indigo-700/50 bg-white dark:bg-indigo-950/50 
                text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all text-sm"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-indigo-200 mb-2">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setForm({ ...form, category: cat.value })}
                  className={`p-3 rounded-xl border text-center transition-all duration-200
                    ${
                      form.category === cat.value
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600'
                    }`}
                >
                  <p className={`text-sm font-medium ${
                    form.category === cat.value
                      ? 'text-emerald-700 dark:text-emerald-300'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {cat.label}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-indigo-200 mb-1.5">
                Amount (₹)
              </label>
              <div className="relative">
                <HiOutlineCurrencyRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  min="1"
                  step="1"
                  placeholder="0"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-indigo-700/50 bg-white dark:bg-indigo-950/50 
                  text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-indigo-200 mb-1.5">
                Expense Date
              </label>
              <div className="relative">
                <HiOutlineCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-indigo-700/50 bg-white dark:bg-indigo-950/50 
                  text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all text-sm"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-indigo-200 mb-1.5">
              Description
            </label>
            <div className="relative">
              <HiOutlineAnnotation className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe the expense and purpose..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-indigo-700/50 bg-white dark:bg-indigo-950/50 
                text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 
                transition-all text-sm resize-none"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 
              font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700
              text-white font-semibold text-sm shadow-lg shadow-emerald-500/25
              hover:scale-[1.01] active:scale-[0.99] transition-all duration-200
              disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Reimbursement'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitReimbursement;
