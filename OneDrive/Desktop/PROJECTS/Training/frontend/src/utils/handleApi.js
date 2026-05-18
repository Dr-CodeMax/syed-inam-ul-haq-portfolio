export const handleApi = async (apiCall, setLoading) => {
  try {
    setLoading(true);
    const res = await apiCall();
    return res.data;
  } catch (err) {
    alert(err.response?.data?.detail || "Something went wrong");
    throw err;
  } finally {
    setLoading(false);
  }
};