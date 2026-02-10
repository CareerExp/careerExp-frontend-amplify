import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Headers from "../components/Headers";
import ArticleDetailContent from "../components/creatorDashboard/ArticleDetailContent.jsx";

/**
 * Standalone article detail page (e.g. when opening shared link /article/:articleId).
 * For counsellor viewing from dashboard, article opens inside Manage My Content via CreatorVideos.
 */
const ArticleDetail = () => {
  const navigate = useNavigate();
  const { articleId } = useParams();

  return (
    <>
      <Headers />
      <ArticleDetailContent
        articleId={articleId}
        onBack={() => navigate(-1)}
        embedded={false}
      />
    </>
  );
};

export default ArticleDetail;
