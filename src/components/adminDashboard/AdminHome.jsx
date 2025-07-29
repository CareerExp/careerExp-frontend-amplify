import { Box, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CreatorIcon, MaleFemaleIcon, NewUser, TotalUsers } from "../../assets/assest.js";
import { getGeneralUserData, selectGeneralData } from "../../redux/slices/adminSlice.js";
import { selectToken } from "../../redux/slices/authSlice.js";
import { fonts } from "../../utility/fonts.js";
import { notify } from "../../redux/slices/alertSlice.js";

const AdminHome = () => {
  const dispatchToRedux = useDispatch();
  const generalData = useSelector(selectGeneralData);
  const token = useSelector(selectToken);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resultAction = await dispatchToRedux(getGeneralUserData({ token }));

        if (getGeneralUserData.fulfilled.match(resultAction)) {
          const data = resultAction.payload;
          if (data?.success) {
            dispatchToRedux(
              notify({
                message: data?.message || "Last 7 days data fetched successfully",
                type: "success",
              }),
            );
          } else {
            dispatchToRedux(
              notify({
                message: data?.message || "Failed to load user data",
                type: "error",
              }),
            );
          }
        } else if (getGeneralUserData.rejected.match(resultAction)) {
          const error = resultAction.payload || resultAction.error;
          dispatchToRedux(
            notify({
              message: error?.message || "Failed to fetch user data",
              type: "error",
            }),
          );
        }
      } catch (error) {
        dispatchToRedux(
          notify({
            message: error.message || "An unexpected error occurred",
            type: "error",
          }),
        );
      }
    };

    fetchData();
  }, [dispatchToRedux, token]);

  return (
    <div>
      <Typography variant="h5" sx={{ fontFamily: fonts.poppins, fontWeight: "600" }}>
        Hi, Welcome Back
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          mt: 4,
          justifyContent: { xs: "center", md: "space-between" },
        }}
      >
        <DetailsCard icon={NewUser} numbers={generalData?.last7DaysJoinedUsers} title={"New Users"} />
        <DetailsCard icon={TotalUsers} numbers={generalData?.totalUsers} title={"Total Users"} />
        <DetailsCard icon={CreatorIcon} numbers={generalData?.totalCreators} title={"Total Counsellors"} />

        <Box
          sx={{
            width: { xs: "100%", sm: "45%", md: "23%" },
            height: "150px",
            backgroundColor: "white",
            borderRadius: "10px",
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
            mb: { xs: 2, md: 0 },
          }}
        >
          <img src={MaleFemaleIcon} alt="users" width={"80px"} height={"80px"} />
          <Box>
            <Typography variant="h6" sx={{ fontFamily: fonts.poppins, fontWeight: "600" }}>
              {generalData?.maleCount} / {generalData?.femaleCount} / {generalData?.otherGenderCount}
            </Typography>
            <Typography
              variant="body"
              sx={{
                fontFamily: fonts.poppins,
                fontWeight: "600",
                color: "gray",
              }}
            >
              M / F / OT
            </Typography>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default AdminHome;

const DetailsCard = ({ icon, numbers, title }) => {
  return (
    <Box
      sx={{
        width: { xs: "100%", sm: "45%", md: "23%" },
        height: "150px",
        backgroundColor: "white",
        borderRadius: "10px",
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
      }}
    >
      <img src={icon} alt="users" width={"80px"} height={"80px"} />
      <Box>
        <Typography variant="h6" sx={{ fontFamily: fonts.poppins, fontWeight: "600" }}>
          {numbers}
        </Typography>
        <Typography variant="body" sx={{ fontFamily: fonts.poppins, fontWeight: "600", color: "gray" }}>
          {title}
        </Typography>
      </Box>
    </Box>
  );
};
