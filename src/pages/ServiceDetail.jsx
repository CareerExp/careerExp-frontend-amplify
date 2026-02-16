import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ServiceDetailContent from "../components/ServiceDetailContent.jsx";

/**
 * Service detail page (Explore). Uses GET /api/services/:id and POST /api/services/:id/cta.
 */
const ServiceDetail = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams();

  return (
    <ServiceDetailContent
      serviceId={serviceId}
      onBack={() => navigate("/explore")}
    />
  );
};

export default ServiceDetail;
