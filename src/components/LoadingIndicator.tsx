import React from 'react';

export interface LoadingIndicatorProps {
    type?: 'spinner' | 'refresh' | 'simple';
    message?: string;
    position?: 'center' | 'top-center' | 'top-right' | 'fixed';
    size?: 'sm' | 'md' | 'lg';
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
    type = 'spinner',
    message = 'Đang tải...',
    position = 'center',
    size = 'md'
}) => {
    const getPositionClass = () => {
        switch (position) {
            case 'top-center':
                return 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50';
            case 'top-right':
                return 'fixed top-4 right-4 z-50';
            case 'fixed':
                return 'fixed inset-0 z-50 flex items-center justify-center';
            case 'center':
            default:
                return 'flex items-center justify-center';
        }
    };

    const getSizeClass = () => {
        switch (size) {
            case 'sm':
                return 'h-3 w-3';
            case 'lg':
                return 'h-6 w-6';
            case 'md':
            default:
                return 'h-4 w-4';
        }
    };

    const getSpinner = () => (
        <div className={`animate-spin rounded-full border-2 border-white border-t-transparent ${getSizeClass()}`}></div>
    );

    const getRefreshSpinner = () => (
        <div className={`animate-spin rounded-full border-2 border-blue-600 border-t-transparent ${getSizeClass()}`}></div>
    );

    const getSimpleSpinner = () => (
        <div className={`animate-pulse bg-gray-300 rounded ${getSizeClass()}`}></div>
    );

    const renderSpinner = () => {
        switch (type) {
            case 'refresh':
                return getRefreshSpinner();
            case 'simple':
                return getSimpleSpinner();
            case 'spinner':
            default:
                return getSpinner();
        }
    };

    const getContainerClass = () => {
        const baseClass = getPositionClass();

        if (position === 'fixed') {
            return `${baseClass} bg-black/50 backdrop-blur-sm`;
        }

        if (position === 'top-center') {
            return `${baseClass} bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg`;
        }

        if (position === 'top-right') {
            return `${baseClass} bg-white p-2 rounded shadow border`;
        }

        return baseClass;
    };

    if (position === 'fixed') {
        return (
            <div className={getContainerClass()}>
                <div className="bg-white rounded-lg p-4 flex items-center gap-3">
                    {renderSpinner()}
                    <span className="text-sm text-gray-700">{message}</span>
                </div>
            </div>
        );
    }

    return (
        <div className={getContainerClass()}>
            <div className="flex items-center gap-2">
                {renderSpinner()}
                <span className="text-sm">{message}</span>
            </div>
        </div>
    );
};

export default LoadingIndicator;