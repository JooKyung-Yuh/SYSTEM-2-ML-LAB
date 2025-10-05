import toast from 'react-hot-toast';

/**
 * Academic-style toast notification helpers
 * Provides consistent messaging across the admin dashboard
 */

export const showToast = {
  // Success notifications
  success: (message: string) => {
    toast.success(message, {
      style: {
        fontWeight: '500',
      },
    });
  },

  // Error notifications
  error: (message: string) => {
    toast.error(message, {
      style: {
        fontWeight: '500',
      },
    });
  },

  // Loading notifications (returns toast id for updating)
  loading: (message: string) => {
    return toast.loading(message, {
      style: {
        fontWeight: '500',
      },
    });
  },

  // Promise-based toast (auto handles loading -> success/error)
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    });
  },
};

// Pre-defined academic messages
export const toastMessages = {
  // News
  news: {
    created: '뉴스가 성공적으로 생성되었습니다',
    updated: '뉴스가 업데이트되었습니다',
    deleted: '뉴스가 삭제되었습니다',
    error: '작업을 완료할 수 없습니다',
  },

  // Publications
  publications: {
    created: '논문이 성공적으로 추가되었습니다',
    updated: '논문 정보가 업데이트되었습니다',
    deleted: '논문이 삭제되었습니다',
    error: '논문 작업을 완료할 수 없습니다',
  },

  // Courses
  courses: {
    created: '강의가 성공적으로 추가되었습니다',
    updated: '강의 정보가 업데이트되었습니다',
    deleted: '강의가 삭제되었습니다',
    error: '강의 작업을 완료할 수 없습니다',
  },

  // People
  people: {
    created: '팀원이 성공적으로 추가되었습니다',
    updated: '팀원 정보가 업데이트되었습니다',
    deleted: '팀원이 삭제되었습니다',
    error: '팀원 작업을 완료할 수 없습니다',
  },

  // Gallery
  gallery: {
    created: '갤러리 항목이 추가되었습니다',
    updated: '갤러리 항목이 업데이트되었습니다',
    deleted: '갤러리 항목이 삭제되었습니다',
    error: '갤러리 작업을 완료할 수 없습니다',
    imageUploading: '이미지 업로드 중...',
    imageUploaded: '이미지가 업로드되었습니다',
    imageUploadError: '이미지 업로드에 실패했습니다',
  },

  // About/Pages
  pages: {
    updated: '페이지가 업데이트되었습니다',
    sectionCreated: '섹션이 추가되었습니다',
    sectionUpdated: '섹션이 업데이트되었습니다',
    sectionDeleted: '섹션이 삭제되었습니다',
    error: '페이지 작업을 완료할 수 없습니다',
  },

  // General
  general: {
    saving: '저장 중...',
    saved: '저장되었습니다',
    deleting: '삭제 중...',
    deleted: '삭제되었습니다',
    error: '오류가 발생했습니다',
    networkError: '네트워크 오류가 발생했습니다',
    validationError: '입력값을 확인해주세요',
  },
};
