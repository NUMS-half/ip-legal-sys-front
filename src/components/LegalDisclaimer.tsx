import React from 'react';

const LegalDisclaimer: React.FC = () => {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4 rounded-r shadow-sm dark:bg-amber-900/20 dark:border-amber-600 transition-colors duration-300">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-amber-500 dark:text-amber-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-amber-700 dark:text-amber-200/90">
            <span className="font-bold">免责声明：</span> 
            本系统由AI驱动，提供的信息仅供参考，不构成正式的法律意见或律师-客户关系。对于重大法律事务，请咨询合格的专业律师。
          </p>
        </div>
      </div>
    </div>
  );
};

export default LegalDisclaimer;