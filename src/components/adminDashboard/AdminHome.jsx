import { Box, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ComputerIcon from "@mui/icons-material/Computer";
import { CreatorIcon, MaleFemaleIcon, NewUser, TotalUsers } from "../../assets/assest.js";
import { getGeneralUserData, selectGeneralData } from "../../redux/slices/adminSlice.js";
import { selectToken } from "../../redux/slices/authSlice.js";
import { fonts } from "../../utility/fonts.js";
import { notify } from "../../redux/slices/alertSlice.js";

/** Card with icon in colored circle - for Total Students, Counsellor, EI, ESP */
const ColoredIconCard = ({ IconComponent, iconColor, bgColor, value, title }) => (
  <Box
    sx={{
      width: { xs: "100%", sm: "45%", md: "23%" },
      height: "150px",
      backgroundColor: "white",
      borderRadius: "10px",
      display: "flex",
      justifyContent: "space-evenly",
      alignItems: "center",
      boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
    }}
  >
    <Box
      sx={{
        width: 80,
        height: 80,
        borderRadius: "50%",
        backgroundColor: bgColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <IconComponent sx={{ fontSize: 40, color: iconColor }} />
    </Box>
    <Box>
      <Typography variant="h6" sx={{ fontFamily: fonts.poppins, fontWeight: "600" }}>
        {value ?? 0}
      </Typography>
      <Typography variant="body2" sx={{ fontFamily: fonts.poppins, fontWeight: "600", color: "gray" }}>
        {title}
      </Typography>
    </Box>
  </Box>
);

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
      <Box sx={{ ml: 2, mt: 2 }}>
        <Typography variant="h5" fontWeight="600" sx={{ fontFamily: fonts.poppins }}>
        Hi, Welcome Back
      </Typography> 
      </Box>

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

        <ColoredIconCard
          IconComponent={SchoolIcon}
          iconColor="#7B1FA2"
          bgColor="#E1BEE7"
          value={generalData?.totalStudents}
          title="Total Students"
        />
        <ColoredIconCard
          IconComponent={PersonIcon}
          iconColor="#D32F2F"
          bgColor="#FFCDD2"
          value={generalData?.totalCounsellors}
          title="Total Counsellor"
        />
        <ColoredIconCard
          IconComponent={AccountBalanceIcon}
          iconColor="#00897B"
          bgColor="#B2DFDB"
          value={generalData?.totalEIUsers}
          title="Total EI User"
        />
        <ColoredIconCard
          IconComponent={ComputerIcon}
          iconColor="#F57C00"
          bgColor="#FFE0B2"
          value={generalData?.totalESPUsers}
          title="Total ESP User"
        />

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
