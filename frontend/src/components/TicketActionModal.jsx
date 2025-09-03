import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Alert,
  Box,
  CircularProgress,
  Chip,
  Grid,
  Typography
} from '@mui/material';
import { MdCheckCircle, MdCancel, MdInfo } from 'react-icons/md';
import { getTicketApprovals, approveTicket, rejectTicket } from '../services/approvalService';
import { useAuth } from '../contexts/AuthContext';

export default function TicketActionModal({ 
  visible, 
  onClose, 
  ticketId, 
  taskId,
  action, // 'approve' or 'reject' or 'view'
  onSuccess 
}) {

  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [ticketDetails, setTicketDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [formData, setFormData] = useState({
    note: '',
    reason: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (visible && ticketId) {
      fetchTicketDetails();
      setFormData({ note: '', reason: '' });
      setError('');
    }
  }, [visible, ticketId]);

  const fetchTicketDetails = async () => {
    setLoadingDetails(true);
    setError('');
    try {
      const data = await getTicketApprovals(ticketId);
      setTicketDetails(data);
    } catch (error) {
      setError('Không thể tải thông tin ticket');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleSubmit = async () => {
    if (action === 'reject' && !formData.reason.trim()) {
      setError('Vui lòng nhập lý do từ chối');
      return;
    }

    setLoading(true);
    setError('');
    try {
      if (action === 'approve') {
        await approveTicket(ticketId, taskId, formData.note, user?.id);
      } else if (action === 'reject') {
        await rejectTicket(ticketId, taskId, formData.reason, user?.id);
      }
      
      onSuccess && onSuccess();
      handleClose();
    } catch (error) {
      setError(action === 'approve' ? 'Lỗi khi duyệt ticket' : 'Lỗi khi từ chối ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ note: '', reason: '' });
    setError('');
    onClose();
  };

  const getModalTitle = () => {
    switch (action) {
      case 'approve':
        return 'Duyệt Ticket';
      case 'reject':
        return 'Từ chối Ticket';
      default:
        return 'Chi tiết Ticket';
    }
  };

  const getIcon = () => {
    switch (action) {
      case 'approve':
        return <MdCheckCircle className="text-green-500 text-xl" />;
      case 'reject':
        return <MdCancel className="text-red-500 text-xl" />;
      default:
        return <MdInfo className="text-blue-500 text-xl" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Dialog
      open={visible}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          {getIcon()}
          <span>{getModalTitle()}</span>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {loadingDetails ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : ticketDetails ? (
        <Box sx={{ '& > *': { mb: 3 } }}>
          {/* Ticket Information */}
          <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Thông tin Ticket
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Mã Ticket
                </Typography>
                <Typography variant="body1">
                  {ticketDetails.ticketCode || 'Không có'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Tiêu đề
                </Typography>
                <Typography variant="body1">
                  {ticketDetails.title || 'Không có'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Người tạo
                </Typography>
                <Typography variant="body1">
                  {ticketDetails.requesterName || 'Không có'} ({ticketDetails.requesterId || 'N/A'})
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Phòng ban
                </Typography>
                <Typography variant="body1">
                  {ticketDetails.departmentName || 'Không có'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Loại yêu cầu
                </Typography>
                <Typography variant="body1">
                  {ticketDetails.formTemplateName || 'Không có'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Mức ưu tiên
                </Typography>
                <Chip
                  label={ticketDetails.priorityName || 'Không có'}
                  size="small"
                  sx={{
                    backgroundColor: getPriorityColor(ticketDetails.priorityName).includes('red') ? '#ffebee' : 
                                   getPriorityColor(ticketDetails.priorityName).includes('yellow') ? '#fff8e1' : '#e8f5e8',
                    color: getPriorityColor(ticketDetails.priorityName).includes('red') ? '#c62828' :
                           getPriorityColor(ticketDetails.priorityName).includes('yellow') ? '#f57f17' : '#2e7d32'
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Ngày tạo
                </Typography>
                <Typography variant="body1">
                  {ticketDetails.createdAt ? formatDate(ticketDetails.createdAt) : 'Không có'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Hạn xử lý
                </Typography>
                <Typography variant="body1">
                  {ticketDetails.dueDate ? formatDate(ticketDetails.dueDate) : 'Không có'}
                </Typography>
              </Grid>
            </Grid>
            {ticketDetails.description && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Mô tả
                </Typography>
                <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 1, border: '1px solid #e0e0e0' }}>
                  <Typography variant="body1">
                    {ticketDetails.description}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>

                     {/* Ticket Form Data */}
           {ticketDetails.formData && Object.keys(ticketDetails.formData).length > 0 && (
             <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
               <Typography variant="h6" gutterBottom>
                 Dữ liệu form
               </Typography>
               <Box sx={{ '& > *': { mb: 2 } }}>
                 {Object.entries(ticketDetails.formData).map(([key, value], index) => (
                   <Box key={index} sx={{ bgcolor: 'white', p: 2, borderRadius: 1, border: '1px solid #e0e0e0' }}>
                     <Typography variant="body2" color="text.secondary" gutterBottom>
                       {key}
                     </Typography>
                     <Typography variant="body1">
                       {String(value)}
                     </Typography>
                   </Box>
                 ))}
               </Box>
             </Box>
           )}

          {/* Approval History */}
          {ticketDetails.approvals && ticketDetails.approvals.length > 0 && (
            <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Lịch sử duyệt
              </Typography>
              <Box sx={{ '& > *': { mb: 2 } }}>
                {ticketDetails.approvals.map((approval, index) => (
                  <Box key={index} sx={{ bgcolor: 'white', p: 2, borderRadius: 1, border: '1px solid #e0e0e0' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {approval.workflowStepName || `Bước ${approval.stepOrder || 'N/A'}`}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {approval.approverName ? 
                            `${approval.approverName} (${approval.approverId || 'N/A'})` : 
                            'Chưa được xử lý'
                          }
                        </Typography>
                      </Box>
                      <Box textAlign="right">
                        <Chip
                          label={
                            approval.action === 'APPROVE' ? 'Đã duyệt' :
                            approval.action === 'REJECT' ? 'Từ chối' : 'Chờ duyệt'
                          }
                          size="small"
                          sx={{
                            backgroundColor: 
                              approval.action === 'APPROVE' ? '#e8f5e8' :
                              approval.action === 'REJECT' ? '#ffebee' : '#fff8e1',
                            color:
                              approval.action === 'APPROVE' ? '#2e7d32' :
                              approval.action === 'REJECT' ? '#c62828' : '#f57f17'
                          }}
                        />
                        {approval.updatedAt && (
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                            {formatDate(approval.updatedAt)}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    {approval.comments && (
                      <Box sx={{ mt: 1, bgcolor: 'grey.50', p: 1, borderRadius: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {approval.comments}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Action Form */}
          {action !== 'view' && (
            <Box sx={{ mt: 3 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label={action === 'approve' ? 'Ghi chú (tùy chọn)' : 'Lý do từ chối'}
                value={action === 'approve' ? formData.note : formData.reason}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  [action === 'approve' ? 'note' : 'reason']: e.target.value
                }))}
                placeholder={action === 'approve' ? 
                  'Nhập ghi chú về quyết định duyệt...' : 
                  'Nhập lý do từ chối...'
                }
                required={action === 'reject'}
              />
            </Box>
          )}
        </Box>
      ) : (
          <Box textAlign="center" py={4}>
            <Typography color="text.secondary">
              Không tìm thấy thông tin ticket
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>
          {action === 'view' ? 'Đóng' : 'Hủy'}
        </Button>
        {action !== 'view' && (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              backgroundColor: action === 'approve' ? '#4caf50' : '#f44336',
              '&:hover': {
                backgroundColor: action === 'approve' ? '#45a049' : '#da190b'
              }
            }}
          >
            {loading ? <CircularProgress size={20} /> : (action === 'approve' ? 'Duyệt' : 'Từ chối')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
