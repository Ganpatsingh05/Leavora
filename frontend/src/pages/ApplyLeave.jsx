import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import toast from 'react-hot-toast';
import {
  HiOutlineDocumentAdd,
  HiOutlineCalendar,
  HiOutlineAnnotation,
  HiOutlineArrowLeft,
} from 'react-icons/hi';

const ApplyLeave = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    leaveType: '',
    fromDate: '',
    toDate: '',
    reason: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.leaveType || !form.fromDate || !form.toDate || !form.reason) {
      toast.error('Please fill in all fields');
      return;
    }
    if (new Date(form.toDate) < new Date(form.fromDate)) {
      toast.error('End date must be after start date');
      return;
    }
    setLoading(true);
    try {
      await API.post('/leaves', form);
      toast.success('Leave application submitted successfully!');
      navigate(-1);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit leave');
    } finally {
      setLoading(false);
    }
  };

  const leaveTypes = [
    { value: 'casual', label: 'Casual Leave', desc: '12 days/year' },
    { value: 'sick', label: 'Sick Leave', desc: '10 days/year' },
    { value: 'earned', label: 'Earned Leave', desc: '15 days/year' },
    { value: 'maternity', label: 'Maternity Leave', desc: 'As per policy' },
    { value: 'paternity', label: 'Paternity Leave', desc: 'As per policy' },
    { value: 'unpaid', label: 'Unpaid Leave', desc: 'No limit' },
  ];

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
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-linear-to-r from-indigo-500/5 to-violet-500/5 dark:from-indigo-500/10 dark:to-violet-500/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20">
              <HiOutlineDocumentAdd className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Apply for Leave</h2>
              <p className="text-sm text-gray-500 dark:text-indigo-300">Fill in the details below</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Leave Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-indigo-200 mb-2">
              Leave Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {leaveTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setForm({ ...form, leaveType: type.value })}
                  className={`p-3 rounded-xl border text-left transition-all duration-200
                    ${
                      form.leaveType === type.value
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'
                    }`}
                >
                  <p className={`text-sm font-medium ${
                    form.leaveType === type.value
                      ? 'text-indigo-700 dark:text-indigo-300'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {type.label}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{type.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Date range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-indigo-200 mb-1.5">
                From Date
              </label>
              <div className="relative">
                <HiOutlineCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  name="fromDate"
                  value={form.fromDate}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-indigo-700/50 bg-white dark:bg-indigo-950/50 
                  text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-indigo-200 mb-1.5">
                To Date
              </label>
              <div className="relative">
                <HiOutlineCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  name="toDate"
                  value={form.toDate}
                  onChange={handleChange}
                  min={form.fromDate}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-indigo-700/50 bg-white dark:bg-indigo-950/50 
                  text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all text-sm"
                />
              </div>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-indigo-200 mb-1.5">
              Reason
            </label>
            <div className="relative">
              <HiOutlineAnnotation className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
              <textarea
                name="reason"
                value={form.reason}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your reason for leave..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-indigo-700/50 bg-white dark:bg-indigo-950/50 
                text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 
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
              className="flex-1 py-3 px-4 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700
              text-white font-semibold text-sm shadow-lg shadow-indigo-500/25
              hover:scale-[1.01] active:scale-[0.99] transition-all duration-200
              disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeave;
