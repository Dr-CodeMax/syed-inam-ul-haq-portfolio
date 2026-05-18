import api from "./api";

// =====================================================
// ✅ ADMIN ANALYTICS
// =====================================================

export const getAdminAnalytics = async () => {

  const res = await api.get(
    "/admin/analytics"
  );

  return res.data;
};


// =====================================================
// ✅ RECENT ACTIVITIES
// =====================================================

export const getRecentActivities = async () => {

  const res = await api.get(
    "/admin/activity"
  );

  return res.data;
};


// =====================================================
// ✅ GET ALL USERS
// =====================================================

export const getAllUsers = async () => {

  const res = await api.get(
    "/admin/users"
  );

  return res.data;
};


// =====================================================
// ✅ UPDATE USER
// =====================================================

export const updateUser = async (
  userId,
  updateData
) => {

  const res = await api.put(
    `/admin/users/${userId}`,
    {
      name:
        updateData.name,

      is_active:
        updateData.is_active,
    }
  );

  return res.data;
};