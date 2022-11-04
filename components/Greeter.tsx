import React from "react";

import Link from "next/link";

import Image from "next/image";
import { useRouter } from "next/router";
import { category } from "../utils/initialValues";
import { GrLinkNext } from "react-icons/gr";
const mailInfo = {
  id: "reachus@humservices.org",
  subject: "Enquiry or Issue",
};
const Greeter = () => {
  const router = useRouter();
  return (
    <div className="greeter-container">
      <div className="greeter-banner-wrapper"></div>
      <h1 className="greeter-header">
        Trivandrum is Now Just a <span>Hum</span> Away
      </h1>
      <button
        className="order-now-btn"
        onClick={() => router.replace("/account")}
      >
        Order Now <GrLinkNext />
      </button>
      <div className="banner-wrapper">
        <h3>Our Offers</h3>
        <div className="banner-slider">
          <div className="slide slide-1">
            <Image
              src={"/banner.jpg"}
              alt="banner"
              //   fill
              //   sizes="(max-width: 768px) 100vw,
              //  (max-width: 500px) 50vw,
              //  33vw"
              width="1000"
              height="700"
            />
          </div>
        </div>
      </div>

      <div className="greeter-text">
        <div className="line">
          Building communities... and communities within communities.
        </div>
        <div className="line">
          HUM is a community platform that aims to connect professional and
        </div>
        <div className="line">qualified service providers with clients.</div>
      </div>

      <div className="slider-partner">
        <h2>Our store partners</h2>
        <div className="slider-container">
          {category.map((item) => (
            <div key={item}>
              <Image src={`/${item}.png`} width="150" height="100" alt={item} />
            </div>
          ))}
        </div>
      </div>
      <div className="contact-container">
        <h2>Get in Touch</h2>
        <p>
          Choose from a wide variety of stores and supermarkets to purchase
          from.All you need to do is, Tell us where to go, What needs to be done
          and when.
        </p>

        <div className="contact-links">
          <div className="contact-icon-wrapper">
            <Link
              href={`https://wa.me/+919400200462`}
              rel="noopener noreferrer"
              target="_blank"
            >
              Whatsapp
            </Link>
          </div>
          <div className="contact-icon-wrapper">
            <Link href={`mailto:${mailInfo.id}?subject=${mailInfo.subject}`}>
              Mail Us
            </Link>
          </div>
          <div className="contact-icon-wrapper">
            <Link href="https://www.google.com/maps/place/HUM+Services/@8.544003,76.941334,16z/data=!4m5!3m4!1s0x0:0xc678b6d2dd551d4c!8m2!3d8.5440035!4d76.9413335?hl=en">
              Find Us
            </Link>
          </div>
        </div>
      </div>
      {/* <div className="greeter-main-content">
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
      </div> */}
    </div>
  );
};

export default Greeter;
