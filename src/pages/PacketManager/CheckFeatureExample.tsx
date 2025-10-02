import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { packetServices } from '@/services/packetService';

const CheckFeatureExample: React.FC = () => {
  const [feature, setFeature] = useState('Biểu đồ huyết áp hàng tuần');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCheckFeature = async () => {
    setLoading(true);
    try {
      const response = await packetServices.checkFeaturePermission(feature);
      console.log('Check feature response:', response);
      setResult(response.data);
    } catch (error: any) {
      console.error('Error checking feature:', error);
      setResult({
        message: 'Error: ' + (error?.response?.data?.message || error?.message),
        hasAccess: false,
        feature: feature
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Kiểm tra quyền sử dụng feature</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Tên feature:</label>
          <Input
            type="text"
            value={feature}
            onChange={(e) => setFeature(e.target.value)}
            placeholder="Nhập tên feature..."
          />
        </div>
        
        <Button 
          onClick={handleCheckFeature} 
          disabled={loading || !feature.trim()}
          className="w-full"
        >
          {loading ? 'Đang kiểm tra...' : 'Kiểm tra quyền'}
        </Button>

        {result && (
          <div className="mt-4 p-4 border rounded-lg">
            <h4 className="font-semibold mb-2">Kết quả:</h4>
            <div className="space-y-2 text-sm">
              <p><strong>Message:</strong> {result.message}</p>
              <p><strong>Có quyền:</strong> 
                <span className={result.hasAccess ? 'text-green-600' : 'text-red-600'}>
                  {result.hasAccess ? ' Có' : ' Không'}
                </span>
              </p>
              <p><strong>Feature:</strong> {result.feature}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CheckFeatureExample;