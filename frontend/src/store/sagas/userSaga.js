import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { userService } from '../../services';
import {
  setLoading,
  setError,
  setUsers,
  addUser,
  updateUser,
  removeUser,
  setSelectedUser,
} from '../slices/userSlice';

// Action types cho sagas
export const USER_SAGA_ACTIONS = {
  FETCH_USERS: 'users/fetchUsers',
  FETCH_USER_BY_ID: 'users/fetchUserById',
  SEARCH_USERS: 'users/searchUsers',
  CREATE_USER: 'users/createUser',
  UPDATE_USER: 'users/updateUser',
  DEACTIVATE_USER: 'users/deactivateUser',
  DELETE_USER: 'users/deleteUser',
};

// Saga workers
function* fetchUsersSaga() {
  try {
    yield put(setLoading(true));
    const response = yield call(userService.getAllUsers);
    yield put(setUsers(response.data));
  } catch (error) {
    yield put(setError(error.response?.data?.message || 'Lỗi khi tải danh sách người dùng'));
  }
}

function* fetchUserByIdSaga(action) {
  try {
    yield put(setLoading(true));
    const response = yield call(userService.getUserById, action.payload);
    yield put(setSelectedUser(response.data));
  } catch (error) {
    yield put(setError(error.response?.data?.message || 'Lỗi khi tải thông tin người dùng'));
  }
}

function* searchUsersSaga(action) {
  try {
    yield put(setLoading(true));
    const response = yield call(userService.searchUsersByName, action.payload);
    yield put(setUsers(response.data));
  } catch (error) {
    yield put(setError(error.response?.data?.message || 'Lỗi khi tìm kiếm người dùng'));
  }
}

function* createUserSaga(action) {
  try {
    yield put(setLoading(true));
    const response = yield call(userService.createUser, action.payload);
    yield put(addUser(response.data));
    // Có thể dispatch success message ở đây
  } catch (error) {
    yield put(setError(error.response?.data?.message || 'Lỗi khi tạo người dùng'));
  }
}

function* updateUserSaga(action) {
  try {
    yield put(setLoading(true));
    const { id, userData } = action.payload;
    const response = yield call(userService.updateUser, id, userData);
    yield put(updateUser(response.data));
  } catch (error) {
    yield put(setError(error.response?.data?.message || 'Lỗi khi cập nhật người dùng'));
  }
}

function* deactivateUserSaga(action) {
  try {
    yield put(setLoading(true));
    yield call(userService.deactivateUser, action.payload);
    // Refresh users list after deactivation
    yield call(fetchUsersSaga);
  } catch (error) {
    yield put(setError(error.response?.data?.message || 'Lỗi khi vô hiệu hóa người dùng'));
  }
}

function* deleteUserSaga(action) {
  try {
    yield put(setLoading(true));
    yield call(userService.deleteUser, action.payload);
    yield put(removeUser(action.payload));
  } catch (error) {
    yield put(setError(error.response?.data?.message || 'Lỗi khi xóa người dùng'));
  }
}

// Watcher saga
export default function* userSaga() {
  yield takeEvery(USER_SAGA_ACTIONS.FETCH_USERS, fetchUsersSaga);
  yield takeLatest(USER_SAGA_ACTIONS.FETCH_USER_BY_ID, fetchUserByIdSaga);
  yield takeLatest(USER_SAGA_ACTIONS.SEARCH_USERS, searchUsersSaga);
  yield takeEvery(USER_SAGA_ACTIONS.CREATE_USER, createUserSaga);
  yield takeEvery(USER_SAGA_ACTIONS.UPDATE_USER, updateUserSaga);
  yield takeEvery(USER_SAGA_ACTIONS.DEACTIVATE_USER, deactivateUserSaga);
  yield takeEvery(USER_SAGA_ACTIONS.DELETE_USER, deleteUserSaga);
}
