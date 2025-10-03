import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { packetServices } from '@/services/packetService';
import { toast } from 'sonner';
import { TbTrash } from 'react-icons/tb';

// Global state để quản lý chỉ một dialog mở tại một thời điểm
let globalActiveDialog: string | null = null;
const dialogSubscribers = new Set<(activeId: string | null) => void>();

const useGlobalDialog = (dialogId: string) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const updateStatus = (activeId: string | null) => {
      setIsActive(activeId === dialogId);
    };

    dialogSubscribers.add(updateStatus);
    updateStatus(globalActiveDialog);

    return () => {
      dialogSubscribers.delete(updateStatus);
    };
  }, [dialogId]);

  const setActive = () => {
    globalActiveDialog = dialogId;
    dialogSubscribers.forEach(callback => callback(globalActiveDialog));
  };

  const clearActive = () => {
    if (globalActiveDialog === dialogId) {
      globalActiveDialog = null;
      dialogSubscribers.forEach(callback => callback(globalActiveDialog));
    }
  };

  return { isActive, setActive, clearActive };
};

const ConfirmDialogComponent: React.FC<{
  message: string;
  targetElement: HTMLElement;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ message, targetElement, onConfirm, onCancel }) => {
  const [position, setPosition] = useState({ top: 0, left: 0, opacity: 0 });

  useEffect(() => {
    const calculateInitialPosition = () => {
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const dialogWidth = 256;
        const viewportWidth = window.innerWidth;

        let left = rect.left - 120;

        // Boundary checks
        if (left < 10) {
          left = 10;
        }
        if (left + dialogWidth > viewportWidth - 10) {
          left = viewportWidth - dialogWidth - 10;
        }

        // Set position immediately without animation
        setPosition({
          top: Math.max(10, rect.top - 80),
          left: left,
          opacity: 1
        });
      }
    };

    // Calculate position immediately on mount
    calculateInitialPosition();

    const updatePosition = () => {
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const dialogWidth = 256;
        const viewportWidth = window.innerWidth;

        let left = rect.left - 120;

        if (left < 10) {
          left = 10;
        }
        if (left + dialogWidth > viewportWidth - 10) {
          left = viewportWidth - dialogWidth - 10;
        }

        setPosition(prev => ({
          ...prev,
          top: Math.max(10, rect.top - 80),
          left: left
        }));
      }
    };

    // Debounced event listeners for scroll/resize
    let timeoutId: NodeJS.Timeout;
    const debouncedUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updatePosition, 16);
    };

    window.addEventListener('scroll', debouncedUpdate, { passive: true });
    window.addEventListener('resize', debouncedUpdate, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', debouncedUpdate);
      window.removeEventListener('resize', debouncedUpdate);
    };
  }, [targetElement]);

  return (
    <div
      className="fixed z-50 bg-white rounded-lg shadow-lg border p-3 w-64"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        opacity: position.opacity,
        transform: 'translate3d(0, 0, 0)', // Force hardware acceleration
        transition: 'none' // Remove any CSS transitions that could cause flicker
      }}
    >
      <div className="text-sm mb-2 whitespace-pre-line">{message}</div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
          onClick={onCancel}
        >
          Hủy
        </Button>
        <Button
          size="sm"
          className="flex-1 text-xs bg-red-600 hover:bg-red-700 text-white"
          onClick={onConfirm}
        >
          Xác nhận
        </Button>
      </div>
    </div>
  );
};

const DeletePacket: React.FC<{ packetId: string; onDeleted?: () => void }> = ({ packetId, onDeleted }) => {
  const [loading, setLoading] = useState(false);
  const { isActive, setActive, clearActive } = useGlobalDialog(`delete-${packetId}`);
  const [confirmDialog, setConfirmDialog] = useState<{
    message: string;
    onConfirm: () => void;
    targetElement: HTMLElement | null;
  }>({
    message: '',
    onConfirm: () => { },
    targetElement: null
  });

  const openConfirm = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    // Đặt dialog này thành active (sẽ tự động đóng các dialog khác)
    setActive();

    setConfirmDialog({
      message: 'Bạn có chắc chắn muốn xóa gói này?',
      onConfirm: () => {
        remove();
        clearActive();
      },
      targetElement: event.currentTarget
    });
  };

  const closeConfirm = () => {
    clearActive();
    setConfirmDialog({ message: '', onConfirm: () => { }, targetElement: null });
  };

  const remove = async () => {
    if (!packetId) return;
    setLoading(true);
    try {
      await packetServices.deletePackage(packetId);
      toast.success('Xóa gói thành công');
      onDeleted?.();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || 'Không thể xóa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={openConfirm}
        disabled={loading}
        className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 p-2 h-8 w-8"
        title={loading ? 'Đang xóa...' : 'Xóa gói'}
      >
        <TbTrash className="w-4 h-4" />
      </Button>

      {isActive && confirmDialog.targetElement && (
        <ConfirmDialogComponent
          message={confirmDialog.message}
          targetElement={confirmDialog.targetElement}
          onConfirm={confirmDialog.onConfirm}
          onCancel={closeConfirm}
        />
      )}
    </>
  );
};

export default DeletePacket;
