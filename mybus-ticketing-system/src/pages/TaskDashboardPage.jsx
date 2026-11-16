import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Chip,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  Skeleton,
  Tooltip,
  Divider,
  InputAdornment,
  Stack,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import FlagIcon from '@mui/icons-material/Flag';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import { motion, AnimatePresence } from 'framer-motion';
import taskApi from '../api/taskApi';
import { tokens } from '../theme/designTokens';

const STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    color: '#f59e0b',
    bgColor: '#fef3c7',
    icon: <HourglassEmptyIcon fontSize="small" />,
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: '#2563eb',
    bgColor: '#dbeafe',
    icon: <PlayCircleOutlineIcon fontSize="small" />,
  },
  COMPLETED: {
    label: 'Completed',
    color: '#10b981',
    bgColor: '#d1fae5',
    icon: <CheckCircleOutlineIcon fontSize="small" />,
  },
  CANCELLED: {
    label: 'Cancelled',
    color: '#ef4444',
    bgColor: '#fee2e2',
    icon: <CancelOutlinedIcon fontSize="small" />,
  },
};

const PRIORITY_CONFIG = {
  LOW: { label: 'Low', color: '#64748b', bgColor: '#f1f5f9' },
  MEDIUM: { label: 'Medium', color: '#0284c7', bgColor: '#e0f2fe' },
  HIGH: { label: 'High', color: '#d97706', bgColor: '#fef3c7' },
  URGENT: { label: 'Urgent', color: '#dc2626', bgColor: '#fee2e2' },
};

const INITIAL_FORM_STATE = {
  title: '',
  description: '',
  status: 'PENDING',
  priority: 'MEDIUM',
};

const TaskDashboardPage = () => {
  // State: Data & Filtering
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // State: Modal Form (Create / Edit)
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [formGeneralError, setFormGeneralError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // State: Delete Dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // State: Toast Feedback
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  // Fetch tasks from backend
  const fetchTasks = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const params = {};
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (priorityFilter !== 'ALL') params.priority = priorityFilter;

      const res = await taskApi.getTasks(params);
      if (res && res.success) {
        setTasks(res.data || []);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load tasks', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [statusFilter, priorityFilter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Filter tasks by client-side search query
  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    const q = searchQuery.toLowerCase();
    return tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q))
    );
  }, [tasks, searchQuery]);

  // Compute status metrics
  const metrics = useMemo(() => {
    const total = tasks.length;
    const pending = tasks.filter((t) => t.status === 'PENDING').length;
    const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const completed = tasks.filter((t) => t.status === 'COMPLETED').length;
    const cancelled = tasks.filter((t) => t.status === 'CANCELLED').length;
    return { total, pending, inProgress, completed, cancelled };
  }, [tasks]);

  // Handle Form Open for Create
  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setFormData(INITIAL_FORM_STATE);
    setFormGeneralError('');
    setFieldErrors({});
    setModalOpen(true);
  };

  // Handle Form Open for Edit
  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title || '',
      description: task.description || '',
      status: task.status || 'PENDING',
      priority: task.priority || 'MEDIUM',
    });
    setFormGeneralError('');
    setFieldErrors({});
    setModalOpen(true);
  };

  // Form Field Change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Submit Create or Edit Form
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setFormGeneralError('');
    setFieldErrors({});

    // Client-side quick check
    if (!formData.title.trim()) {
      setFieldErrors({ title: 'Title is required' });
      return;
    }

    try {
      setSubmitting(true);
      if (editingTask) {
        const res = await taskApi.updateTask(editingTask.id, formData);
        if (res && res.success) {
          showToast('Task updated successfully!', 'success');
          setModalOpen(false);
          fetchTasks(true);
        }
      } else {
        const res = await taskApi.createTask(formData);
        if (res && res.success) {
          showToast('Task created successfully!', 'success');
          setModalOpen(false);
          fetchTasks(true);
        }
      }
    } catch (err) {
      // Backend validation error handling
      setFormGeneralError(err.message || 'Operation failed');
      if (err.validationErrors && typeof err.validationErrors === 'object') {
        setFieldErrors(err.validationErrors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Quick Status Change
  const handleQuickStatusChange = async (task, newStatus) => {
    if (task.status === newStatus) return;
    try {
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
      );
      await taskApi.updateTaskStatus(task.id, newStatus);
      showToast(`Task status updated to ${STATUS_CONFIG[newStatus]?.label || newStatus}`, 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
      fetchTasks(true); // Rollback
    }
  };

  // Handle Delete Confirmation Open
  const handleOpenDeleteDialog = (task) => {
    setTaskToDelete(task);
    setDeleteDialogOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      setDeleting(true);
      await taskApi.deleteTask(taskToDelete.id);
      showToast('Task deleted successfully', 'success');
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
      fetchTasks(true);
    } catch (err) {
      showToast(err.message || 'Failed to delete task', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleResetFilters = () => {
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
    setSearchQuery('');
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      {/* Top Banner & Header */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Box
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                p: 1,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(30, 58, 138, 0.25)',
              }}
            >
              <AssignmentIcon fontSize="medium" />
            </Box>
            <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: '-0.5px' }}>
              Task Manager
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Streamline, track, and execute operational workflows with real-time status management.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Tooltip title="Refresh tasks">
            <span>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => fetchTasks(true)}
                disabled={loading || refreshing}
                startIcon={
                  refreshing ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <RefreshIcon />
                  )
                }
                sx={{
                  borderRadius: 2.5,
                  borderColor: '#cbd5e1',
                  textTransform: 'none',
                  fontWeight: 600,
                  bgcolor: 'white',
                }}
              >
                Refresh
              </Button>
            </span>
          </Tooltip>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateModal}
            sx={{
              borderRadius: 2.5,
              textTransform: 'none',
              fontWeight: 700,
              px: 3,
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
              background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
            }}
          >
            Create Task
          </Button>
        </Stack>
      </Box>

      {/* Summary KPI Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[
          { label: 'Total Tasks', count: metrics.total, filterVal: 'ALL', color: '#1e3a8a', bg: '#eff6ff' },
          { label: 'Pending', count: metrics.pending, filterVal: 'PENDING', color: '#d97706', bg: '#fef3c7' },
          { label: 'In Progress', count: metrics.inProgress, filterVal: 'IN_PROGRESS', color: '#2563eb', bg: '#dbeafe' },
          { label: 'Completed', count: metrics.completed, filterVal: 'COMPLETED', color: '#10b981', bg: '#d1fae5' },
          { label: 'Cancelled', count: metrics.cancelled, filterVal: 'CANCELLED', color: '#ef4444', bg: '#fee2e2' },
        ].map((card, idx) => {
          const isSelected = statusFilter === card.filterVal;
          return (
            <Grid item xs={6} sm={4} md={2.4} key={idx}>
              <Card
                component={motion.div}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                onClick={() => setStatusFilter(card.filterVal)}
                sx={{
                  cursor: 'pointer',
                  borderRadius: 3,
                  p: 2,
                  bgcolor: isSelected ? card.bg : '#ffffff',
                  border: isSelected ? `2px solid ${card.color}` : '1px solid #e2e8f0',
                  boxShadow: isSelected
                    ? `0 6px 16px ${card.color}25`
                    : '0 1px 3px rgba(0,0,0,0.05)',
                  transition: 'all 0.2s ease',
                }}
              >
                <Typography variant="caption" fontWeight={700} sx={{ color: card.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {card.label}
                </Typography>
                <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5, color: '#0f172a' }}>
                  {loading ? <Skeleton width={40} /> : card.count}
                </Typography>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Search & Filter Toolbar */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: 3,
          border: '1px solid #e2e8f0',
          mb: 3,
          bgcolor: '#ffffff',
        }}
      >
        <Grid container spacing={2} alignItems="center">
          {/* Search Input */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: searchQuery ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchQuery('')}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2.5,
                  bgcolor: '#f8fafc',
                },
              }}
            />
          </Grid>

          {/* Status Filter */}
          <Grid item xs={6} md={2.5}>
            <FormControl fullWidth size="small">
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                id="status-filter"
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{ borderRadius: 2.5, bgcolor: '#f8fafc' }}
              >
                <MenuItem value="ALL">All Statuses</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
                <MenuItem value="CANCELLED">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Priority Filter */}
          <Grid item xs={6} md={2.5}>
            <FormControl fullWidth size="small">
              <InputLabel id="priority-filter-label">Priority</InputLabel>
              <Select
                labelId="priority-filter-label"
                id="priority-filter"
                value={priorityFilter}
                label="Priority"
                onChange={(e) => setPriorityFilter(e.target.value)}
                sx={{ borderRadius: 2.5, bgcolor: '#f8fafc' }}
              >
                <MenuItem value="ALL">All Priorities</MenuItem>
                <MenuItem value="LOW">Low</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="HIGH">High</MenuItem>
                <MenuItem value="URGENT">Urgent</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Controls: Reset & View Mode */}
          <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 1.5, alignItems: 'center' }}>
            {(statusFilter !== 'ALL' || priorityFilter !== 'ALL' || searchQuery) && (
              <Button
                size="small"
                variant="text"
                color="secondary"
                onClick={handleResetFilters}
                startIcon={<ClearIcon />}
                sx={{ fontWeight: 600, textTransform: 'none' }}
              >
                Clear Filters
              </Button>
            )}

            <ToggleButtonGroup
              size="small"
              value={viewMode}
              exclusive
              onChange={(e, val) => val && setViewMode(val)}
              sx={{ bgcolor: '#f1f5f9', borderRadius: 2 }}
            >
              <ToggleButton value="grid" aria-label="grid view">
                <GridViewIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton value="table" aria-label="table view">
                <ViewListIcon fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
      </Paper>

      {/* Task Content View */}
      {loading ? (
        <Grid container spacing={2.5}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Card sx={{ borderRadius: 3, p: 2 }}>
                <Skeleton variant="rectangular" height={24} width="40%" sx={{ mb: 1, borderRadius: 1 }} />
                <Skeleton variant="text" height={32} width="80%" />
                <Skeleton variant="text" height={20} width="100%" />
                <Skeleton variant="text" height={20} width="60%" sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={36} sx={{ borderRadius: 2 }} />
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : filteredTasks.length === 0 ? (
        <Box
          sx={{
            py: 8,
            px: 3,
            textAlign: 'center',
            bgcolor: '#ffffff',
            borderRadius: 4,
            border: '2px dashed #cbd5e1',
          }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              p: 2,
              bgcolor: '#f1f5f9',
              borderRadius: '50%',
              color: '#64748b',
              mb: 2,
            }}
          >
            <AssignmentIcon sx={{ fontSize: 48 }} />
          </Box>
          <Typography variant="h6" fontWeight={700} color="text.primary">
            No tasks found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 450, mx: 'auto', mt: 0.5, mb: 2.5 }}>
            {searchQuery || statusFilter !== 'ALL' || priorityFilter !== 'ALL'
              ? 'No tasks match your selected filter criteria. Try resetting the filters or clearing the search.'
              : 'You have no tasks created yet. Click below to create your first operational task!'}
          </Typography>
          {searchQuery || statusFilter !== 'ALL' || priorityFilter !== 'ALL' ? (
            <Button variant="outlined" onClick={handleResetFilters} sx={{ borderRadius: 2.5, textTransform: 'none' }}>
              Reset Filters
            </Button>
          ) : (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenCreateModal}
              sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 700 }}
            >
              Create New Task
            </Button>
          )}
        </Box>
      ) : viewMode === 'grid' ? (
        /* Grid Cards View */
        <Grid container spacing={2.5}>
          <AnimatePresence>
            {filteredTasks.map((task) => {
              const statusCfg = STATUS_CONFIG[task.status] || STATUS_CONFIG.PENDING;
              const priorityCfg = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.MEDIUM;

              return (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={task.id}
                  component={motion.div}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3,
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                      {/* Top Badges: Status & Priority */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                        <Chip
                          icon={statusCfg.icon}
                          label={statusCfg.label}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            color: statusCfg.color,
                            bgcolor: statusCfg.bgColor,
                            border: `1px solid ${statusCfg.color}40`,
                            borderRadius: 2,
                            '& .MuiChip-icon': { color: 'inherit' },
                          }}
                        />

                        <Chip
                          icon={<FlagIcon sx={{ fontSize: '14px !important' }} />}
                          label={priorityCfg.label}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            color: priorityCfg.color,
                            bgcolor: priorityCfg.bgColor,
                            border: `1px solid ${priorityCfg.color}30`,
                            borderRadius: 2,
                            '& .MuiChip-icon': { color: 'inherit' },
                          }}
                        />
                      </Box>

                      {/* Task Title */}
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{
                          color: '#0f172a',
                          mb: 1,
                          lineHeight: 1.3,
                          textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none',
                          opacity: task.status === 'COMPLETED' ? 0.75 : 1,
                        }}
                      >
                        {task.title}
                      </Typography>

                      {/* Task Description */}
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          minHeight: 40,
                          lineHeight: 1.5,
                        }}
                      >
                        {task.description || (
                          <span style={{ fontStyle: 'italic', color: '#94a3b8' }}>
                            No description provided.
                          </span>
                        )}
                      </Typography>

                      <Divider sx={{ my: 1.5 }} />

                      {/* Quick Status Dropdown */}
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                          Change Status:
                        </Typography>
                        <Select
                          size="small"
                          value={task.status}
                          onChange={(e) => handleQuickStatusChange(task, e.target.value)}
                          sx={{
                            fontSize: '0.8rem',
                            height: 28,
                            borderRadius: 1.5,
                            bgcolor: '#f8fafc',
                            '& .MuiSelect-select': { py: 0.5, px: 1 },
                          }}
                        >
                          <MenuItem value="PENDING">Pending</MenuItem>
                          <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                          <MenuItem value="COMPLETED">Completed</MenuItem>
                          <MenuItem value="CANCELLED">Cancelled</MenuItem>
                        </Select>
                      </Box>
                    </CardContent>

                    {/* Bottom Actions & Dates */}
                    <CardActions
                      sx={{
                        p: 2,
                        pt: 0,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        ID: #{task.id} • {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'Recent'}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Edit task">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEditModal(task)}
                            sx={{ color: '#2563eb', bgcolor: '#eff6ff', '&:hover': { bgcolor: '#dbeafe' } }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete task">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDeleteDialog(task)}
                            sx={{ color: '#ef4444', bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' } }}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </AnimatePresence>
        </Grid>
      ) : (
        /* Table View */
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ borderRadius: 3, border: '1px solid #e2e8f0', overflow: 'hidden' }}
        >
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Title & Description</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Priority</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Created At</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTasks.map((task) => {
                const statusCfg = STATUS_CONFIG[task.status] || STATUS_CONFIG.PENDING;
                const priorityCfg = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.MEDIUM;

                return (
                  <TableRow key={task.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>#{task.id}</TableCell>
                    <TableCell sx={{ maxWidth: 300 }}>
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        sx={{
                          color: '#0f172a',
                          textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none',
                        }}
                      >
                        {task.title}
                      </Typography>
                      {task.description && (
                        <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                          {task.description}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Select
                        size="small"
                        value={task.status}
                        onChange={(e) => handleQuickStatusChange(task, e.target.value)}
                        sx={{
                          fontSize: '0.8rem',
                          height: 28,
                          borderRadius: 2,
                          bgcolor: statusCfg.bgColor,
                          color: statusCfg.color,
                          fontWeight: 700,
                          '& .MuiSelect-select': { py: 0.5, px: 1 },
                        }}
                      >
                        <MenuItem value="PENDING">Pending</MenuItem>
                        <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                        <MenuItem value="COMPLETED">Completed</MenuItem>
                        <MenuItem value="CANCELLED">Cancelled</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={priorityCfg.label}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          color: priorityCfg.color,
                          bgcolor: priorityCfg.bgColor,
                          borderRadius: 1.5,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                      {task.createdAt ? new Date(task.createdAt).toLocaleString() : 'N/A'}
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <IconButton size="small" onClick={() => handleOpenEditModal(task)} color="primary">
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleOpenDeleteDialog(task)} color="error">
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create / Edit Task Modal */}
      <Dialog
        open={modalOpen}
        onClose={() => !submitting && setModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3.5, p: 1 },
        }}
      >
        <DialogTitle sx={{ pb: 1, fontWeight: 800, fontSize: '1.25rem' }}>
          {editingTask ? `Edit Task #${editingTask.id}` : 'Create New Task'}
        </DialogTitle>

        <form onSubmit={handleSubmitForm}>
          <DialogContent sx={{ pt: 1 }}>
            {/* General Server Error Alert */}
            {formGeneralError && (
              <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
                {formGeneralError}
              </Alert>
            )}

            <Stack spacing={2.5}>
              {/* Task Title */}
              <TextField
                autoFocus
                required
                fullWidth
                id="task-title"
                name="title"
                label="Task Title"
                placeholder="e.g. Inspect bus brakes before departure"
                value={formData.title}
                onChange={handleFormChange}
                error={Boolean(fieldErrors.title)}
                helperText={fieldErrors.title || `${formData.title.length}/200 characters`}
                inputProps={{ maxLength: 200 }}
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: 2.5 },
                }}
              />

              {/* Task Description */}
              <TextField
                fullWidth
                multiline
                rows={4}
                id="task-description"
                name="description"
                label="Description"
                placeholder="Add detailed steps, notes, or operational instructions..."
                value={formData.description}
                onChange={handleFormChange}
                error={Boolean(fieldErrors.description)}
                helperText={fieldErrors.description}
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: 2.5 },
                }}
              />

              {/* Status and Priority Row */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="modal-status-label">Status</InputLabel>
                    <Select
                      labelId="modal-status-label"
                      id="modal-status"
                      name="status"
                      value={formData.status}
                      label="Status"
                      onChange={handleFormChange}
                      sx={{ borderRadius: 2.5 }}
                    >
                      <MenuItem value="PENDING">Pending</MenuItem>
                      <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                      <MenuItem value="COMPLETED">Completed</MenuItem>
                      <MenuItem value="CANCELLED">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="modal-priority-label">Priority</InputLabel>
                    <Select
                      labelId="modal-priority-label"
                      id="modal-priority"
                      name="priority"
                      value={formData.priority}
                      label="Priority"
                      onChange={handleFormChange}
                      sx={{ borderRadius: 2.5 }}
                    >
                      <MenuItem value="LOW">Low</MenuItem>
                      <MenuItem value="MEDIUM">Medium</MenuItem>
                      <MenuItem value="HIGH">High</MenuItem>
                      <MenuItem value="URGENT">Urgent</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2, pt: 1, gap: 1 }}>
            <Button
              onClick={() => setModalOpen(false)}
              disabled={submitting}
              color="inherit"
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : null}
              sx={{
                borderRadius: 2,
                px: 3,
                textTransform: 'none',
                fontWeight: 700,
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
              }}
            >
              {submitting ? 'Saving...' : editingTask ? 'Update Task' : 'Create Task'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deleting && setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: 'error.main' }}>
          Delete Task?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete task{' '}
            <strong>"{taskToDelete?.title}"</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleting}
            color="inherit"
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={18} color="inherit" /> : <DeleteOutlineIcon />}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Feedback */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          variant="filled"
          sx={{ borderRadius: 2.5, fontWeight: 600, boxShadow: '0 6px 18px rgba(0,0,0,0.15)' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TaskDashboardPage;
