import React from "react";

import Link from "next/link";
import DeliveryIcon from "./DeliveryIcon";
import WhatsappIcon from "./WhatsappIcon";
import EmailIcon from "./EmailIcon";
import GmapIcon from "./GmapIcon";
import { useRouter } from "next/router";

const mailInfo = {
  id: "reachus@humservices.org",
  subject: "Enquiry or Issue",
};
const Greeter = () => {
  const router = useRouter();
  return (
    <div className="greeter-container">
      <div className="greeter-main-content">
        <div className="greeter-text">
          <h1 className="greeter-header">
            Trivandrum is Now Just a <span>Hum</span> Away
          </h1>
          <p className="greeter-tagline">
            Building communities... and communities within communities.
          </p>
          <div className="greeter-btn-wrapper">
            <Link href="/account" className="greeter-order-btn">
              Order Now
            </Link>
          </div>
        </div>
        <div className="greeter-img-wrapper">
          <DeliveryIcon />
        </div>
      </div>

      <div className="contact-container">
        <div className="contact-icon-wrapper">
          <Link
            href={`https://wa.me/+919400200462`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <WhatsappIcon />
          </Link>
        </div>
        <div className="contact-icon-wrapper">
          <Link href={`mailto:${mailInfo.id}?subject=${mailInfo.subject}`}>
            <EmailIcon />
          </Link>
        </div>
        <div className="contact-icon-wrapper">
          <Link href="https://www.google.com/maps/place/HUM+Services/@8.544003,76.941334,16z/data=!4m5!3m4!1s0x0:0xc678b6d2dd551d4c!8m2!3d8.5440035!4d76.9413335?hl=en">
            <GmapIcon />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Greeter;
