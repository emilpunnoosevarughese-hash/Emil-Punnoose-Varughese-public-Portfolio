import React, { useState } from 'react';
import { X } from 'lucide-react';
import { submitCorrectionReport } from '../../data/speclabProvenance';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

interface CorrectionReportModalProps {
  productId: string;
  productName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const CorrectionReportModal: React.FC<CorrectionReportModalProps> = ({
  productId,
  productName,
  isOpen,
  onClose,
}) => {
  const { theme: _theme } = useTheme(); // theme drives CSS variables globally
  
  const [reportType, setReportType] = useState('inaccurate_spec');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitCorrectionReport({
        product_id: productId,
        report_type: reportType as any,
        description,
        reported_by_email: email || undefined,
        status: 'pending',
        created_at: new Date().toISOString(),
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setDescription('');
      }, 2000);
    } catch (error) {
      console.error('Failed to submit report', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-white  border border-gray-200  rounded-xl shadow-xl glass-effect overflow-hidden"
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200 ">
            <h3 className="font-semibold text-lg text-gray-900 ">
              Report Correction
            </h3>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100  transition-colors text-gray-500 "
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-4">
            {success ? (
              <div className="py-8 text-center text-green-600 ">
                <p className="font-medium">Report submitted successfully!</p>
                <p className="text-sm mt-2 opacity-80">Thank you for helping improve SpecLab.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500  mb-4">
                    Reporting an issue for: <span className="font-medium text-gray-900 ">{productName}</span>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-1">
                    Issue Type
                  </label>
                  <select 
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full rounded-lg border border-gray-300  bg-white  px-3 py-2 text-sm text-gray-900  focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="inaccurate_spec">Inaccurate Specification</option>
                    <option value="missing_info">Missing Information</option>
                    <option value="broken_link">Broken Source Link</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-gray-300  bg-white  px-3 py-2 text-sm text-gray-900  focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    placeholder="Please describe the issue..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-1">
                    Email (optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-300  bg-white  px-3 py-2 text-sm text-gray-900  focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="For follow-up questions"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700  hover:bg-gray-100  rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !description.trim()}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

