import { all, fork } from 'redux-saga/effects';

// Import admin-focused sagas only (MyJob scope)
import userSaga from './userSaga';
import departmentSaga from './departmentSaga';
import dashboardSaga from './dashboardSaga';

// Root saga - admin functions only
export default function* rootSaga() {
  yield all([
    fork(userSaga),          // *** User management saga
    fork(departmentSaga),    // *** Department management saga
    fork(dashboardSaga),     // *** Admin dashboard saga
  ]);
}
