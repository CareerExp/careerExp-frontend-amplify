// import { Box, Button, Checkbox, FormControlLabel, Modal, Typography } from "@mui/material";
// import React, { useState } from "react";
// import { Link } from "react-router-dom";

// const TermsAndConditionsModal = ({ open, handleClose, handleAgree }) => {
//   const [isChecked, setIsChecked] = useState(false);

//   const handleCheckboxChange = (event) => {
//     setIsChecked(event.target.checked);
//   };

//   return (
//     <Modal open={open} onClose={handleClose}>
//       <Box
//         sx={{
//           position: "absolute",
//           top: "50%",
//           left: "50%",
//           transform: "translate(-50%, -50%)",
//           width: 600,
//           bgcolor: "background.paper",
//           //   border: "2px solid #000",
//           boxShadow: 24,
//           //   p: 4,
//           borderRadius: "25px",
//         }}
//       >
//         <Box
//           sx={{
//             background: "linear-gradient(to top left, #720361, #bf2f75)",
//             p: 3,
//             borderRadius: "25px 25px 0 0",
//           }}
//         >
//           <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "center", color: "white" }}>
//             Terms & Conditions
//           </Typography>
//         </Box>
//         <Typography sx={{ mt: 2, paddingLeft: "2rem" }}>
//           By signing up, you agree to our Terms and Conditions. Please review them carefully before
//           proceeding.{" "}
//           <Link to="/terms-and-conditions">
//             {" "}
//             <span style={{ cursor: "pointer", color: "blue", fontSize: "14px" }}> Read more...</span>
//           </Link>
//         </Typography>

//         <FormControlLabel
//           control={<Checkbox checked={isChecked} onChange={handleCheckboxChange} />}
//           label="I agree to the Terms and Conditions"
//           sx={{ paddingLeft: "2rem" }}
//         />
//         <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between", p: 4 }}>
//           <Button
//             variant="outlined"
//             onClick={handleClose}
//             sx={{
//               background: "linear-gradient(124.89deg, #BF2F75 -3.87%, #720361 63.8%)",
//               width: "30%",
//               "&:hover": {
//                 background: "linear-gradient(124.89deg, #BF2F75 -3.87%, #720361 63.8%)",
//               },
//               borderRadius: "2rem",
//               padding: "10px 0px",
//               fontWeight: "bold",
//               color: "white",
//             }}
//           >
//             Cancel
//           </Button>
//           <Button
//             variant="contained"
//             sx={{
//               background: "linear-gradient(124.89deg, #BF2F75 -3.87%, #720361 63.8%)",
//               width: "40%",
//               "&:hover": {
//                 background: "linear-gradient(124.89deg, #BF2F75 -3.87%, #720361 63.8%)",
//               },
//               borderRadius: "2rem",
//               padding: "10px 0px",
//               fontWeight: "bold",
//               color: "white",
//             }}
//             onClick={() => handleAgree(isChecked)}
//             disabled={!isChecked}
//           >
//             Agree & Continue
//           </Button>
//         </Box>
//       </Box>
//     </Modal>
//   );
// };

// export default TermsAndConditionsModal;
import { Box, Button, Checkbox, FormControlLabel, Modal, Typography } from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const TermsAndConditionsModal = ({ open, handleClose, handleAgree }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: {
            xs: "90%", // mobile (480px and below)
            sm: "80%", // small devices (480px-600px)
            md: 600, // desktop (600px and above)
          },
          maxWidth: "95vw",
          maxHeight: "90vh",
          overflow: "auto",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: "25px",
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(to top left, #720361, #bf2f75)",
            p: {
              xs: 2, // mobile
              sm: 3, // desktop
            },
            borderRadius: "25px 25px 0 0",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              color: "white",
              fontSize: {
                xs: "1rem", // mobile
                sm: "1.25rem", // desktop
              },
            }}
          >
            Terms & Conditions
          </Typography>
        </Box>
        <Typography
          sx={{
            mt: 2,
            px: {
              xs: 2, // mobile
              sm: "2rem", // desktop
            },
            fontSize: {
              xs: "0.875rem", // mobile
              sm: "1rem", // desktop
            },
          }}
        >
          By signing up, you agree to our Terms and Conditions. Please review them carefully before
          proceeding.{" "}
          <Link to="/terms-and-conditions">
            <span
              style={{
                cursor: "pointer",
                color: "blue",
                fontSize: {
                  xs: "0.75rem", // mobile
                  sm: "0.875rem", // desktop
                },
              }}
            >
              {" "}
              Read more...
            </span>
          </Link>
        </Typography>

        <FormControlLabel
          control={<Checkbox checked={isChecked} onChange={handleCheckboxChange} />}
          label="I agree to the Terms and Conditions"
          sx={{
            px: {
              xs: 2, // mobile
              sm: "2rem", // desktop
            },
            "& .MuiTypography-root": {
              fontSize: {
                xs: "0.875rem", // mobile
                sm: "1rem", // desktop
              },
            },
          }}
        />
        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "space-between",
            p: {
              xs: 2, // mobile
              sm: 4, // desktop
            },
            flexDirection: {
              xs: "column", // mobile - stack buttons vertically
              sm: "row", // desktop - side by side
            },
            gap: {
              xs: 2, // mobile - add gap between stacked buttons
              sm: 0, // desktop - no gap needed
            },
          }}
        >
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{
              background: "linear-gradient(124.89deg, #BF2F75 -3.87%, #720361 63.8%)",
              width: {
                xs: "100%", // mobile - full width
                sm: "30%", // desktop - 30% width
              },
              "&:hover": {
                background: "linear-gradient(124.89deg, #BF2F75 -3.87%, #720361 63.8%)",
              },
              borderRadius: "2rem",
              padding: "10px 0px",
              fontWeight: "bold",
              color: "white",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{
              background: "linear-gradient(124.89deg, #BF2F75 -3.87%, #720361 63.8%)",
              width: {
                xs: "100%", // mobile - full width
                sm: "40%", // desktop - 40% width
              },
              "&:hover": {
                background: "linear-gradient(124.89deg, #BF2F75 -3.87%, #720361 63.8%)",
              },
              borderRadius: "2rem",
              padding: "10px 0px",
              fontWeight: "bold",
              color: "white",
            }}
            onClick={() => handleAgree(isChecked)}
            disabled={!isChecked}
          >
            Agree & Continue
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default TermsAndConditionsModal;
