import React from "react";
import Image from "next/image";
import Link from "next/link";
const Info = () => {
  return (
    <div className="info-container">
      <div className="info-wrapper">
        <div className="info-img">
          <Image
            src="/static/package.jpg"
            alt="Info"
            width="600"
            height="700"
          />
        </div>
        <div className="info-text">
          <h2>Why HUM ?</h2>
          <div className="info-text-p">
            <p>
              HUM is a community platform that aims to connect professional and
              qualified service providers with clients. Inspired from the
              Buddhist school of thought, HUM intends to build a safe network
              where members of the community can give and receive.
            </p>
            <p>
              The services that we offer range from Electricians and Car
              mechanics to Piano Tuners and local couriers.
            </p>
            <p>
              You will have an option to rate and give feedback at the end of
              each service, helping us get better each time.
            </p>
          </div>
          <Link href="" className="contact-button">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Info;
