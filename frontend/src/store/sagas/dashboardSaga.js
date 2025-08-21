import { call, put, takeLatest } from 'redux-saga/effects';
import dashboardService from '../../services/dashboardService';
import {
  setQuickStatsLoading,
  setQuickStatsError,
  setQuickStats,
  setDepartmentStatsLoading,
  setDepartmentStatsError,
  setDepartmentStats,
  setOverviewStatsLoading,
  setOverviewStatsError,
  setOverviewStats,
} from '../slices/dashboardSlice';

// Quick Stats Saga
function* fetchQuickStatsSaga() {
  try {
    yield put(setQuickStatsLoading(true));
    const response = yield call(dashboardService.getQuickStats);
    
    // Transform backend data to match our state structure
    const transformedData = {
      totalUsers: response.data?.totalUsers || 0,
      totalDepartments: response.data?.totalDepartments || 0,
      totalTickets: response.data?.totalTickets || 0,
      processingRate: response.data?.processingRate || 0,
      activeUsers: response.data?.activeUsers || 0,
      totalRoles: response.data?.totalRoles || 3, // Default fallback
    };
    
    yield put(setQuickStats(transformedData));
  } catch (error) {
    console.error('Dashboard Quick Stats Error:', error);
    yield put(setQuickStatsError(error.message || 'Lỗi tải thống kê nhanh'));
  }
}

// Users by Department Saga  
function* fetchUsersByDepartmentSaga() {
  try {
    yield put(setDepartmentStatsLoading(true));
    const response = yield call(dashboardService.getUsersByDepartment);
    
    // Transform to chart format
    const transformedData = response.data?.map(dept => ({
      name: dept.departmentName || dept.name || 'Unknown',
      users: dept.userCount || dept.count || 0,
      percentage: dept.percentage || 0,
    })) || [];
    
    yield put(setDepartmentStats(transformedData));
  } catch (error) {
    console.error('Dashboard Department Stats Error:', error);
    yield put(setDepartmentStatsError(error.message || 'Lỗi tải dữ liệu phòng ban'));
  }
}

// Users by Role Saga
function* fetchUsersByRoleSaga() {
  try {
    yield put(setOverviewStatsLoading(true));
    const response = yield call(dashboardService.getUsersByRole);
    
    // Transform to chart format with colors
    const chartColors = ['#1976d2', '#2e7d32', '#ed6c02', '#9c27b0', '#d32f2f'];
    const transformedData = response.data?.map((role, index) => ({
      name: role.roleName || role.name || 'Unknown',
      value: role.userCount || role.count || 0,
      color: chartColors[index % chartColors.length],
    })) || [];
    
    yield put(setOverviewStats(transformedData));
  } catch (error) {
    console.error('Dashboard Role Stats Error:', error);
    yield put(setOverviewStatsError(error.message || 'Lỗi tải dữ liệu vai trò'));
  }
}

// Overview Stats Saga (for period-based data)
function* fetchOverviewStatsSaga(action) {
  try {
    yield put(setOverviewStatsLoading(true));
    const { period } = action.payload;
    const response = yield call(dashboardService.getStatisticsByPeriod, period);
    
    yield put(setOverviewStats(response.data));
  } catch (error) {
    console.error('Dashboard Overview Stats Error:', error);
    yield put(setOverviewStatsError(error.message || 'Lỗi tải thống kê tổng quan'));
  }
}

// Watcher Sagas
export default function* dashboardSaga() {
  yield takeLatest('dashboard/fetchQuickStats', fetchQuickStatsSaga);
  yield takeLatest('dashboard/fetchUsersByDepartment', fetchUsersByDepartmentSaga);
  yield takeLatest('dashboard/fetchUsersByRole', fetchUsersByRoleSaga);
  yield takeLatest('dashboard/fetchOverviewStats', fetchOverviewStatsSaga);
}
