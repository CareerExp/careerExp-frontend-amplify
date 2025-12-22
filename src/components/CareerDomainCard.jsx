import React from "react";
import "../styles/CareerDomainCard.css";

const DefaultFocusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M14.9971 7.91309C15.0815 7.93481 15.1503 7.9859 15.1982 8.04395C15.2613 8.12043 15.2988 8.22066 15.2988 8.32324V8.33008C15.2447 9.80308 14.6964 11.1987 13.7305 12.292L17.9229 16.4932L17.9365 16.5068L17.9482 16.5234C18.0522 16.6807 18.0374 16.8701 17.96 17.0264L17.9463 17.0557L17.9229 17.0791C17.7625 17.2405 17.4982 17.2405 17.3379 17.0791L13.1729 12.8779C10.8805 14.8901 7.44291 14.9609 5.08789 12.9766V12.9756C4.91325 12.8365 4.88921 12.6105 4.99414 12.4463L5.04785 12.3789C5.17236 12.2313 5.42046 12.1835 5.59082 12.3398L5.5918 12.3389C6.51345 13.1092 7.67395 13.5358 8.86328 13.5898H8.86426C11.7792 13.693 14.2504 11.4724 14.498 8.57129L14.5156 8.28809C14.5194 8.07231 14.6881 7.90234 14.9072 7.90234L14.9971 7.91309ZM3.71973 9.06836C3.71973 9.17104 3.68235 9.27114 3.61914 9.34766C3.56361 9.41483 3.48032 9.46941 3.37695 9.4834L3.28906 9.49512C3.0883 9.49874 2.92928 9.33966 2.8877 9.17188L2.88574 9.16406L2.88477 9.15625C2.82816 8.81359 2.79983 8.44391 2.7998 8.10254C2.7998 4.62468 5.59809 1.80006 9.07617 1.7998C10.8856 1.7998 12.5837 2.57024 13.7715 3.93945L13.7803 3.94922L13.7871 3.96094C13.8869 4.11205 13.8927 4.35684 13.7354 4.51562C13.5611 4.69142 13.2934 4.6374 13.1689 4.47754V4.47852C11.1883 2.21418 7.73052 1.97608 5.48828 3.99805L5.4873 3.99902C4.32507 5.03819 3.6377 6.55811 3.6377 8.12988C3.6377 8.44963 3.66423 8.74155 3.7168 9.0332L3.71973 9.05078V9.06836ZM18.2002 6.25195C18.2002 6.51483 17.9861 6.67273 17.7812 6.67285C17.5163 6.67285 17.3623 6.45441 17.3623 6.25195V3.83887L12.2842 8.96094C11.8228 9.42626 11.0933 9.42627 10.6318 8.96094L9.31738 7.63574C9.17664 7.49388 8.94832 7.49381 8.80762 7.63574L3.55273 12.9365C3.39237 13.0983 3.12813 13.0983 2.96777 12.9365L2.95312 12.9229L2.94238 12.9062C2.84368 12.7567 2.84376 12.5597 2.94238 12.4102L2.95312 12.3936L2.96777 12.3789L8.25 7.0498L8.25586 7.04492L8.34473 6.96973C8.8048 6.61599 9.466 6.64092 9.89746 7.04492L9.90332 7.0498L11.2168 8.37598C11.3575 8.51767 11.5859 8.51765 11.7266 8.37598L16.7822 3.27637H14.4414C14.1768 3.27626 14.0227 3.05872 14.0225 2.85645C14.0225 2.59356 14.2366 2.43565 14.4414 2.43555H14.4434L18.002 2.46289L18.2002 2.46387V6.25195Z"
      fill="white"
      stroke="white"
      strokeWidth="0.4"
    />
  </svg>
);

const CareerDomainCard = ({
  gradient = "#B01EFF 0%, #E1467C 100%",
  icon = null,
  title = "",
  content = "",
  focus = "",
  focusText = "",
  focusIcon = null,
}) => {
  const renderIcon = (nodeOrUrl, fallback) => {
    if (!nodeOrUrl) return fallback;
    if (React.isValidElement(nodeOrUrl)) return nodeOrUrl;
    if (typeof nodeOrUrl === "string")
      return (
        <img
          src={nodeOrUrl}
          alt="icon"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
      );
    return fallback;
  };

  return (
    <div className="career-card">
      {/* gradient top bar */}
      <div
        className="top-border-gradient"
        style={{
          background: `linear-gradient(135deg, ${gradient})`,
        }}
      />

      <div className="career-card-content">
        {/* title row */}
        <div className="title-row">
          <div
            className="icon-box"
            style={{
              background: `linear-gradient(135deg, ${gradient})`,
            }}
          >
            {icon}
          </div>
          <h2 className="title">{title}</h2>
        </div>

        {/* description */}
        <p className="desc">{content}</p>

        {/* focus box */}
        {/* {focus && (
          <div className="focus-box">
            <div className="focus-left">
              <div
                className="focus-icon-circle"
                style={{
                  background:
                    +focus.split("%")[0] > 90
                      ? "linear-gradient(147deg, #47778E 19.71%, #014D72 79.15%)"
                      : "",
                }}
              >
                {+focus.split("%")[0] > 90 ? (
                  renderIcon(focusIcon, <DefaultFocusIcon />)
                ) : (
                  <div class="main-container">
                    <div class="icon-group">
                      <div class="ring ring-ping"></div>
                      <div class="ring ring-pulse-1"></div>
                      <div class="ring ring-pulse-2"></div>

                      <div class="icon-container">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="size-[18px]"
                        >
                          <path d="M16 7h6v6" />
                          <path d="m22 7-8.5 8.5-5-5L2 17" />
                        </svg>
                        <div class="inner-glow"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="focus-label">Future Focus Score</div>
            </div>

            <div className="focus-right">
              <div className="focus-value-row">
                <h4 className="focus-value">{focus}</h4>
                <p className="focus-text">{focusText}</p>
              </div>
            </div>
          </div>
        )} */}
        {focus && (
          <div className="focus-box">
            <div className="focus-left">
              <div
                className="focus-icon-circle"
                style={{
                  background: +focus.split("%")[0] > 90 ? "" : "",
                }}
              >
                {/* 🔁 Pulse effect – ALWAYS rendered */}
                <div className="main-container">
                  <div className="icon-group">
                    <div className="ring ring-ping"></div>
                    <div className="ring ring-pulse-1"></div>
                    <div className="ring ring-pulse-2"></div>

                    <div className="icon-container">
                      {+focus.split("%")[0] > 90 ? (
                        renderIcon(focusIcon, <DefaultFocusIcon />)
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="size-[18px]"
                        >
                          <path d="M16 7h6v6" />
                          <path d="m22 7-8.5 8.5-5-5L2 17" />
                        </svg>
                      )}
                      <div className="inner-glow"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="focus-label">Future Focus Score</div>
            </div>

            <div className="focus-right">
              <div className="focus-value-row">
                <h4 className="focus-value">{focus}</h4>
                <p className="focus-text">{focusText}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerDomainCard;
